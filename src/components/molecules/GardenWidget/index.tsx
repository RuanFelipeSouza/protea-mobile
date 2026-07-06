import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle, Text as SvgText } from 'react-native-svg'
import type { PacienteTheme } from '../../../theme'
import type { GardenStatusPaciente } from '../../../types/pacienteContextTypes'

// ── helpers ──────────────────────────────────────────────────────────────────

function gardenColor(pct: number, colors: PacienteTheme) {
  if (pct >= 70) return { color: colors.primary, soft: colors.primarySoft, label: 'Bom' }
  if (pct >= 60) return { color: colors.warn,    soft: colors.warnSoft,    label: 'Atenção' }
  return             { color: colors.danger,  soft: colors.dangerSoft,  label: 'Crítico' }
}

function ProgressRing({ pct, color, soft, size = 56, fs = 14 }: {
  pct: number; color: string; soft: string; size?: number; fs?: number
}) {
  const sw = 3.5
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const cx = size / 2, cy = size / 2
  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={r} fill={soft} stroke={`${color}22`} strokeWidth={sw} />
      <Circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${circ}`}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
        rotation={-90} originX={cx} originY={cy}
      />
      {/* % centralizado: textAnchor (horizontal) + alignmentBaseline central (vertical) */}
      <SvgText
        x={cx} y={cy}
        textAnchor="middle" alignmentBaseline="central"
        dy={fs * 0.02}
        fontSize={fs} fontWeight="800" fill={color}
      >
        {`${pct}%`}
      </SvgText>
    </Svg>
  )
}

// ── segmentos de tentativas (dado real, agregado de todos os programas) ────────

function SegBar({ tentativas, colors }: { tentativas: number[]; colors: PacienteTheme }) {
  if (!tentativas.length) return null
  return (
    <View style={widgetStyles.seg}>
      {tentativas.map((t, i) => (
        <View key={i} style={[widgetStyles.segItem, {
          backgroundColor: t === 1 ? colors.primary : t === 0.5 ? colors.warn : colors.border,
        }]} />
      ))}
    </View>
  )
}

// ── componente ────────────────────────────────────────────────────────────────

export function GardenWidget({ data, colors, onPress }: {
  data: GardenStatusPaciente
  colors: PacienteTheme
  onPress?: () => void
}) {
  const st = gardenColor(data.percentual_geral, colors)
  const diff = data.percentual_sessao_anterior != null
    ? data.percentual_geral - data.percentual_sessao_anterior
    : null
  const trendColor = diff == null ? colors.textMuted
    : diff > 0 ? colors.primary
    : diff < 0 ? colors.danger
    : colors.textMuted

  // barra segmentada agregada — junta as tentativas de todos os programas
  const allTentativas = data.programas.flatMap((p) => p.tentativas).slice(0, 24)

  return (
    <View style={widgetStyles.wrap}>
      <View style={widgetStyles.header}>
        <Text style={[widgetStyles.sectionTitle, { color: colors.text }]}>Progresso</Text>
        {diff !== null && (
          <Text style={[widgetStyles.trend, { color: trendColor }]}>
            {diff > 0 ? '↑' : diff < 0 ? '↓' : '→'} {Math.abs(diff)} pts vs anterior
          </Text>
        )}
      </View>

      <Pressable
        onPress={onPress}
        style={[widgetStyles.card, { backgroundColor: st.soft, borderColor: `${st.color}28` }]}
      >
        <View style={widgetStyles.top}>
          <ProgressRing pct={data.percentual_geral} color={st.color} soft={colors.surface} size={56} fs={14} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={[widgetStyles.badge, { backgroundColor: colors.surface }]}>
              <Text style={[widgetStyles.badgeText, { color: st.color }]}>{st.label}</Text>
            </View>
            <Text style={[widgetStyles.meta, { color: colors.textMuted }]}>
              Última sessão · {data.data_ultima_sessao}
            </Text>
            <Text style={[widgetStyles.meta2, { color: colors.textMuted }]}>
              {data.programas.length} {data.programas.length === 1 ? 'programa' : 'programas'}
            </Text>
          </View>
          {onPress && (
            <Ionicons name="chevron-forward" size={18} color={st.color} style={{ flexShrink: 0 }} />
          )}
        </View>

        {allTentativas.length > 0 && (
          <SegBar tentativas={allTentativas} colors={colors} />
        )}
      </Pressable>
    </View>
  )
}

const widgetStyles = StyleSheet.create({
  wrap: { gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '700' },
  trend: { fontSize: 12, fontWeight: '700' },
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: { fontSize: 11.5, fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 6 },
  meta2: { fontSize: 12, marginTop: 2 },
  seg: { flexDirection: 'row', gap: 2 },
  segItem: { flex: 1, height: 6, borderRadius: 2 },
})
