import { proteaApi } from './apiClient'
import type { DadosAssinados, CertificadoInfo } from '../types/assinatura'

export const assinaturaService = {
  async getCertificadoInfo(): Promise<CertificadoInfo> {
    const { data } = await proteaApi.post<CertificadoInfo>(
      'prestador/cpfCertificado'
    )
    return data
  },

  async autenticarCertificado(senha: string, cpf: string): Promise<any> {
    const { data } = await proteaApi.post(
      'prestador/autenticarCertificado',
      { senha, cpf }
    )
    return data
  },

  async buscarCertificadoAlias(token: string): Promise<any> {
    const { data } = await proteaApi.post(
      'prestador/buscarCertificadoAlias',
      { token }
    )
    return data
  },

  async assinarDocumento(
    token: string,
    certificado_alias: string,
    fileBase64: string
  ): Promise<any> {
    const { data } = await proteaApi.post(
      'prestador/assinarDocumento',
      { token, certificado_alias, file_data: fileBase64 }
    )
    return data
  },

  async salvarDadosAssinatura(dados: DadosAssinados): Promise<any> {
    const { data } = await proteaApi.post(
      'prestador/salvarDadosAssinatura',
      dados
    )
    return data
  },
}
