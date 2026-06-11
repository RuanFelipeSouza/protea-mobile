import type { AssinarResponse, CertificadoInfo } from '../types/assinatura';
import { proteaApi } from './apiClient';

export const assinaturaService = {
  async getCertificadoInfo(): Promise<CertificadoInfo> {
    const { data } = await proteaApi.get<CertificadoInfo>('mobile/prestador/assinatura/cpf-certificado');
    return data;
  },

  async assinarEvolucao(senha: string, evolucaoId: number): Promise<AssinarResponse> {
    const { data } = await proteaApi.post<AssinarResponse>(
      'mobile/prestador/assinatura/assinar',
      { senha, evolucao_id: evolucaoId },
    );
    return data;
  },
};
