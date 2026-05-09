import { api } from './apiClient'
import type { EvolucaoRealizada } from '../types/evolucao'
import type { Acompanhamento } from '../types/acompanhamento'
import type { DocumentoEvolucao } from '../types/documento'
import type { EvolucaoPendente } from '../types/evolucaoPendente'

export const evolucaoService = {
  async getEvolucoes(pacienteId: string | number): Promise<EvolucaoRealizada[]> {
    const { data } = await api.post<EvolucaoRealizada[]>(
      `paciente/prontuario/allEvolucoesRealizadas?pacienteid=${pacienteId}`,
    )
    return data
  },

  async getDocumentos(pacienteId: string | number): Promise<DocumentoEvolucao[]> {
    const { data } = await api.get<DocumentoEvolucao[]>(
      `paciente/prontuario/allEvolucoesPaciente?pacienteid=${pacienteId}`,
    )
    return data
  },

  async getAcompanhamentos(pacienteId: string | number): Promise<Acompanhamento[]> {
    const { data } = await api.post<Acompanhamento[]>(
      `paciente/prontuario/allAcompanhamento?paciente=${pacienteId}`,
    )
    return data
  },

  async getEvolucoesPendentes(): Promise<EvolucaoPendente[]> {
    const { data } = await api.post<EvolucaoPendente[]>(
      'paciente/prontuario/allEvolucaoPendente',
    )
    return data
  },
}
