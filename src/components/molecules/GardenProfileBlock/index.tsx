import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg'
import type { PacienteTheme } from '../../../theme'
import type { GardenStatusPaciente } from '../../../types/pacienteContextTypes'

// ── helpers ──────────────────────────────────────────────────────────────────

function gardenColor(pct: number, colors: PacienteTheme) {
  if (pct >= 70) return { color: colors.primary, soft: colors.primarySoft, label: 'Bom' }
  if (pct >= 60) return { color: colors.warn,    soft: colors.warnSoft,    label: 'Atenção' }
  return             { color: colors.danger,  soft: colors.dangerSoft,  label: 'Crítico' }
}

function ProgressRing({ pct, color, soft, size = 64, fs = 16 }: {
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
      {/* Centralização robusta: textAnchor centra na horizontal;
          alignmentBaseline="central" centra na vertical (iOS/Web).
          dy é o fallback para Android, onde alignmentBaseline pode ser ignorado. */}
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

// ── barra segmentada de tentativas (dado real) ────────────────────────────────

function SegBar({ tentativas, colors }: { tentativas: number[]; colors: PacienteTheme }) {
  if (!tentativas.length) return null
  return (
    <View style={rowStyles.seg}>
      {tentativas.map((t, i) => (
        <View key={i} style={[rowStyles.segItem, {
          backgroundColor: t === 1 ? colors.primary : t === 0.5 ? colors.warn : colors.border,
        }]} />
      ))}
    </View>
  )
}

// ── linha de programa expansível ──────────────────────────────────────────────

function ProgramaRow({ programa, colors }: {
  programa: GardenStatusPaciente['programas'][number]
  colors: PacienteTheme
}) {
  const [open, setOpen] = useState(false)
  const st = gardenColor(programa.percentual, colors)
  const ct = (v: number) => programa.tentativas.filter((t) => t === v).length

  return (
    <Pressable
      onPress={() => setOpen(!open)}
      style={[rowStyles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[rowStyles.acc, { backgroundColor: st.color }]} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[rowStyles.nome, { color: colors.text }]} numberOfLines={1}>{programa.nome}</Text>
        <Text style={[rowStyles.dominio, { color: colors.textMuted }]} numberOfLines={1}>
          {programa.dominio}{programa.nivel_ajuda ? ` · ${programa.nivel_ajuda}` : ''}
        </Text>

        <SegBar tentativas={programa.tentativas} colors={colors} />

        {open && (
          <View style={rowStyles.legend}>
            {([
              ['Independente', colors.primary, ct(1)],
              ['Com ajuda',    colors.warn,    ct(0.5)],
              ['Não realiz.',  colors.border,  ct(0)],
            ] as [string, string, number][]).map(([lbl, bg, n]) => (
              <View key={lbl} style={rowStyles.legendItem}>
                <View style={[rowStyles.legendDot, { backgroundColor: bg }]} />
                <Text style={[rowStyles.legendText, { color: colors.textMuted }]}>{n} {lbl}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Text style={[rowStyles.pct, { color: st.color }]}>{programa.percentual}%</Text>
    </Pressable>
  )
}

const rowStyles = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 11, paddingRight: 12,
    borderRadius: 12, borderWidth: 1,
  },
  acc: { width: 4, alignSelf: 'stretch', borderRadius: 999 },
  nome: { fontSize: 13, fontWeight: '700', lineHeight: 17 },
  dominio: { fontSize: 11.5, marginTop: 2 },
  seg: { flexDirection: 'row', gap: 2, marginTop: 7 },
  segItem: { flex: 1, height: 6, borderRadius: 2 },
  pct: { fontSize: 17, fontWeight: '800', flexShrink: 0 },
  legend: { flexDirection: 'row', gap: 10, marginTop: 9, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 7, height: 7, borderRadius: 999 },
  legendText: { fontSize: 10.5 },
})

// ── componente principal ──────────────────────────────────────────────────────

export function GardenProfileBlock({ data, colors, label = 'PROGRESSO' }: {
  data: GardenStatusPaciente
  colors: PacienteTheme
  label?: string
}) {
  const st = gardenColor(data.percentual_geral, colors)
  const diff = data.percentual_sessao_anterior != null
    ? data.percentual_geral - data.percentual_sessao_anterior
    : null
  const n = data.programas.length

  return (
    <View style={blockStyles.group}>
      <View style={blockStyles.groupTitleRow}>
        <Svg width={10} height={12} viewBox="0 0 9 11">
          <Path d="M4.5 0C3 3 0 4.5 0 7a4.5 4.5 0 009 0C9 4.5 6 3 4.5 0z" fill={colors.primary} />
        </Svg>
        <Text style={[blockStyles.groupTitle, { color: colors.primaryStrong }]}>{label}</Text>
      </View>

      <View style={[blockStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Hero com leve tom de status — sem barra divisória */}
        <View style={[blockStyles.hero, { backgroundColor: st.soft }]}>
          <ProgressRing pct={data.percentual_geral} color={st.color} soft={colors.surface} size={70} fs={17} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={blockStyles.heroTop}>
              <View style={[blockStyles.badge, { backgroundColor: colors.surface }]}>
                <Text style={[blockStyles.badgeText, { color: st.color }]}>{st.label}</Text>
              </View>
              {diff !== null && (
                <Text style={[blockStyles.trend, {
                  color: diff > 0 ? colors.primary : diff < 0 ? colors.danger : colors.textMuted
                }]}>
                  {diff > 0 ? '↑' : diff < 0 ? '↓' : '→'} {Math.abs(diff)} pts
                </Text>
              )}
            </View>
            <Text style={[blockStyles.meta, { color: colors.textMuted }]}>
              Última sessão · {data.data_ultima_sessao}
            </Text>
            <Text style={[blockStyles.meta2, { color: colors.textMuted }]}>
              {n} {n === 1 ? 'programa acompanhado' : 'programas acompanhados'}
            </Text>
          </View>
        </View>

        {/* Programas — cards com acento lateral e barra de tentativas */}
        <View style={blockStyles.list}>
          {data.programas.map((p, i) => (
            <ProgramaRow key={i} programa={p} colors={colors} />
          ))}
        </View>
      </View>
    </View>
  )
}

const blockStyles = StyleSheet.create({
  group: { gap: 6 },
  groupTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 4 },
  groupTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  trend: { fontSize: 11.5, fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 7 },
  meta2: { fontSize: 12, marginTop: 2 },
  list: { padding: 8, gap: 8 },
})
