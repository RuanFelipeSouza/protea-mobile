import { useMemo } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { AgendaCard } from '../../molecules/AgendaCard'
import { useAgenda } from '../../../hooks/useAgenda'
import { useUnidadeStore } from '../../../stores/unidadeStore'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

const MAX_ITEMS = 3

function formatDateApi(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function nowHHmm(d: Date = new Date()): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function TodayAgendaSection() {
  const router = useRouter()
  const unidade = useUnidadeStore((s) => s.selecionada)
  const today = formatDateApi(new Date())
  const { agenda, loading, erro } = useAgenda(today)
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  if (!unidade) return null

  const goToAgenda = () => router.push('/(tabs)/agenda')

  if (loading) {
    return (
      <View style={styles.section}>
        <SectionHeader count={0} styles={styles} colors={colors} />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color={colors.primary[60]} />
        </View>
      </View>
    )
  }

  if (erro) {
    return (
      <View style={styles.section}>
        <SectionHeader count={0} styles={styles} colors={colors} />
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Não foi possível carregar a agenda de hoje</Text>
        </View>
      </View>
    )
  }

  const now = nowHHmm()
  const upcoming = agenda.filter((i) => i.hora >= now)
  if (agenda.length === 0 || upcoming.length === 0) {
    return (
      <Pressable style={styles.emptyCard} onPress={goToAgenda}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary[70]} />
        </View>
        <View style={styles.emptyTextWrap}>
          <Text style={styles.emptyTitle}>Agenda de hoje livre</Text>
          <Text style={styles.emptySubtitle}>Nenhuma consulta marcada para hoje.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.neutral[50]} />
      </Pressable>
    )
  }

  const visible = upcoming.slice(0, MAX_ITEMS)
  const extra = upcoming.length - visible.length

  return (
    <View style={styles.section}>
      <SectionHeader count={agenda.length} styles={styles} colors={colors} />
      <View style={styles.list}>
        {visible.map((item) => (
          <AgendaCard key={item.id} item={item} onPress={goToAgenda} />
        ))}
      </View>
      <Pressable style={styles.footer} onPress={goToAgenda} hitSlop={8}>
        <Text style={styles.footerLink}>
          {extra > 0 ? `Ver mais ${extra} →` : 'Ver agenda completa →'}
        </Text>
      </Pressable>
    </View>
  )
}

function SectionHeader({
  count,
  styles,
  colors,
}: {
  count: number
  styles: ReturnType<typeof makeStyles>
  colors: any
}) {
  return (
    <View style={styles.headerRow}>
      <Ionicons name="calendar" size={16} color={colors.primary[80]} />
      <Text style={styles.headerTitle}>Agenda de hoje</Text>
      <View style={{ flex: 1 }} />
      {count > 0 && (
        <Text style={styles.headerCount}>
          {count} {count === 1 ? 'consulta' : 'consultas'}
        </Text>
      )}
    </View>
  )
}
