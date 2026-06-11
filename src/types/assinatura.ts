export type CertificadoInfo = {
  cpf: string
  habilitar: boolean
}

export type AssinarResponse =
  | { success: true; storage_url: string }
  | { success: false; erro: string }

export type StatusAssinatura = 'pendente' | 'assinado' | 'erro'
