import { agendaApi as api } from './apiClient'
import type { AgendaItem } from '../types/agenda'

type AgendaFiltros = {
  unidade: number
  data: string
  datafim?: string
  profissional?: number
  status?: number
}

export const agendaService = {
  async getAgenda(filtros: AgendaFiltros): Promise<AgendaItem[]> {
    const { data } = await api.get<AgendaItem[]>('codedatas/listagendasFiltrado', {
      params: filtros,
    })
    return [...data].sort((a, b) => a.hora.localeCompare(b.hora))
  },
}
