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
}
