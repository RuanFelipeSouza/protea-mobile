import { proteaApi } from './apiClient'
import type { EvolucaoRealizada } from '../types/evolucao'
import type { Acompanhamento } from '../types/acompanhamento'
import type { DocumentoEvolucao } from '../types/documento'
import type { EvolucaoPendente, EvolucaoAPI, EvolucaoStatusType, Pendencia } from '../types/evolucaoPendente'
import type { EvolucaoDetalhes } from '../types/mobile'
import type { PerfilPaciente } from '../types/perfilPaciente'

export const evolucaoService = {
  async getEvolucaoDetalhes(evolucaoId: number): Promise<EvolucaoDetalhes> {
    console.log('[evolucaoService] 🔄 getEvolucaoDetalhes chamado com ID:', evolucaoId)
    try {
      const endpoint = `api/mobile/prestador/evolucao/${evolucaoId}`
      console.log('[evolucaoService] 📡 Requisição para:', endpoint)
      const { data } = await proteaApi.get<EvolucaoDetalhes>(endpoint)
      console.log('[evolucaoService] ✅ Resposta recebida:', data)
      return data
    } catch (error) {
      console.error('[evolucaoService] ❌ Erro na requisição:', error)
      throw error
    }
  },

  async getEvolucoes(
    pacienteId: string | number,
    unidadeId?: number,
    signal?: AbortSignal,
  ): Promise<EvolucaoRealizada[]> {
    // Somente as evoluções feitas pelo profissional logado (regra "minhas evoluções").
    const { data } = await proteaApi.get<EvolucaoRealizada[]>(
      `api/mobile/prestador/paciente/${pacienteId}/evolucoes`,
      {
        params: unidadeId != null ? { unidade_id: unidadeId } : {},
        signal,
      },
    )
    return data
  },

  async getDocumentos(pacienteId: string | number): Promise<DocumentoEvolucao[]> {
    const { data } = await proteaApi.get<DocumentoEvolucao[]>(
      `api/core/paciente/prontuario/allEvolucoesPaciente?pacienteid=${pacienteId}`,
    )
    return data
  },

  async getAcompanhamentos(pacienteId: string | number): Promise<Acompanhamento[]> {
    const { data } = await proteaApi.post<Acompanhamento[]>(
      `api/core/paciente/prontuario/allAcompanhamento?paciente=${pacienteId}`,
    )
    return data
  },

  async getEvolucoesPendentes(unidadeId: number, page = 1): Promise<EvolucaoPendente[]> {
    const { data } = await proteaApi.get<{
      count: number
      next?: string | null
      previous?: string | null
      results: EvolucaoAPI[]
    }>(`api/mobile/prestador/unidade/${unidadeId}/evolucoes?page=${page}`)

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

  async getPerfilPaciente(pacienteId: string | number): Promise<PerfilPaciente> {
    const { data } = await proteaApi.get<PerfilPaciente>(`api/mobile/prestador/paciente/${pacienteId}/perfil`)
    return data
  },

  async getPendencias(unidadeId: number, page = 1): Promise<Pendencia[]> {
    const { data } = await proteaApi.get<{
      count: number
      next?: string | null
      previous?: string | null
      results: Pendencia[]
    }>(`api/mobile/prestador/unidade/${unidadeId}/pendencias?page=${page}`)

    return data.results
  },
}
