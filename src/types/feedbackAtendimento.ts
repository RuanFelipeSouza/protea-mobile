export type SentimentoNota = 1 | 2 | 3 | 4 | 5

export const SENTIMENTO_LABEL: Record<SentimentoNota, string> = {
  1: 'Insatisfeito',
  2: 'Pouco satisfeito',
  3: 'Neutro',
  4: 'Satisfeito',
  5: 'Muito satisfeito',
}

/** Espelha protea.feedback_atendimento_familiar (subset exposto ao app). */
export interface FeedbackAtendimento {
  id: number
  agendaId: number
  nota: SentimentoNota
  sentimento: string
  comentario: string | null
  critico: boolean
  criadoEm: string // ISO
  atualizadoEm: string | null
  /** Janela de edição — o backend decide a regra (24h); o app só respeita o campo. */
  editavelAte: string | null // ISO
}

export interface CriarFeedbackPayload {
  agendaId: number
  nota: SentimentoNota
  comentario?: string | null
}

export interface AtualizarFeedbackPayload {
  nota: SentimentoNota
  comentario?: string | null
}
