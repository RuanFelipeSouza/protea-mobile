import { useMemo, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar, UnidadeRequired } from '../../organisms'
import { AgendaCard } from '../../molecules'
import { useAgenda } from '../../../hooks/useAgenda'
import { useTheme } from '../../../theme'
import type { darkColors } from '../../../theme/dark'
import type { colors as lightColors } from '../../../theme/colors'
import type { AgendaItem } from '../../../types/agenda'

type Colors = typeof lightColors | typeof darkColors

function formatDateApi(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateDisplay(d: Date): string {
  const hoje = new Date()
  const isHoje =
    d.getDate() === hoje.getDate() &&
    d.getMonth() === hoje.getMonth() &&
    d.getFullYear() === hoje.getFullYear()
  const label = d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
  return isHoje ? `Hoje, ${label}` : label
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

// ── SummaryBar ────────────────────────────────────────────────────────────────
function SummaryBar({ agenda }: { agenda: AgendaItem[] }) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeSummaryStyles(colors), [colors])

  const counts = {
    agendado: agenda.filter((a) => a.status.toLowerCase().includes('agendado')).length,
    atendido: agenda.filter((a) => a.status.toLowerCase().includes('atendido')).length,
    falta:    agenda.filter((a) => a.status.toLowerCase().includes('falta')).length,
    pendente: agenda.filter((a) => a.status.toLowerCase().includes('pendente')).length,
  }

  return (
    <View style={styles.row}>
      <View style={styles.item}>
        <Text style={[styles.count, { color: colors.primary[70] }]}>{counts.agendado}</Text>
        <Text style={styles.label}>Agendados</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={[styles.count, { color: colors.success[60] }]}>{counts.atendido}</Text>
        <Text style={styles.label}>Atendidos</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={[styles.count, { color: colors.warning[60] }]}>{counts.falta}</Text>
        <Text style={styles.label}>Faltas</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={[styles.count, { color: colors.neutral[50] }]}>{counts.pendente}</Text>
        <Text style={styles.label}>Pendentes</Text>
      </View>
    </View>
  )
}

// ── AgendaPage ────────────────────────────────────────────────────────────────
export function AgendaPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const dateStr = formatDateApi(currentDate)
  const { agenda, loading, erro } = useAgenda(dateStr)
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <View style={styles.container}>
      <HeaderBar title="Agenda" showBack onBack={() => router.back()} showProfile={false} />

      <UnidadeRequired contextMessage="Selecione a unidade na home para visualizar a agenda.">
        <View style={styles.dateNav}>
          <Pressable onPress={() => setCurrentDate((d) => addDays(d, -1))} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.primary[70]} />
          </Pressable>
          <Text style={styles.dateLabel}>{formatDateDisplay(currentDate)}</Text>
          <Pressable onPress={() => setCurrentDate((d) => addDays(d, 1))} hitSlop={12}>
            <Ionicons name="chevron-forward" size={22} color={colors.primary[70]} />
          </Pressable>
        </View>

        {!loading && !erro && <SummaryBar agenda={agenda} />}

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary[70]} />
          </View>
        )}

        {erro && (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.error[40]} />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        )}

        {!loading && !erro && (
          <FlatList
            data={agenda}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons name="calendar-outline" size={48} color={colors.neutral[30]} />
                <Text style={styles.emptyText}>Nenhum agendamento nesta data</Text>
              </View>
            }
            renderItem={({ item }) => <AgendaCard item={item} />}
          />
        )}
      </UnidadeRequired>
    </View>
  )
}

// ── Styles factories ──────────────────────────────────────────────────────────
function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.neutral[10],
    },
    dateNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: c.neutral[0],
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    dateLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: c.neutral[90],
      textTransform: 'capitalize',
    },
    list: {
      padding: 16,
      gap: 8,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingTop: 60,
    },
    erroText: {
      fontSize: 14,
      color: c.error[40],
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: c.neutral[50],
      textAlign: 'center',
    },
  })
}

function makeSummaryStyles(c: Colors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      backgroundColor: c.neutral[0],
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    item: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
    },
    count: {
      fontSize: 20,
      fontWeight: '700',
    },
    label: {
      fontSize: 11,
      color: c.neutral[60],
    },
    divider: {
      width: 1,
      backgroundColor: c.neutral[20],
      marginVertical: 4,
    },
  })
}
