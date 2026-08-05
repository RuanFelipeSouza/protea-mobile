import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, Modal, TextInput, StyleSheet, ActivityIndicator, Platform } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import type { PacienteTheme } from '../../../theme'
import { usePacienteTheme } from '../../../theme'
import { SENTIMENTO_LABEL, type FeedbackAtendimento, type SentimentoNota } from '../../../types/feedbackAtendimento'

const NOTAS: SentimentoNota[] = [1, 2, 3, 4, 5]
const MAX_COMENTARIO = 300

const MOUTH_PATH: Record<SentimentoNota, string> = {
  1: 'M17 35 Q26 27 35 35',
  2: 'M17 33 Q26 28 35 33',
  3: 'M17 32 L35 32',
  4: 'M17 30 Q26 37 35 30',
  5: 'M15 29 Q26 40 37 29',
}

// Cores fixas por nota — mesma lógica do design (danger -> warn -> neutro -> primary -> primaryStrong).
function corDaNota(n: SentimentoNota, colors: PacienteTheme) {
  if (n <= 1) return { fg: colors.danger, bg: colors.dangerSoft }
  if (n === 2) return { fg: colors.warn, bg: colors.warnSoft }
  if (n === 3) return { fg: colors.textMuted, bg: colors.bg }
  if (n === 4) return { fg: colors.primary, bg: colors.primarySoft }
  return { fg: colors.primaryStrong, bg: colors.primarySoft }
}

/** Rosto (1–5) desenhado em SVG, fiel ao design — sempre com a cor do sentimento. */
function FaceIcon({ nota, fg, bg, size = 52 }: { nota: SentimentoNota; fg: string; bg: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <Circle cx={26} cy={26} r={22} fill={bg} />
      {nota === 5 ? (
        <>
          <Path d="M15 20 Q18 17 21 20" stroke={fg} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <Path d="M31 20 Q34 17 37 20" stroke={fg} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx={18} cy={21} r={2.4} fill={fg} />
          <Circle cx={34} cy={21} r={2.4} fill={fg} />
        </>
      )}
      <Path d={MOUTH_PATH[nota]} stroke={fg} strokeWidth={nota === 5 ? 2.8 : 2.6} fill="none" strokeLinecap="round" />
    </Svg>
  )
}

