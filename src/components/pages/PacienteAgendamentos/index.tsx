import { useMemo, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePacienteTheme, type PacienteTheme } from '../../../theme'
import { usePacienteAgendamentos } from '../../../hooks/usePacienteAgendamentos'
import { useFeedbackAtendimento } from '../../../hooks/useFeedbackAtendimento'
import { AvaliacaoAtendimentoSheet } from '../../molecules/AvaliacaoAtendimentoSheet'
import { SENTIMENTO_LABEL } from '../../../types/feedbackAtendimento'
import type { AgendamentoPaciente, AgendamentoStatus } from '../../../types/pacienteContextTypes'

// ─── helpers ─────────────────────────────────────────────────────────────────

const MONTH = ['', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function dayOf(dmy: string) { return dmy.split('/')[0] }
function monthAbbr(dmy: string) { return MONTH[parseInt(dmy.split('/')[1], 10)] ?? '' }

function statusInfo(
  status: AgendamentoStatus,
  colors: PacienteTheme,
): { text: string; color: string; bg: string } {
  switch (status) {
    case 'confirmado': return { text: 'Confirmado', color: colors.primary, bg: colors.primarySoft }
    case 'agendado':   return { text: 'Agendado',   color: colors.info,    bg: colors.infoSoft }
    case 'realizado':  return { text: 'Realizado',  color: colors.textMuted, bg: colors.bg }
    case 'falta':      return { text: 'Falta',      color: colors.warn,    bg: colors.warnSoft }
  }
}

// ─── subcomponents ────────────────────────────────────────────────────────────

function SimpleHeader({ colors, insets, onBack }: {
  colors: PacienteTheme
  insets: ReturnType<typeof useSafeAreaInsets>
  onBack: () => void
}) {
  return (
    <View
      style={[
        simpleHeaderStyles.container,
        { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 8 },
      ]}
    >
      <Pressable onPress={onBack} hitSlop={8} style={simpleHeaderStyles.side}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </Pressable>
      <Text style={[simpleHeaderStyles.title, { color: colors.text }]}>Agendamentos</Text>
      <View style={simpleHeaderStyles.side} />
    </View>
  )
}

const simpleHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  side: { width: 40, alignItems: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: '700', textAlign: 'center' },
})

function SegmentedTabs({ active, onChange, colors }: {
  active: 'futuros' | 'passados'
  onChange: (v: 'futuros' | 'passados') => void
  colors: PacienteTheme
}) {
  return (
    <View style={[segStyles.bar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {(['futuros', 'passados'] as const).map((k) => {
        const on = active === k
        return (
          <Pressable key={k} onPress={() => onChange(k)} style={segStyles.tab}>
            <Text style={[segStyles.label, { color: on ? colors.primary : colors.textMuted, fontWeight: on ? '700' : '500' }]}>
              {k === 'futuros' ? 'Futuros' : 'Histórico'}
            </Text>
            {on && <View style={[segStyles.underline, { backgroundColor: colors.primary }]} />}
          </Pressable>
        )
      })}
    </View>
  )
}

const segStyles = StyleSheet.create({
  bar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 13, position: 'relative' },
  label: { fontSize: 14 },
  underline: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2.5, borderRadius: 3 },
})

