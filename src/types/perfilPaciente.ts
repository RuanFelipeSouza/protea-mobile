export type PeriodoAtivo = {
  id: number | null
  unidade: string | null
  data_entrada: string | null
  data_prevista_fim: string | null
  convenio: string | null
}

export type PlanoCuidadoAtivo = {
  id: number
  status: string | null
  performance: number | null
  data_inicio: string | null
  data_prevista_fim: string | null
}

export type UltimaEvolucaoPerfil = {
  id: number
  data: string
  hora: string | null
  tipo: string | null
  previa: string | null
  profissional: string | null
}

export type UltimoAgendamentoPerfil = {
  id: number
  data: string
  hora: string | null
  categoria: string | null
  profissional: string | null
  status: string | null
}

export type UltimosVitais = {
  data: string | null
  peso: string | null
  altura: string | null
  pa: string | null
  temperatura: string | null
  saturacao: string | null
  freqcard: string | null
}

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
  periodo_ativo: PeriodoAtivo | null
  plano_cuidado_ativo: PlanoCuidadoAtivo | null
  ultima_evolucao: UltimaEvolucaoPerfil | null
  ultimo_agendamento: UltimoAgendamentoPerfil | null
  ultimos_vitais: UltimosVitais | null
}
