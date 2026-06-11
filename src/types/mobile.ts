export type PacienteMobile = {
  id: number
  nome: string
  datanascimento: string | null
}

export type EvolucaoStatus = 'realizada' | 'pendente' | 'cancelada'

export type EvolucaoMobile = {
  id: number
  data: string
  hora: string | null
  tipo: string | null
  status: EvolucaoStatus
}

export type AssinaturaCertificada = {
  id: number
  documento_fk: number
  tcn: string
  result: string
  assinado_por: {
    id: number
    nome: string
  } | null
  assinado_em: string | null
  storage_url: string | null
}

export type EvolucaoDetalhes = {
  id: number
  data: string
  hora: string
  tipo: string
  evolucao: string
  paciente_id: number
  paciente_nome: string
  storage_url?: string | null
  assinatura?: AssinaturaCertificada | null
  pode_assinar?: boolean
}

export function isAssinado(evolucao: EvolucaoDetalhes): boolean {
  return !!evolucao.assinatura?.tcn
}
