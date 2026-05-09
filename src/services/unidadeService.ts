import { agendaApi } from './apiClient'
import type { Unidade } from '../types/unidade'

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'

const MOCK_UNIDADES: Unidade[] = [
  { id: 1, unidade: 'Unidade Centro' },
  { id: 2, unidade: 'Unidade Norte' },
  { id: 3, unidade: 'Unidade Sul' },
]

/**
 * Serviço de Unidades — consome o endpoint `codedatas/unidadesPrest` da
 * API de agenda, que retorna as unidades vinculadas ao usuário logado.
 *
 * Esta é a fonte de verdade única do app para a lista de unidades,
 * substituindo o método legado `agendaService.getUnidades`.
 */
export const unidadeService = {
  async listarPorUsuario(userId: number, signal?: AbortSignal): Promise<Unidade[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300))
      return MOCK_UNIDADES
    }

    const { data } = await agendaApi.get<Unidade[]>('unidade/unidadesPrest', {
      params: { user: userId },
      signal,
    })
    return data
  },
}
