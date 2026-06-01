import type { AssinarDocumentoResponse, CertificadoAlias, CertificadoInfo, DadosAssinados } from '../types/assinatura';
import { proteaApi } from './apiClient';

export const assinaturaService = {
  async getCertificadoInfo(): Promise<CertificadoInfo> {
    const { data } = await proteaApi.post<CertificadoInfo>('mobile/assinatura/cpfCertificado');
    return data;
  },

  async autenticarCertificado(senha: string, cpf: string): Promise<any> {
    const { data } = await proteaApi.post('mobile/assinatura/autenticarCertificado', { senha, cpf });
    return data;
  },

  async buscarCertificadoAlias(token: string): Promise<CertificadoAlias[]> {
    const { data } = await proteaApi.post('mobile/assinatura/buscarCertificadoAlias', { token });
    return data;
  },

  async assinarDocumento(
    token: string,
    certificado_alias: string,
    fileBase64: string,
  ): Promise<AssinarDocumentoResponse> {
    const { data } = await proteaApi.post('mobile/assinatura/assinarDocumento', {
      token,
      certificado_alias,
      file_data: fileBase64,
    });
    return data;
  },

  async salvarDadosAssinatura(dados: DadosAssinados): Promise<any> {
    const { data } = await proteaApi.post('mobile/assinatura/salvarDadosAssinatura', dados);
    return data;
  },
};
