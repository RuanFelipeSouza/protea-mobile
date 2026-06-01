import { useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePacienteTheme, type PacienteTheme } from '../../../theme'
import { usePacienteAuthStore } from '../../../stores/pacienteAuthStore'
import { usePacienteAgendamentos } from '../../../hooks/usePacienteAgendamentos'
import { usePacienteEvolucoes } from '../../../hooks/usePacienteEvolucoes'
import type { AgendamentoPaciente, EvolucaoPaciente } from '../../../types/pacienteContextTypes'

// ─── helpers ─────────────────────────────────────────────────────────────────

function toTitle(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase())
}

function initials(s: string) {
  const parts = s.trim().split(/\s+/).filter(Boolean)
  return parts.length ? (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase() : '?'
}

function firstWord(s: string) {
  return toTitle(s).split(' ')[0]
}

function dayOf(dmy: string) {
  return dmy.split('/')[0]
}

const MONTH = ['', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
function monthAbbr(dmy: string) {
  return MONTH[parseInt(dmy.split('/')[1], 10)] ?? ''
}

// ─── subcomponents ────────────────────────────────────────────────────────────

function AppHeader({ colors, nome, nomeresponsavel }: {
  colors: PacienteTheme
  nome: string
  nomeresponsavel: string
}) {
  const insets = useSafeAreaInsets()
  const ini = initials(nome)

  return (
    <View
      style={[
        headerStyles.container,
        { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 8 },
      ]}
    >
      <View style={[headerStyles.avatar, { backgroundColor: colors.iconBg }]}>
        <Text style={[headerStyles.avatarText, { color: colors.primaryStrong }]}>{ini}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[headerStyles.greeting, { color: colors.textMuted }]}>
          Olá, {firstWord(nomeresponsavel)}
        </Text>
        <Text style={[headerStyles.patientName, { color: colors.text }]} numberOfLines={1}>
          {toTitle(nome)}
        </Text>
      </View>
      <Ionicons name="notifications-outline" size={23} color={colors.textMuted} />
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 15, fontWeight: '700' },
  greeting: { fontSize: 12 },
  patientName: { fontSize: 16, fontWeight: '700' },
})

function ProximoHero({ ag, colors, onPress }: {
  ag: AgendamentoPaciente
  colors: PacienteTheme
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[heroStyles.card, { backgroundColor: colors.primary }]}
    >
      <Text style={[heroStyles.eyebrow, { color: colors.primaryInk }]}>PRÓXIMO AGENDAMENTO</Text>
      <View style={heroStyles.dateRow}>
        <Text style={[heroStyles.day, { color: colors.primaryInk }]}>{dayOf(ag.data)}</Text>
        <Text style={[heroStyles.month, { color: colors.primaryInk }]}>{monthAbbr(ag.data)}</Text>
        <Text style={[heroStyles.weekday, { color: colors.primaryInk }]}>
          · {ag.diaSemana} · {ag.hora}
        </Text>
      </View>
      <Text style={[heroStyles.modalidade, { color: colors.primaryInk }]}>{ag.modalidade}</Text>
      <Text style={[heroStyles.profissional, { color: colors.primaryInk }]}>{ag.profissional}</Text>
      {ag.local && (
        <View style={heroStyles.localRow}>
          <Ionicons name="location-outline" size={15} color={colors.primaryInk} />
          <Text style={[heroStyles.local, { color: colors.primaryInk }]}>{ag.local}</Text>
        </View>
      )}
    </Pressable>
  )
}

const heroStyles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, gap: 4 },
  eyebrow: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.5, opacity: 0.85 },
  dateRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
  day: { fontSize: 30, fontWeight: '800', lineHeight: 34 },
  month: { fontSize: 15, fontWeight: '700' },
  weekday: { fontSize: 14, opacity: 0.9 },
  modalidade: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  profissional: { fontSize: 13.5, opacity: 0.92 },
  localRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  local: { fontSize: 12.5, opacity: 0.9 },
})

function Shortcut({ icon, label, onPress, colors }: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  onPress: () => void
  colors: PacienteTheme
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[shortcutStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[shortcutStyles.iconBg, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={[shortcutStyles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  )
}

const shortcutStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 9,
  },
  iconBg: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12.5, fontWeight: '600', textAlign: 'center' },
})

