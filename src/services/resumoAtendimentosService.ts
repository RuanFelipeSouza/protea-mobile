import { pacienteApi } from './pacienteDataService'
import type { ResumoAtendimentosPlano } from '../types/resumoAtendimentos'

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'

const MOCK_RESUMO: ResumoAtendimentosPlano = {
  planoCuidadoId: 501,
  geral: { atendidos: 15, agendados: 6, faltas: 2, cancelados: 1 },
  porEspecialidade: [
    { especialidadeId: 1, nome: 'Psicologia', atendidos: 6, agendados: 2, faltas: 1, cancelados: 0 },
    { especialidadeId: 2, nome: 'Fonoaudiologia', atendidos: 4, agendados: 2, faltas: 0, cancelados: 1 },
    { especialidadeId: 3, nome: 'Terapia Ocupacional', atendidos: 5, agendados: 2, faltas: 1, cancelados: 0 },
  ],
  progressoTemporal: { dataInicio: '01/01/2026', dataPrevistaFim: '31/12/2026', percentualDecorrido: 55 },
}

/**
 * Resumo de execução (atendidos/agendados/faltas/cancelados) do Plano de
 * Cuidado ATIVO do paciente, geral e por especialidade.
 *
 * O mapeamento status-da-agenda -> {atendido|agendado|falta|cancelado} é
 * feito 100% no backend (fonte única de verdade) — o mobile só soma e exibe.
 * GET /api/mobile/paciente/:pacienteId/plano-ativo/resumo-atendimentos
 */
export async function getResumoAtendimentos(
  pacienteId: number,
): Promise<ResumoAtendimentosPlano | null> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_RESUMO
  }

  try {
    const { data } = await pacienteApi.get<ResumoAtendimentosPlano>(
      `/api/mobile/paciente/${pacienteId}/plano-ativo/resumo-atendimentos`,
    )
    return data ?? null
  } catch (e: any) {
    // 404 = sem Plano de Cuidado ativo -> estado vazio, não erro.
    if (e?.response?.status === 404) return null
    throw e
  }
}
