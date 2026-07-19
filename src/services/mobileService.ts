import type { EvolucaoMobile, PerfilProfissional } from '../types/mobile';
import type { Unidade } from '../types/unidade';
import type { GardenStatusPaciente } from '../types/pacienteContextTypes';
import { proteaApi } from './apiClient';

export const mobileService = {
  async getMinhasUnidades(signal?: AbortSignal): Promise<Unidade[]> {
    const { data } = await proteaApi.get<Unidade[]>('api/mobile/prestador/unidades', { signal });
    return data;
  },

  async getMeuPerfil(signal?: AbortSignal): Promise<PerfilProfissional | null> {
    try {
      const { data } = await proteaApi.get<PerfilProfissional>('api/mobile/prestador/meu-perfil', { signal });
      return data;
    } catch {
      return null;
    }
  },

  async getEvolucoesDoPaciente(
    unidadeId: number,
    pacienteId: number,
    signal?: AbortSignal,
  ): Promise<EvolucaoMobile[]> {
    const { data } = await proteaApi.get<EvolucaoMobile[]>(
      `api/mobile/prestador/unidade/${unidadeId}/paciente/${pacienteId}/evolucoes`,
      { signal },
    );
    return data;
  },

  async getProntuarioGarden(
    pacienteId: string,
    signal?: AbortSignal,
  ): Promise<GardenStatusPaciente | null> {
    try {
      const { data } = await proteaApi.get<GardenStatusPaciente>(
        `api/mobile/prestador/paciente/${pacienteId}/garden`,
        { signal },
      );
      return data ?? null;
    } catch {
      return null;
    }
  },
};
