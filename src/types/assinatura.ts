export type DadosAssinados = {
  tcn: string
  documento_fk: number
  result: string
}

export type CertificadoInfo = {
  id: number
  cpf: string
  habilitar: boolean
}

export type CertificadoAlias = {
  alias: string
  subjectDN: string
}

export type AssinarDocumentoResponse = {
  tcn: string
  result: string
}

export type StatusAssinatura = 'pendente' | 'assinado' | 'erro'
