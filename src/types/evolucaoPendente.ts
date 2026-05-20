export type EvolucaoStatusType = 'realizada' | 'pendente' | 'cancelada'

export type TipoEvolucao = {
  id: number
  tipo: string
}

export type EvolucaoAPI = {
  id: number
  data: string
  hora: string | null
  tipo: string
  pendente: boolean
  paciente_id: number
  paciente_nome: string
}

export type EvolucaoPendente = {
  id: number
  tipoevolucao: TipoEvolucao | null
  evolucao: string | null
  codigoAgendamento: number | null
  profissionalnome: string | null
  dataform: string | null
  hora: string | null
  pacientenome: string | null
  pacienteid: number | null
  status: EvolucaoStatusType
}

export type Pendencia = {
  id: number
  tipo: string | null
  data: string
  hora: string | null
  paciente_nome: string
  paciente_id: number
  pendente: boolean
}