function formatDataHora(iso: string) {
  const d = new Date(iso)
  const data = d.toLocaleDateString('pt-BR')
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${data} · ${hora}`
}

type Step = 'form' | 'confirm' | 'detail'

type Props = {
  visible: boolean
  onClose: () => void
  /** Contexto exibido no topo do sheet. */
  contexto: { modalidade: string; data: string; profissional: string }
  /** Avaliação já enviada, se houver — abre direto na tela de detalhe. */
  feedback: FeedbackAtendimento | null
  /** Se a janela de edição (24h) ainda está aberta. */
  podeEditar: boolean
  enviando: boolean
  onSubmit: (nota: SentimentoNota, comentario: string) => Promise<unknown> | void
}

/**
 * Bottom sheet de avaliação por sentimento (1–5) do atendimento realizado.
 * Cobre as 4 telas do design: avaliar, confirmação, detalhe já avaliado e edição.
 */
export function AvaliacaoAtendimentoSheet({
  visible, onClose, contexto, feedback, podeEditar, enviando, onSubmit,
}: Props) {
  const { colors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const [step, setStep] = useState<Step>(feedback ? 'detail' : 'form')
  const [nota, setNota] = useState<SentimentoNota | null>(feedback?.nota ?? null)
  const [comentario, setComentario] = useState(feedback?.comentario ?? '')

  useEffect(() => {
    if (visible) {
      setStep(feedback ? 'detail' : 'form')
      setNota(feedback?.nota ?? null)
      setComentario(feedback?.comentario ?? '')
    }
    // Reseta apenas quando o sheet abre — evita pular de tela enquanto o usuário edita.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  async function handleSubmit() {
    if (!nota) return
    await onSubmit(nota, comentario.trim())
    setStep('confirm')
  }

  function handleEditPress() {
    setNota(feedback?.nota ?? null)
    setComentario(feedback?.comentario ?? '')
    setStep('form')
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          {step === 'confirm' && (
            <View style={styles.confirmWrap}>
              <View style={styles.confirmIcon}>
                <Ionicons name="checkmark" size={30} color={colors.primaryStrong} />
              </View>
              <Text style={styles.confirmTitle}>Avaliação enviada!</Text>
              <Text style={styles.confirmSub}>
                Obrigado por compartilhar sua percepção. Você pode editá-la em até 24 horas.
              </Text>
              <Pressable style={styles.confirmBtn} onPress={onClose}>
                <Text style={styles.confirmBtnText}>Concluir</Text>
              </Pressable>
            </View>
          )}

          {step === 'detail' && feedback && (
            <>
              <View style={styles.top}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>Sua avaliação</Text>
                  <Text style={styles.sub}>
                    {contexto.modalidade} · {contexto.data} · {contexto.profissional}
                  </Text>
                </View>
                <Pressable onPress={onClose} hitSlop={8} style={styles.closeX}>
                  <Ionicons name="close" size={15} color={colors.textMuted} />
                </Pressable>
              </View>

              <View style={styles.detailFace}>
                <FaceIcon nota={feedback.nota} {...corDaNota(feedback.nota, colors)} size={56} />
                <View>
                  <Text style={styles.detailNota}>{SENTIMENTO_LABEL[feedback.nota]}</Text>
                  <Text style={styles.detailDate}>Enviado em {formatDataHora(feedback.criadoEm)}</Text>
                </View>
              </View>

              {!!feedback.comentario && (
                <Text style={styles.commentQuote}>"{feedback.comentario}"</Text>
              )}

              {podeEditar && (
                <>
                  <Pressable style={styles.editRow} onPress={handleEditPress} hitSlop={8}>
                    <Ionicons name="pencil-outline" size={13} color={colors.primary} />
                    <Text style={styles.editRowText}>Editar avaliação</Text>
                  </Pressable>
                  {feedback.editavelAte && (
                    <Text style={styles.editHint}>
                      Disponível para edição até {formatDataHora(feedback.editavelAte)}
                    </Text>
                  )}
                </>
              )}
            </>
          )}

          {step === 'form' && (
            <>
              <View style={styles.top}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>Como foi o atendimento?</Text>
                  <Text style={styles.sub}>
                    {contexto.modalidade} · {contexto.data} · {contexto.profissional}
                  </Text>
                </View>
                <Pressable onPress={onClose} hitSlop={8} style={styles.closeX}>
                  <Ionicons name="close" size={15} color={colors.textMuted} />
                </Pressable>
              </View>

              <View style={styles.faces}>
                {NOTAS.map((n) => {
                  const sel = nota === n
                  const cor = corDaNota(n, colors)
                  return (
                    <Pressable key={n} style={styles.faceOpt} onPress={() => setNota(n)} hitSlop={4}>
                      <View style={[styles.faceCircleWrap, sel && styles.faceCircleWrapSel]}>
                        <FaceIcon nota={n} fg={cor.fg} bg={cor.bg} />
                      </View>
                      <Text style={[styles.faceLbl, sel && styles.faceLblSel]}>
                        {SENTIMENTO_LABEL[n]}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>

              <View style={styles.commentBox}>
                <Text style={styles.commentLbl}>Comentário (opcional)</Text>
                <TextInput
                  style={styles.textarea}
                  placeholder="Conte um pouco mais sobre o atendimento..."
                  placeholderTextColor={colors.textFaint}
                  multiline
                  maxLength={MAX_COMENTARIO}
                  value={comentario}
                  onChangeText={setComentario}
                />
                <Text style={styles.counter}>{comentario.length}/{MAX_COMENTARIO}</Text>
              </View>

              <View style={styles.disclaimer}>
                <Ionicons name="information-circle-outline" size={15} color={colors.textFaint} />
                <Text style={styles.disclaimerText}>
                  Essa avaliação é sobre sua experiência com o atendimento — acolhimento e comunicação. Ela não substitui o registro clínico.
                </Text>
              </View>

              <Pressable
                style={[styles.submitBtn, !nota && styles.submitBtnOff]}
                disabled={!nota || enviando}
                onPress={handleSubmit}
              >
                {enviando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.submitBtnText, !nota && { color: colors.textFaint }]}>Enviar avaliação</Text>
                )}
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function makeStyles(colors: PacienteTheme) {
  return StyleSheet.create({
    scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
    handle: { width: 36, height: 4, borderRadius: 3, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 },
    top: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    title: { fontSize: 17, fontWeight: '800', color: colors.text },
    sub: { fontSize: 12.5, color: colors.textMuted, marginTop: 4, lineHeight: 17 },
    closeX: { width: 26, height: 26, borderRadius: 999, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },

    faces: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
    faceOpt: { alignItems: 'center', gap: 7, width: 60 },
    faceCircleWrap: { borderRadius: 999 },
    faceCircleWrapSel: {
      transform: [{ scale: 1.12 }],
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 14 },
        android: { elevation: 4 },
      }),
    },
    faceLbl: { fontSize: 10, fontWeight: '600', color: colors.textFaint, textAlign: 'center', lineHeight: 13 },
    faceLblSel: { color: colors.text, fontWeight: '700' },

    commentBox: { marginTop: 24 },
    commentLbl: { fontSize: 12.5, fontWeight: '700', color: colors.textMuted, marginBottom: 7 },
    textarea: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, fontSize: 13.5, color: colors.text, minHeight: 74, textAlignVertical: 'top' },
    counter: { textAlign: 'right', fontSize: 10.5, color: colors.textFaint, marginTop: 5 },

    disclaimer: { flexDirection: 'row', gap: 7, marginTop: 16, padding: 10, backgroundColor: colors.bg, borderRadius: 10 },
    disclaimerText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 15 },

    submitBtn: { marginTop: 18, height: 50, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    submitBtnOff: { backgroundColor: colors.border },
    submitBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

    confirmWrap: { alignItems: 'center', paddingTop: 18, paddingBottom: 6 },
    confirmIcon: { width: 64, height: 64, borderRadius: 999, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    confirmTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
    confirmSub: { fontSize: 13, color: colors.textMuted, marginTop: 6, lineHeight: 19, textAlign: 'center', maxWidth: 280 },
    confirmBtn: { marginTop: 22, width: '100%', height: 48, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
    confirmBtnText: { fontSize: 14.5, fontWeight: '800', color: colors.primaryStrong },

    detailFace: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, marginTop: 18, backgroundColor: colors.primarySoft, borderRadius: 16 },
    detailNota: { fontSize: 16, fontWeight: '800', color: colors.primaryStrong },
    detailDate: { fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
    commentQuote: { marginTop: 14, padding: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, fontSize: 13, color: colors.text, lineHeight: 19, fontStyle: 'italic' },
    editRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
    editRowText: { fontSize: 12.5, fontWeight: '700', color: colors.primary },
    editHint: { textAlign: 'center', fontSize: 10.5, color: colors.textFaint, marginTop: 5 },
  })
}
