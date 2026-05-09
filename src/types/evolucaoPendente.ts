export type TipoEvolucao = {
  id: number
  tipo: string
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
}
