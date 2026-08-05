import { pacienteApi } from './pacienteDataService'
import type {
  AtualizarFeedbackPayload,
  CriarFeedbackPayload,
  FeedbackAtendimento,
} from '../types/feedbackAtendimento'

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'

const MOCK_FEEDBACKS = new Map<number, FeedbackAtendimento>()

/**
 * Busca o feedback já enviado para um atendimento (ou null se ainda não avaliado).
 * GET /api/mobile/paciente/atendimentos/:agendaId/feedback
 */
export async function getFeedbackDoAtendimento(
  agendaId: number,
): Promise<FeedbackAtendimento | null> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    return MOCK_FEEDBACKS.get(agendaId) ?? null
  }

  try {
    const { data } = await pacienteApi.get<FeedbackAtendimento>(
      `/api/mobile/paciente/atendimentos/${agendaId}/feedback`,
    )
    return data ?? null
  } catch (e: any) {
    // 404 = ainda não avaliado; não é erro para a tela.
    if (e?.response?.status === 404) return null
    throw e
  }
}

/**
 * Cria o feedback do atendimento.
 * POST /api/mobile/paciente/atendimentos/:agendaId/feedback
 *
 * Regras validadas no backend (não confiar só no client):
 * - status do atendimento precisa ser "Atendido";
 * - responsável precisa ter vínculo ativo com o paciente;
 * - 1 feedback ativo por atendimento + responsável (duplicidade -> 409).
 */
export async function criarFeedbackAtendimento(
  payload: CriarFeedbackPayload,
): Promise<FeedbackAtendimento> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500))
    const now = new Date()
    const editavelAte = new Date(now.getTime() + 24 * 3600 * 1000)
    const fb: FeedbackAtendimento = {
      id: Math.floor(Math.random() * 100000),
      agendaId: payload.agendaId,
      nota: payload.nota,
      sentimento: sentimentoDaNota(payload.nota),
      comentario: payload.comentario?.trim() || null,
      critico: payload.nota <= 2,
      criadoEm: now.toISOString(),
      atualizadoEm: null,
      editavelAte: editavelAte.toISOString(),
    }
    MOCK_FEEDBACKS.set(payload.agendaId, fb)
    return fb
  }

  const { data } = await pacienteApi.post<FeedbackAtendimento>(
    `/api/mobile/paciente/atendimentos/${payload.agendaId}/feedback`,
    { nota: payload.nota, comentario: payload.comentario?.trim() || null },
  )
  return data
}

/**
 * Atualiza o feedback dentro da janela de edição (o backend recusa fora dela).
 * PUT /api/mobile/paciente/atendimentos/:agendaId/feedback
 */
export async function atualizarFeedbackAtendimento(
  agendaId: number,
  payload: AtualizarFeedbackPayload,
): Promise<FeedbackAtendimento> {
  if (USE_MOCK) {
    const existing = MOCK_FEEDBACKS.get(agendaId)
    if (!existing) throw new Error('Feedback não encontrado')
    const updated: FeedbackAtendimento = {
      ...existing,
      nota: payload.nota,
      sentimento: sentimentoDaNota(payload.nota),
      comentario: payload.comentario?.trim() || null,
      critico: payload.nota <= 2,
      atualizadoEm: new Date().toISOString(),
    }
    MOCK_FEEDBACKS.set(agendaId, updated)
    return updated
  }

  const { data } = await pacienteApi.put<FeedbackAtendimento>(
    `/api/mobile/paciente/atendimentos/${agendaId}/feedback`,
    { nota: payload.nota, comentario: payload.comentario?.trim() || null },
  )
  return data
}

function sentimentoDaNota(nota: number): string {
  return (
    { 1: 'Insatisfeito', 2: 'Pouco satisfeito', 3: 'Neutro', 4: 'Satisfeito', 5: 'Muito satisfeito' } as Record<number, string>
  )[nota] ?? 'Neutro'
}
