import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { AgendaCard } from '../../molecules/AgendaCard'
import { useAgenda } from '../../../hooks/useAgenda'
import { useUnidadeStore } from '../../../stores/unidadeStore'
import { theme } from '../../../theme'
import { styles } from './styles'

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

  if (!unidade) return null

  const goToAgenda = () => router.push('/(tabs)/agenda')

  // Loading
  if (loading) {
    return (
      <View style={styles.section}>
        <SectionHeader count={0} />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color={theme.colors.primary[60]} />
        </View>
      </View>
    )
  }

  // Erro
  if (erro) {
    return (
      <View style={styles.section}>
        <SectionHeader count={0} />
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Não foi possível carregar a agenda de hoje</Text>
        </View>
      </View>
    )
  }

  // Estado vazio (nada hoje, ou todos já passaram)
  const now = nowHHmm()
  const upcoming = agenda.filter((i) => i.hora >= now)
  if (agenda.length === 0 || upcoming.length === 0) {
    return (
      <Pressable style={styles.emptyCard} onPress={goToAgenda}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="calendar-outline" size={20} color={theme.colors.primary[70]} />
        </View>
        <View style={styles.emptyTextWrap}>
          <Text style={styles.emptyTitle}>Agenda de hoje livre</Text>
          <Text style={styles.emptySubtitle}>Nenhuma consulta marcada para hoje.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.neutral[50]} />
      </Pressable>
    )
  }

  // Lista
  const visible = upcoming.slice(0, MAX_ITEMS)
  const extra = upcoming.length - visible.length

  return (
    <View style={styles.section}>
      <SectionHeader count={agenda.length} />

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

function SectionHeader({ count }: { count: number }) {
  return (
    <View style={styles.headerRow}>
      <Ionicons name="calendar" size={16} color={theme.colors.primary[80]} />
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
