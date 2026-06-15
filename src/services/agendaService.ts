import { agendaApi as api } from './apiClient'
import { theme } from '../theme'
import type { AgendaItem } from '../types/agenda'

type AgendaFiltros = {
  unidade: number
  data: string
  datafim?: string
  profissional?: number
  status?: number
}

function getColorByStatus(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('cancelad')) return theme.colors.error[60]
  if (s.includes('atendido')) return theme.colors.success[60]
  if (s.includes('falta') || s.includes('pendente')) return theme.colors.warning[60]
  return theme.colors.info[60] // Agendado (e demais) → azul
}

export const agendaService = {
  async getAgenda(filtros: AgendaFiltros): Promise<AgendaItem[]> {
    console.log('[agendaService] GET codedatas/listagendasFiltrado — payload:', JSON.stringify(filtros))

    const { data } = await api.get<AgendaItem[]>('codedatas/listagendasFiltrado', {
      params: filtros,
    })

    return [...data]
      .map((item: any) => ({
        ...item,
        cor: getColorByStatus(item.status),
        pacienteId: item.idpaciente ?? null,
      }))
      .sort((a, b) => a.hora.localeCompare(b.hora))
  },
}
