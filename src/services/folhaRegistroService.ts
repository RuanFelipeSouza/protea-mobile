import type {
  FolhaRegistro,
  FolhaRegistroView,
  Resultado,
  Tentativa,
} from '../types/folhaRegistro';
import { proteaApi } from './apiClient';

export const folhaRegistroService = {
  async getFolhaRegistro(evolucaoId: number): Promise<FolhaRegistroView> {
    console.log('[folhaRegistroService] 🔄 getFolhaRegistro chamado com ID:', evolucaoId);
    try {
      const endpoint = `api/mobile/prestador/evolucao/${evolucaoId}/folha-registro`;
      console.log('[folhaRegistroService] ► GET', endpoint);
      const { data } = await proteaApi.get<FolhaRegistroView>(endpoint);
      console.log(
        '[folhaRegistroService] ✓ getFolhaRegistro resposta:',
        JSON.stringify(data),
      );
      return data;
    } catch (error: any) {
      console.error(
        '[folhaRegistroService] ❌ getFolhaRegistro erro:',
        error?.response?.status ?? 'SEM_RESPOSTA',
        JSON.stringify(error?.response?.data ?? error?.message),
      );
      throw error;
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Cálculo — espelha 1:1 a lógica de criar-folha-registro.component.ts (web).
// Tentativa válida = resultado ∈ {0, 0.5, 1}. N/A (-1/null) NÃO entra no cálculo.
// ─────────────────────────────────────────────────────────────────────────────
const round1 = (n: number) => Math.round(n * 10) / 10;

export type ResumoFolha = {
  pct: number;
  validas: number;
  total: number;
  soma: number;
  counts: { ok: number; half: number; err: number; na: number };
};

export function resultKey(r: Resultado): keyof ResumoFolha['counts'] {
  if (r === 1) return 'ok';
  if (r === 0.5) return 'half';
  if (r === 0) return 'err';
  return 'na';
}

export function calcFolha(tentativas: Tentativa[]): ResumoFolha {
  const validas = tentativas.filter(
    (t) => t.resultado != null && [0, 0.5, 1].includes(t.resultado),
  );
  const soma = validas.reduce((acc, t) => acc + (t.resultado as number), 0);
  const pct = validas.length ? round1((soma / validas.length) * 100) : 0;
  const counts = { ok: 0, half: 0, err: 0, na: 0 };
  tentativas.forEach((t) => {
    counts[resultKey(t.resultado)]++;
  });
  return { pct, validas: validas.length, total: tentativas.length, soma, counts };
}

export function calcGeral(folhas: FolhaRegistro[]) {
  let soma = 0;
  let validas = 0;
  const counts = { ok: 0, half: 0, err: 0, na: 0 };
  folhas.forEach((f) => {
    const r = calcFolha(f.tentativas);
    soma += r.soma;
    validas += r.validas;
    counts.ok += r.counts.ok;
    counts.half += r.counts.half;
    counts.err += r.counts.err;
    counts.na += r.counts.na;
  });
  const pct = validas ? round1((soma / validas) * 100) : 0;
  return { pct, validas, counts };
}

/** Agrupa tentativas por alvo, preservando a ordem de primeira aparição. */
export function groupByAlvo(tentativas: Tentativa[]) {
  const map = new Map<string, Tentativa[]>();
  tentativas.forEach((t) => {
    const k = t.alvo || '—';
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(t);
  });
  return [...map.entries()].map(([alvo, ts]) => ({
    alvo,
    tentativas: ts,
    ...calcFolha(ts),
  }));
}

/** Faixa de cor do percentual (≥80 bom · ≥50 médio · <50 crítico). */
export function bandTone(pct: number): 'ok' | 'warn' | 'err' {
  if (pct >= 80) return 'ok';
  if (pct >= 50) return 'warn';
  return 'err';
}
