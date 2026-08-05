import { useEffect, useRef, useState } from 'react'
import { Animated, View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { PacienteTheme } from '../../../theme'
import { totalAtendimentos, percentualRealizado, type EspecialidadeResumo } from '../../../types/resumoAtendimentos'

function fmtPct(n: number) {
  return `${n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
}

function GridCell({ icon, color, num, label, border, colors }: {
  icon: React.ComponentProps<typeof Ionicons>['name']; color: string; num: number; label: string
  border?: boolean; colors: PacienteTheme
}) {
  return (
    <View style={[gridStyles.cell, border && { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 14 }]}>
      <View style={{ width: 26, height: 26, borderRadius: 999, borderWidth: 2, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={13} color={color} />
      </View>
      <View>
        <Text style={{ fontSize: 14.5, fontWeight: '800', color: colors.text }}>{num}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted }}>{label}</Text>
      </View>
    </View>
  )
}

const gridStyles = StyleSheet.create({
  cell: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '48%' },
})

/** Card expansível de uma especialidade — colapsado mostra só a barra; expandido, o grid 2×2. */
export function EspecialidadeAtendimentosCard({ esp, colors, defaultOpen }: {
  esp: EspecialidadeResumo; colors: PacienteTheme; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const total = totalAtendimentos(esp)
  const pct = percentualRealizado(esp)

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => setOpen((o) => !o)}
    >
      <View style={styles.top}>
        <View>
          <Text style={[styles.name, { color: colors.text }]}>{esp.nome}</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>{esp.atendidos} de {total} realizados</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.pct, { color: colors.primary }]}>{fmtPct(pct)}</Text>
          <Ionicons name={open ? 'chevron-down' : 'chevron-forward'} size={16} color={colors.textFaint} />
        </View>
      </View>
      <View style={[styles.track, { backgroundColor: colors.bg }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.primary }]} />
      </View>
      {open && (
        <View style={[styles.grid, { borderTopColor: colors.divider }]}>
          <GridCell icon="checkmark" color={colors.primary} num={esp.atendidos} label="Atendidos" colors={colors} />
          <GridCell icon="calendar-outline" color={colors.info} num={esp.agendados} label="Agendados" colors={colors} />
          <GridCell icon="close" color={colors.danger} num={esp.faltas} label="Falta" border colors={colors} />
          <GridCell icon="remove" color={colors.textFaint} num={esp.cancelados} label="Cancelados" border colors={colors} />
        </View>
      )}
    </Pressable>
  )
}

function Pulse({ style, colors }: { style: any; colors: PacienteTheme }) {
  const opacity = useRef(new Animated.Value(0.5)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])
  return <Animated.View style={[{ backgroundColor: colors.border, borderRadius: 8, opacity }, style]} />
}

/** Skeleton do card de especialidade — usado enquanto o resumo carrega. */
export function EspecialidadeAtendimentosSkeleton({ colors }: { colors: PacienteTheme }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pulse colors={colors} style={{ width: '50%', height: 15, marginBottom: 8 }} />
      <Pulse colors={colors} style={{ width: '35%', height: 12, marginBottom: 12 }} />
      <Pulse colors={colors} style={{ width: '100%', height: 7 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 15 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '800' },
  sub: { fontSize: 12.5, marginTop: 2 },
  pct: { fontSize: 13.5, fontWeight: '800' },
  track: { height: 7, borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  grid: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
})
