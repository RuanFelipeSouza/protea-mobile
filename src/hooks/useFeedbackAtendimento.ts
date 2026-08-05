import { useCallback, useEffect, useState } from 'react'
import {
  atualizarFeedbackAtendimento,
  criarFeedbackAtendimento,
  getFeedbackDoAtendimento,
} from '../services/feedbackAtendimentoService'
import type { FeedbackAtendimento, SentimentoNota } from '../types/feedbackAtendimento'

/**
 * Carrega e gerencia o feedback de um único atendimento (agendaId).
 * Usado tanto pelo card (pra saber se já foi avaliado) quanto pelo sheet de avaliação.
 */
export function useFeedbackAtendimento(agendaId: number | null) {
  const [feedback, setFeedback] = useState<FeedbackAtendimento | null>(null)
  const [loading, setLoading] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (agendaId == null) return
    let alive = true
    setLoading(true)
    getFeedbackDoAtendimento(agendaId)
      .then((fb) => { if (alive) setFeedback(fb) })
      .catch((e) => { if (alive) setErro(e?.message ?? 'Erro ao carregar avaliação') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [agendaId])

  const enviar = useCallback(async (nota: SentimentoNota, comentario?: string) => {
    if (agendaId == null) return
    setEnviando(true)
    setErro(null)
    try {
      const fb = await criarFeedbackAtendimento({ agendaId, nota, comentario })
      setFeedback(fb)
      return fb
    } catch (e: any) {
      const msg =
        e?.response?.status === 409
          ? 'Você já avaliou este atendimento.'
          : e?.response?.status === 403
          ? 'Você não tem permissão para avaliar este atendimento.'
          : 'Não foi possível enviar sua avaliação. Tente novamente.'
      setErro(msg)
      throw e
    } finally {
      setEnviando(false)
    }
  }, [agendaId])

  const editar = useCallback(async (nota: SentimentoNota, comentario?: string) => {
    if (agendaId == null) return
    setEnviando(true)
    setErro(null)
    try {
      const fb = await atualizarFeedbackAtendimento(agendaId, { nota, comentario })
      setFeedback(fb)
      return fb
    } catch (e: any) {
      setErro('Não foi possível atualizar sua avaliação.')
      throw e
    } finally {
      setEnviando(false)
    }
  }, [agendaId])

  const podeEditar = !!feedback?.editavelAte && new Date(feedback.editavelAte) > new Date()

  return { feedback, loading, enviando, erro, enviar, editar, podeEditar }
}
