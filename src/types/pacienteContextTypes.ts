export type AgendamentoStatus = 'confirmado' | 'agendado' | 'realizado' | 'falta'

export interface AgendamentoPaciente {
  id: string | number
  data: string
  diaSemana: string
  hora: string
  modalidade: string
  profissional: string
  local?: string | null
  status: AgendamentoStatus
}

export interface EvolucaoPaciente {
  id: string | number
  tipo: string
  modalidade: string
  profissional: string
  data: string
  hora: string
}

export interface EvolucaoPacienteDetalhe extends EvolucaoPaciente {
  objetivo?: string | null
  conduta?: string | null
  orientacoes?: string | null
  conteudoHtml?: string | null
}

export interface PerfilPacienteContexto {
  id: number
  nome: string
  nomesocial?: string | null
  datanascimento: string
  idade: number
  sexo: string
  cpf?: string | null
  cns?: string | null
  nomeresponsavel?: string | null
  email?: string | null
  telefone?: string | null
  foto_url?: string | null
}

export interface PacienteAuthResponse {
  token: string
  paciente_id: number
  nome: string
  email?: string | null
  primeiro_acesso?: boolean
  mensagem?: string | null
}
