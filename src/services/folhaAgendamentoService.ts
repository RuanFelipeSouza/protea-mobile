import type { AgendaItem } from '../types/agenda';

/** Estado da folha de registro para um agendamento. */
export type FolhaAgendamentoStatus =
  | 'sem_plano'
  | 'pendente'
  | 'preenchida'
  | 'concluida';

export type FolhaDoAgendamento = {
  /** Id que as rotas `/folha-registro/**` consomem. Hoje = evolucao_id. */
  chaveEditor: number | null;
  /** Só resolve se HÁ vínculo — o estado fino (pendente/preenchida/concluida) é sondado por `useFolhaAgendamento`. */
  status: 'sem_plano' | 'pendente';
};

/**
 * Resolve o vínculo agendamento → folha de registro.
 *
 * ⚠️ Único ponto a mudar quando o backend decidir o vínculo (ver §VÍNCULO do
 * handoff "Folha de Registro pela Agenda"):
 *  - Opção 1 (atual): agenda passa a devolver `evolucao_id` → chaveEditor = item.evolucaoId
 *  - Opção 2: chave passa a ser o id do agendamento → chaveEditor = item.id
 *  - Opção 3: preencher cria a evolução → resolvido dentro do próprio editor (função vira async)
 *
 * Enquanto o backend não envia `evolucaoId`, devolve `sem_plano` — a faixa
 * some da Agenda e nada quebra.
 */
export function resolverFolhaDoAgendamento(item: AgendaItem): FolhaDoAgendamento {
  const temPlanoDeCuidado =
    item.id_agendamento_plano_cuidado != null || item.planodecuidadofk_id != null;

  const chaveEditor = temPlanoDeCuidado ? item.evolucaoId ?? null : null;

  return chaveEditor == null
    ? { chaveEditor: null, status: 'sem_plano' }
    : { chaveEditor, status: 'pendente' };
}
