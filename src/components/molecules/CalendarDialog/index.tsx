import { useMemo, useState } from 'react'
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

const WD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

type Props = {
  visible: boolean
  /** Data atualmente selecionada na agenda. */
  value: Date
  onClose: () => void
  onSelect: (date: Date) => void
}

/**
 * Calendário em diálogo (Modal) — sem dependências externas, visual Protea.
 * Dia selecionado em verde sólido, "hoje" com contorno verde.
 */
export function CalendarDialog({ visible, value, onClose, onSelect }: Props) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const today = new Date()

  const [view, setView] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  )

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Monta as células: nulls para o offset do 1º dia + dias do mês.
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Completa a última linha (múltiplo de 7) para o grid ficar alinhado.
  while (cells.length % 7 !== 0) cells.push(null)

  // Agrupa em semanas (linhas de 7).
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  function goMonth(delta: number) {
    setView(new Date(year, month + delta, 1))
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        {/* Pressable interno evita que o toque no card feche o diálogo. */}
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Cabeçalho do mês */}
          <View style={styles.monthRow}>
            <Pressable onPress={() => goMonth(-1)} style={styles.monthBtn} hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={colors.neutral[70]} />
            </Pressable>
            <Text style={styles.monthLabel}>{MESES[month]} {year}</Text>
            <Pressable onPress={() => goMonth(1)} style={styles.monthBtn} hitSlop={8}>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral[70]} />
            </Pressable>
          </View>

          {/* Cabeçalho de dias da semana */}
          <View style={styles.weekRow}>
            {WD.map((w, i) => (
              <Text key={i} style={styles.weekday}>{w}</Text>
            ))}
          </View>

          {/* Grade de dias */}
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((d, di) => {
                if (d == null) return <View key={di} style={styles.cell} />
                const cellDate = new Date(year, month, d)
                const isSel = sameDay(cellDate, value)
                const isToday = sameDay(cellDate, today)
                return (
                  <View key={di} style={styles.cell}>
                    <Pressable
                      onPress={() => onSelect(cellDate)}
                      style={[
                        styles.day,
                        isSel && styles.daySelected,
                        !isSel && isToday && styles.dayToday,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSel && styles.dayTextSelected,
                          !isSel && isToday && styles.dayTextToday,
                        ]}
                      >
                        {d}
                      </Text>
                    </Pressable>
                  </View>
                )
              })}
            </View>
          ))}

          {/* Rodapé */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.closeBtn}>Fechar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
