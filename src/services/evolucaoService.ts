import { proteaApi } from './apiClient'
import type { EvolucaoRealizada } from '../types/evolucao'
import type { Acompanhamento } from '../types/acompanhamento'
import type { DocumentoEvolucao } from '../types/documento'
import type { EvolucaoPendente, EvolucaoAPI, EvolucaoStatusType } from '../types/evolucaoPendente'
import type { EvolucaoDetalhes } from '../types/mobile'

export const evolucaoService = {
  async getEvolucaoDetalhes(evolucaoId: number): Promise<EvolucaoDetalhes> {
    console.log('[evolucaoService] getEvolucaoDetalhes chamado com ID:', evolucaoId)
    const { data } = await proteaApi.get<EvolucaoDetalhes>(
      `mobile/evolucoes/${evolucaoId}`
    )
    console.log('[evolucaoService] getEvolucaoDetalhes retornou:', data)
    return data
  },

  async getEvolucoes(pacienteId: string | number): Promise<EvolucaoRealizada[]> {
    const { data } = await proteaApi.post<EvolucaoRealizada[]>(
      `paciente/prontuario/allEvolucoesRealizadas?pacienteid=${pacienteId}`,
    )
    return data
  },

  async getDocumentos(pacienteId: string | number): Promise<DocumentoEvolucao[]> {
    const { data } = await proteaApi.get<DocumentoEvolucao[]>(
      `paciente/prontuario/allEvolucoesPaciente?pacienteid=${pacienteId}`,
    )
    return data
  },

  async getAcompanhamentos(pacienteId: string | number): Promise<Acompanhamento[]> {
    const { data } = await proteaApi.post<Acompanhamento[]>(
      `paciente/prontuario/allAcompanhamento?paciente=${pacienteId}`,
    )
    return data
  },

  async getEvolucoesPendentes(unidadeId: number, page = 1): Promise<EvolucaoPendente[]> {
    const { data } = await proteaApi.get<{
      count: number
      next?: string | null
      previous?: string | null
      results: EvolucaoAPI[]
    }>(`mobile/unidade/${unidadeId}/evolucoes?page=${page}`)

    return data.results.map((item) => ({
      id: item.id,
      tipoevolucao: { id: 0, tipo: item.tipo },
      evolucao: null,
      codigoAgendamento: null,
      profissionalnome: null,
      dataform: item.data,
      hora: item.hora,
      pacientenome: item.paciente_nome,
      pacienteid: item.paciente_id,
      status: item.pendente ? 'pendente' : ('realizada' as EvolucaoStatusType),
    }))
  },
}