function AgendaCard({ ag, colors }: { ag: AgendamentoPaciente; colors: PacienteTheme }) {
  const info = statusInfo(ag.status, colors)
  const agendaId = Number(ag.id)
  const podeAvaliar = ag.status === 'realizado' && Number.isFinite(agendaId)
  const { feedback, loading, podeEditar, enviando, enviar, editar } = useFeedbackAtendimento(
    podeAvaliar ? agendaId : null,
  )
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <View style={[cardStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', gap: 14 }}>
        {/* data */}
        <View style={cardStyles.dateBlock}>
          <Text style={[cardStyles.day, { color: colors.text }]}>{dayOf(ag.data)}</Text>
          <Text style={[cardStyles.month, { color: colors.textMuted }]}>{monthAbbr(ag.data)}</Text>
          <Text style={[cardStyles.weekday, { color: colors.textFaint }]}>{ag.diaSemana}</Text>
        </View>
        <View style={[cardStyles.divider, { backgroundColor: colors.border }]} />
        {/* info */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={cardStyles.titleRow}>
            <Text style={[cardStyles.modalidade, { color: colors.text }]} numberOfLines={1}>
              {ag.modalidade}
            </Text>
            <View style={[cardStyles.badge, { backgroundColor: info.bg }]}>
              <Text style={[cardStyles.badgeText, { color: info.color }]}>{info.text}</Text>
            </View>
          </View>
          <View style={cardStyles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textFaint} />
            <Text style={[cardStyles.meta, { color: colors.textMuted }]}>{ag.hora}</Text>
          </View>
          <View style={cardStyles.metaRow}>
            <Ionicons name="person-outline" size={14} color={colors.textFaint} />
            <Text style={[cardStyles.meta, { color: colors.textMuted }]} numberOfLines={1}>
              {ag.profissional}
            </Text>
          </View>
          {ag.local && (
            <View style={cardStyles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textFaint} />
              <Text style={[cardStyles.meta, { color: colors.textMuted }]} numberOfLines={1}>
                {ag.local}
              </Text>
            </View>
          )}
        </View>
      </View>

      {podeAvaliar && !loading && !feedback && (
        <View style={[cardStyles.rateCta, { borderTopColor: colors.border }]}>
          <Text style={[cardStyles.rateCtaText, { color: colors.textFaint }]}>Como foi esse atendimento?</Text>
          <Pressable
            onPress={() => setSheetOpen(true)}
            style={[cardStyles.rateBtn, { borderColor: colors.primary }]}
          >
            <Ionicons name="star-outline" size={13} color={colors.primaryStrong} />
            <Text style={[cardStyles.rateBtnText, { color: colors.primaryStrong }]}>Avaliar</Text>
          </Pressable>
        </View>
      )}

      {podeAvaliar && feedback && (
        <Pressable style={[cardStyles.doneChip, { borderTopColor: colors.border }]} onPress={() => setSheetOpen(true)}>
          <Text style={[cardStyles.doneLabel, { color: colors.text }]} numberOfLines={1}>
            Você avaliou: {SENTIMENTO_LABEL[feedback.nota]}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textFaint} />
        </Pressable>
      )}

      {podeAvaliar && (
        <AvaliacaoAtendimentoSheet
          visible={sheetOpen}
          onClose={() => setSheetOpen(false)}
          contexto={{ modalidade: ag.modalidade, data: ag.data, profissional: ag.profissional }}
          feedback={feedback}
          podeEditar={podeEditar}
          enviando={enviando}
          onSubmit={(nota, comentario) => (feedback ? editar(nota, comentario) : enviar(nota, comentario))}
        />
      )}
    </View>
  )
}

const cardStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  dateBlock: { width: 52, alignItems: 'center', flexShrink: 0 },
  day: { fontSize: 24, fontWeight: '800', lineHeight: 26 },
  month: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  weekday: { fontSize: 10.5, marginTop: 2 },
  divider: { width: 1, alignSelf: 'stretch' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  modalidade: { fontSize: 15, fontWeight: '700', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, flexShrink: 0 },
  badgeText: { fontSize: 10.5, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  meta: { fontSize: 13, flex: 1 },
  rateCta: {
    marginTop: 11,
    paddingTop: 11,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rateCtaText: { fontSize: 12, flexShrink: 1 },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  rateBtnText: { fontSize: 12.5, fontWeight: '800' },
  doneChip: {
    marginTop: 11,
    paddingTop: 11,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  doneLabel: { fontSize: 12.5, fontWeight: '700', flex: 1 },
})

// ─── main page ───────────────────────────────────────────────────────────────

export function PacienteAgendamentosPage() {
  const router = useRouter()
  const { dark, colors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const insets = useSafeAreaInsets()
  const [seg, setSeg] = useState<'futuros' | 'passados'>('futuros')

  const { futuros, passados, loading, erro } = usePacienteAgendamentos()

  const list = seg === 'futuros' ? futuros : passados

  return (
    <View style={styles.container}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <SimpleHeader colors={colors} insets={insets} onBack={() => router.back()} />
      <SegmentedTabs active={seg} onChange={setSeg} colors={colors} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
          <Text style={[styles.erroText, { color: colors.danger }]}>{erro}</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="calendar-outline" size={48} color={colors.textFaint} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {seg === 'futuros' ? 'Nenhum agendamento futuro' : 'Nenhum histórico'}
              </Text>
            </View>
          }
          renderItem={({ item }) => <AgendaCard ag={item} colors={colors} />}
        />
      )}
    </View>
  )
}

function makeStyles(colors: PacienteTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 60 },
    list: { padding: 14, gap: 12 },
    erroText: { fontSize: 14, textAlign: 'center' },
    emptyText: { fontSize: 15, textAlign: 'center' },
  })
}
