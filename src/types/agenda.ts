import type { Unidade } from './unidade'

/** @deprecated use `Unidade` from `types/unidade` */
export type UnidadeItem = Unidade

export type AgendaItem = {
  id: number
  data: string
  hora: string
  categoria: string
  profissional: string
  especialidade: string
  nome: string
  telefone: string
  email: string
  status: string
  sala: string
  cor: string
  unidade: number | null
  substituicao: boolean | null
  id_agendamento_plano_cuidado: number | null
  planodecuidadofk_id: number | null
  /**
   * Id do PACIENTE vinculado ao agendamento.
   *
   * ⚠️ Hoje o endpoint `codedatas/listagendasFiltrado` NÃO devolve este campo —
   * o `id` da raiz é o id do agendamento, não do paciente. Para o botão
   * "Ver paciente" do AgendaDetailSheet conseguir abrir `/prontuario/[id]`,
   * o backend precisa incluir o id do paciente neste payload (ex.: `pacienteId`
   * ou `paciente_id`). Mapeie-o aqui no `agendaService` quando disponível.
   */
  pacienteId?: number | null
  /**
   * Id da evolução vinculada ao atendimento — chave que a folha de registro
   * consome hoje (rotas `/folha-registro/**`).
   *
   * ⚠️ O endpoint `codedatas/listagendasFiltrado` ainda não devolve este
   * campo — ver `folhaAgendamentoService.resolverFolhaDoAgendamento`.
   * Enquanto não vier, a faixa de folha na Agenda fica oculta (`sem_plano`).
   */
  evolucaoId?: number | null
}
