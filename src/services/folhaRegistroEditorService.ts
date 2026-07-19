/**
 * Serviço da Folha de Registro — ESCRITA (criar / editar).
 *
 * Reutiliza o cálculo de `folhaRegistroService.ts` (calcFolha/calcGeral/bandTone).
 * Aqui ficam: busca da CONFIG, gravação (POST) e os helpers de estado
 * (novaFolha / montarDoRegistro / buildPayload / validar).
 *
 * ⚠️ Endpoints — ver BACKEND.md:
 *  - GET  api/mobile/prestador/evolucao/{id}/folha-registro/config?modo=criar|editar
 *  - POST api/mobile/prestador/evolucao/{id}/folha-registro   (mesmo payload do web,
 *         SEM disparar geração de PDF / assinatura — isso é uma tela à parte)
 */
import { proteaApi } from './apiClient';
import {
  TENTATIVAS_POR_FOLHA,
  type FolhaRegistroConfig,
  type FolhaEditorItem,
  type ProgramaOption,
  type RegistroSalvo,
  type SalvarFolhaRegistroPayload,
} from '../types/folhaRegistroEditor';

let _uid = 0;
const nextUid = () => `f${Date.now().toString(36)}_${_uid++}`;

export const folhaRegistroEditorService = {
  /** Config p/ montar os dropdowns. No modo edição devolve também `registros`. */
  async getConfig(
    evolucaoId: number,
    modo: 'criar' | 'editar',
  ): Promise<FolhaRegistroConfig> {
    const endpoint = `api/mobile/prestador/evolucao/${evolucaoId}/folha-registro/config`;
    console.log(
      '[folhaRegistroEditorService] ► GET',
      endpoint,
      '| modo:',
      modo,
    );
    try {
      const { data } = await proteaApi.get<FolhaRegistroConfig>(endpoint, {
        params: { modo },
      });
      console.log(
        '[folhaRegistroEditorService] ✓ getConfig resposta:',
        JSON.stringify(data),
      );
      return data;
    } catch (error: any) {
      console.error(
        '[folhaRegistroEditorService] ❌ getConfig erro:',
        error?.response?.status ?? 'SEM_RESPOSTA',
        '| body:',
        JSON.stringify(error?.response?.data ?? error?.message),
      );
      throw error;
    }
  },

  /** Grava os registros. NÃO gera PDF nem dispara assinatura (ver BACKEND.md). */
  async salvar(payload: SalvarFolhaRegistroPayload): Promise<void> {
    const endpoint = `api/mobile/prestador/evolucao/${payload.evolucao_id}/folha-registro`;
    console.log(
      '[folhaRegistroEditorService] ► POST',
      endpoint,
      '| payload:',
      JSON.stringify(payload),
    );
    try {
      const { data } = await proteaApi.post(endpoint, payload);
      console.log(
        '[folhaRegistroEditorService] ✓ salvar resposta:',
        JSON.stringify(data),
      );
    } catch (error: any) {
      console.error(
        '[folhaRegistroEditorService] ❌ salvar erro:',
        error?.response?.status ?? 'SEM_RESPOSTA',
        '| body:',
        JSON.stringify(error?.response?.data ?? error?.message),
      );
      throw error;
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de estado
// ─────────────────────────────────────────────────────────────────────────────
export function tentativasVazias() {
  return Array.from({ length: TENTATIVAS_POR_FOLHA }, (_, i) => ({
    numero: i + 1,
    alvo: null as string | null,
    resultado: -1 as const,
  }));
}

export function novaFolha(ordem: number): FolhaEditorItem {
  return {
    uid: nextUid(),
    ordem,
    dominioId: null,
    programaId: null,
    ajudaId: null,
    observacao: '',
    alvosSelecionados: [],
    tentativas: tentativasVazias(),
  };
}

/** Modo edição: transforma os `registros` (com ids) em estado de editor. */
export function montarDoRegistro(registros: RegistroSalvo[]): FolhaEditorItem[] {
  return registros.map((r, i) => ({
    uid: nextUid(),
    ordem: r.ordem ?? i + 1,
    dominioId: r.dominio_id ?? null,
    programaId: r.programa_id ?? null,
    ajudaId: r.ajuda_id ?? null,
    observacao: r.observacao ?? '',
    alvosSelecionados: (r.alvo || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    tentativas: padTentativas(r.tentativas),
  }));
}

/** Garante sempre 10 tentativas (preenche o que faltar com N/A). */
function padTentativas(
  ts: RegistroSalvo['tentativas'],
): FolhaEditorItem['tentativas'] {
  const base = tentativasVazias();
  (ts || []).forEach((t) => {
    const i = (t.numero ?? 0) - 1;
    if (i >= 0 && i < base.length) {
      base[i] = {
        numero: t.numero,
        alvo: t.alvo ?? null,
        resultado: (t.resultado ?? -1) as any,
      };
    }
  });
  return base;
}

export function alvoslimiteDoPrograma(
  config: FolhaRegistroConfig | null,
  programaId: number | null,
): number {
  if (!config || programaId == null) return 0;
  return config.programas.find((p) => p.id === programaId)?.alvoslimite ?? 0;
}

// ── Payload (espelha buildPayload() do web criar-folha-registro.component.ts) ─
export function buildPayload(
  evolucaoId: number,
  folhas: FolhaEditorItem[],
  config: FolhaRegistroConfig,
): SalvarFolhaRegistroPayload {
  return {
    evolucao_id: evolucaoId,
    registros: folhas.map((f) => ({
      ordem: f.ordem,
      dominio_id: f.dominioId!,
      programa_id: f.programaId!,
      ajuda_id: f.ajudaId!,
      observacao: f.observacao ?? '',
      alvo: f.alvosSelecionados.join(', '),
      alvoslimite: alvoslimiteDoPrograma(config, f.programaId),
      tentativas: f.tentativas.map((t) => ({
        numero: t.numero,
        alvo: t.alvo,
        // N/A (-1/null) vira null no payload — igual ao web.
        resultado: t.resultado != null && t.resultado >= 0 ? t.resultado : null,
      })),
    })),
  };
}

// ── Validação (espelha validarFolhas + validarTentativasFolhas do web) ──────
export type ValidacaoErro = { ordem: number; motivo: string };

export function validarFolhas(folhas: FolhaEditorItem[]): ValidacaoErro | null {
  for (const f of folhas) {
    if (!f.dominioId || !f.programaId || !f.ajudaId) {
      return { ordem: f.ordem, motivo: 'Preencha domínio, programa e ajuda.' };
    }
  }
  for (const f of folhas) {
    const validas = f.tentativas.filter(
      (t) => t.resultado != null && [0, 0.5, 1].includes(t.resultado),
    );
    if (validas.length === 0) {
      return { ordem: f.ordem, motivo: 'Registre ao menos 1 tentativa.' };
    }
  }
  return null;
}
