export type PerfilPaciente = {
  id: number
  nome: string
  nomesocial: string | null
  datanascimento: string
  idade: number
  sexo: string
  cid: string | null
  cpf: string | null
  cns: string | null
  demanda_judicial: boolean
  foto_url: string | null
  telefone: string | null
  nomeresponsavel: string | null
  telefone_responsavel: string | null
  periodo_ativo: unknown
  plano_cuidado_ativo: unknown
  ultima_evolucao: unknown
  ultimo_agendamento: unknown
  ultimos_vitais: unknown
}
