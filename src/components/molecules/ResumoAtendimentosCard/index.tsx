import { useEffect, useRef } from 'react'
import { Animated, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle } from 'react-native-svg'
import type { PacienteTheme } from '../../../theme'
import { totalAtendimentos, percentualRealizado, type ContagemAtendimentos } from '../../../types/resumoAtendimentos'

function fmtPct(n: number) {
  return `${n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
}

function Ring({ pct, color, track, size = 132, sw = 11 }: {
  pct: number; color: string; track: string; size?: number; sw?: number
}) {
  const r = (size - sw) / 2
  const c = size / 2
  const circ = 2 * Math.PI * r
  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={c} cy={c} r={r} fill="none" stroke={track} strokeWidth={sw} />
      <Circle
        cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
      />
    </Svg>
  )
}

function StatDot({ icon, color, num, label, colors }: {
  icon: React.ComponentProps<typeof Ionicons>['name']; color: string; num: number; label: string; colors: PacienteTheme
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <View style={{ width: 22, height: 22, borderRadius: 999, borderWidth: 2, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={12} color={color} />
      </View>
      <View>
        <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>{num}</Text>
        <Text style={{ fontSize: 9.5, color: colors.textFaint }}>{label}</Text>
      </View>
    </View>
  )
}

/** Card "Resumo dos atendimentos" — anel de % realizado + contagem por status. */
export function ResumoAtendimentosCard({ geral, colors }: { geral: ContagemAtendimentos; colors: PacienteTheme }) {
  const total = totalAtendimentos(geral)
  const pct = percentualRealizado(geral)

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Resumo dos atendimentos</Text>
      <View style={styles.ringRow}>
        <View style={{ width: 132, height: 132, alignItems: 'center', justifyContent: 'center' }}>
          <Ring pct={pct} color={colors.primary} track={colors.border} />
          <Text style={[styles.ringPct, { color: colors.primary }]}>{fmtPct(pct)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.ringNum, { color: colors.text }]}>{geral.atendidos}</Text>
          <Text style={[styles.ringOf, { color: colors.textMuted }]}>de {total} realizados</Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.statsRow}>
        <StatDot icon="checkmark" color={colors.primary} num={geral.atendidos} label="Atendidos" colors={colors} />
        <StatDot icon="calendar-outline" color={colors.info} num={geral.agendados} label="Agendados" colors={colors} />
        <StatDot icon="close" color={colors.danger} num={geral.faltas} label="Faltas" colors={colors} />
        <StatDot icon="remove" color={colors.textFaint} num={geral.cancelados} label="Cancelado" colors={colors} />
      </View>
    </View>
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

/** Skeleton do card — mesma estrutura, sem número, evita layout shift ao carregar. */
export function ResumoAtendimentosSkeleton({ colors }: { colors: PacienteTheme }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pulse colors={colors} style={{ width: '60%', height: 16, marginBottom: 14 }} />
      <View style={styles.ringRow}>
        <Pulse colors={colors} style={{ width: 132, height: 132, borderRadius: 999 }} />
        <View style={{ flex: 1, gap: 8 }}>
          <Pulse colors={colors} style={{ width: 70, height: 30 }} />
          <Pulse colors={colors} style={{ width: 120, height: 14 }} />
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.statsRow}>
        <Pulse colors={colors} style={{ width: 60, height: 22 }} />
        <Pulse colors={colors} style={{ width: 60, height: 22 }} />
        <Pulse colors={colors} style={{ width: 60, height: 22 }} />
        <Pulse colors={colors} style={{ width: 60, height: 22 }} />
      </View>
    </View>
  )
}

/** Estado vazio — sem Plano de Cuidado ativo (ou plano ativo sem atendimentos). */
export function ResumoAtendimentosEmpty({ colors }: { colors: PacienteTheme }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.bg }]}>
        <Ionicons name="clipboard-outline" size={26} color={colors.textFaint} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum atendimento para mostrar</Text>
      <Text style={[styles.emptySub, { color: colors.textMuted }]}>
        Assim que houver um Plano de Cuidado ativo com atendimentos vinculados, o resumo aparece aqui.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  title: { fontSize: 15.5, fontWeight: '800', marginBottom: 14 },
  ringPct: { position: 'absolute', fontSize: 23, fontWeight: '800' },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  ringNum: { fontSize: 34, fontWeight: '800' },
  ringOf: { fontSize: 13.5, marginTop: 5 },
  divider: { height: 1, marginVertical: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', gap: 10, padding: 40 },
  emptyIcon: { width: 64, height: 64, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  emptySub: { fontSize: 12.5, textAlign: 'center', lineHeight: 18, maxWidth: 260 },
})
