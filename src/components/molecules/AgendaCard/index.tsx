import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useTheme } from '../../../theme'
import type { AgendaItem } from '../../../types/agenda'
import { makeStyles } from './styles'

/**
 * Cores canônicas de status (compartilhadas pela borda do card e pelo badge):
 *   Atendido = verde · Agendado = azul · Cancelado = vermelho · Falta/Pendente = laranja
 */
export function getStatusStyle(
  status: string,
  colors: {
    success: Record<60, string>
    warning: Record<10 | 60, string>
    error: Record<10 | 60, string>
    primary: Record<10 | 70, string>
    info: Record<10 | 60, string>
  },
): { color: string; bg: string } {
  const s = status.toLowerCase()
  if (s.includes('atendido')) return { color: colors.success[60], bg: colors.primary[10] }
  if (s.includes('cancel'))   return { color: colors.error[60],   bg: colors.error[10] }
  if (s.includes('falta') || s.includes('pendente'))
    return { color: colors.warning[60], bg: colors.warning[10] }
  return { color: colors.info[60], bg: colors.info[10] } // Agendado (e demais) → azul
}

type Props = {
  item: AgendaItem
  onPress?: () => void
}

export function AgendaCard({ item, onPress }: Props) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const statusStyle = getStatusStyle(item.status, colors as any)
  const Container = onPress ? Pressable : View

  return (
    <Container
      onPress={onPress}
      style={[
        styles.container,
        { borderLeftColor: item.cor || colors.primary[60] },
      ]}
    >
      <Text style={styles.hora}>{item.hora}</Text>
      <View style={styles.body}>
        <Text style={styles.paciente} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.categoria}
          {item.sala ? `  ·  ${item.sala}` : ''}
        </Text>
        <Text style={styles.profissional} numberOfLines={1}>
          {item.profissional}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusText, { color: statusStyle.color }]}>
          {item.status}
        </Text>
      </View>
    </Container>
  )
}