function EvoCard({ e, colors, onPress }: {
  e: EvolucaoPaciente
  colors: PacienteTheme
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[evoCardStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={evoCardStyles.top}>
        <Text style={[evoCardStyles.id, { color: colors.primary }]}>#{e.id}</Text>
        <Text style={[evoCardStyles.date, { color: colors.textFaint }]}>
          {e.data} · {e.hora}
        </Text>
      </View>
      <View style={evoCardStyles.row}>
        <Ionicons name="add-circle-outline" size={16} color={colors.textFaint} />
        <Text style={[evoCardStyles.tipo, { color: colors.text }]}>{e.tipo}</Text>
      </View>
      <View style={evoCardStyles.row}>
        <Ionicons name="pulse-outline" size={16} color={colors.textFaint} />
        <Text style={[evoCardStyles.meta, { color: colors.textMuted }]}>{e.modalidade}</Text>
      </View>
      <View style={evoCardStyles.row}>
        <Ionicons name="person-outline" size={16} color={colors.textFaint} />
        <Text style={[evoCardStyles.meta, { color: colors.textMuted }]}>{e.profissional}</Text>
      </View>
      <View style={[evoCardStyles.footer, { borderTopColor: colors.border }]}>
        <Text style={[evoCardStyles.verLink, { color: colors.primary }]}>Ver evolução</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </View>
    </Pressable>
  )
}

const evoCardStyles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingTop: 13, paddingBottom: 0 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  id: { fontSize: 15, fontWeight: '700' },
  date: { fontSize: 12.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 7 },
  tipo: { fontSize: 13.5, fontWeight: '600' },
  meta: { fontSize: 13.5 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    borderTopWidth: 1,
    marginTop: 12,
    paddingVertical: 10,
  },
  verLink: { fontSize: 13.5, fontWeight: '600' },
})

// ─── main page ───────────────────────────────────────────────────────────────

export function PacienteDashboardPage() {
  const router = useRouter()
  const { dark, colors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  const nome = usePacienteAuthStore((s) => s.nome) ?? ''
  const nomeresponsavel = usePacienteAuthStore((s) => s.nomeresponsavel) ?? nome

  const { futuros, loading: loadAg } = usePacienteAgendamentos()
  const { evolucoes, loading: loadEv } = usePacienteEvolucoes()

  const proximoAg = futuros[0] ?? null
  const ultimaEvo = evolucoes[0] ?? null
  const loading = loadAg || loadEv

  function goToEvoDetalhe(e: EvolucaoPaciente) {
    router.push({
      pathname: '/(paciente)/evolucao/[id]',
      params: { id: String(e.id) },
    } as never)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      <AppHeader colors={colors} nome={nome} nomeresponsavel={nomeresponsavel} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* hero */}
          {proximoAg ? (
            <ProximoHero
              ag={proximoAg}
              colors={colors}
              onPress={() => router.push('/(paciente)/agendamentos' as never)}
            />
          ) : (
            <View style={[styles.emptyHero, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="calendar-outline" size={32} color={colors.primary} />
              <Text style={[styles.emptyHeroText, { color: colors.primaryStrong }]}>
                Nenhum agendamento futuro
              </Text>
            </View>
          )}

          {/* atalhos */}
          <View style={styles.shortcuts}>
            <Shortcut
              icon="calendar-outline"
              label="Agendamentos"
              colors={colors}
              onPress={() => router.push('/(paciente)/agendamentos' as never)}
            />
            <Shortcut
              icon="document-text-outline"
              label="Evoluções"
              colors={colors}
              onPress={() => router.push('/(paciente)/evolucoes' as never)}
            />
            <Shortcut
              icon="person-outline"
              label="Meu perfil"
              colors={colors}
              onPress={() => router.push('/(paciente)/perfil' as never)}
            />
          </View>

          {/* última evolução */}
          {ultimaEvo && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Última evolução</Text>
                <Pressable onPress={() => router.push('/(paciente)/evolucoes' as never)} hitSlop={8}>
                  <Text style={[styles.sectionAction, { color: colors.primary }]}>Ver todas</Text>
                </Pressable>
              </View>
              <EvoCard e={ultimaEvo} colors={colors} onPress={() => goToEvoDetalhe(ultimaEvo)} />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

function makeStyles(colors: PacienteTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    scroll: { padding: 16, gap: 18 },
    emptyHero: {
      borderRadius: 16,
      padding: 28,
      alignItems: 'center',
      gap: 10,
    },
    emptyHeroText: { fontSize: 15, fontWeight: '600' },
    shortcuts: { flexDirection: 'row', gap: 12 },
    section: { gap: 8 },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingHorizontal: 2,
    },
    sectionTitle: { fontSize: 13, fontWeight: '700' },
    sectionAction: { fontSize: 12.5, fontWeight: '600' },
  })
}
