import type { EvolucaoMobile } from '../types/mobile';
import type { Unidade } from '../types/unidade';
import { proteaApi } from './apiClient';

export const mobileService = {
  async getMinhasUnidades(signal?: AbortSignal): Promise<Unidade[]> {
    const { data } = await proteaApi.get<Unidade[]>('mobile/prestador/unidades', { signal });
    return data;
  },

  async getEvolucoesDoPaciente(
    unidadeId: number,
    pacienteId: number,
    signal?: AbortSignal,
  ): Promise<EvolucaoMobile[]> {
    const { data } = await proteaApi.get<EvolucaoMobile[]>(
      `mobile/prestador/unidade/${unidadeId}/paciente/${pacienteId}/evolucoes`,
      { signal },
    );
    return data;
  },
};
