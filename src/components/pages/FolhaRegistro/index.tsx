import { useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../theme'
import { FolhaRegistroSheet } from '../../molecules/FolhaRegistroSheet'
import {
  folhaRegistroService,
  calcGeral,
  bandTone,
} from '../../../services/folhaRegistroService'
import type { FolhaRegistroView, Resultado } from '../../../types/folhaRegistro'
import { makeStyles } from './styles'

type Colors = ReturnType<typeof useTheme>['colors']

function toneColor(c: Colors, pct: number): string {
  const t = bandTone(pct)
  if (t === 'ok') return c.success[60]
  if (t === 'warn') return c.warning[60]
  return c.error[60]
}
function resultVisual(c: Colors, r: Resultado) {
  if (r === 1) return { label: 'Acerto', sym: '✓', color: c.success[60] }
  if (r === 0.5) return { label: 'Com ajuda', sym: '½', color: c.warning[60] }
  if (r === 0) return { label: 'Erro', sym: '✕', color: c.error[60] }
  return { label: 'N/A', sym: '–', color: c.neutral[50] }
}

// "2026-05-20" → "20/05/2026"
function formatData(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

type Props = {
  /** Id da evolução. Em Expo Router, pegue de useLocalSearchParams e passe aqui. */
  evolucaoId: number
}

export function FolhaRegistro({ evolucaoId }: Props) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  const [data, setData] = useState<FolhaRegistroView | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [aberta, setAberta] = useState(0) // primeira folha aberta por padrão

  useEffect(() => {
    let vivo = true
    setLoading(true)
    setErro(null)
    folhaRegistroService
      .getFolhaRegistro(evolucaoId)
      .then((d) => vivo && setData(d))
      .catch((e) => vivo && setErro(e?.message ?? 'Falha ao carregar a folha de registro.'))
      .finally(() => vivo && setLoading(false))
    return () => {
      vivo = false
    }
  }, [evolucaoId])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary[70]} />
      </View>
    )
  }
  if (erro || !data) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={28} color={colors.neutral[40]} />
        <Text style={styles.erroText}>{erro ?? 'Folha de registro não encontrada.'}</Text>
      </View>
    )
  }

  const { atendimento, folhas } = data
  const geral = calcGeral(folhas)
  const geralCor = toneColor(colors, geral.pct)

  const Field = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>
        <Ionicons name={icon} size={15} color={colors.primary[70]} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  )

  const counts: [keyof typeof geral.counts, Resultado][] = [
    ['ok', 1], ['half', 0.5], ['err', 0], ['na', -1],
  ]

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Cartão da sessão */}
      <View style={styles.card}>
        <View style={styles.sessHead}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.paciente} numberOfLines={2}>{atendimento.paciente}</Text>
            <Text style={styles.especialidade}>{atendimento.especialidade}</Text>
          </View>
          {atendimento.assinado && (
            <View style={styles.assinadoBadge}>
              <Ionicons name="shield-checkmark-outline" size={13} color={colors.success[60]} />
              <Text style={styles.assinadoText}>Assinado</Text>
            </View>
          )}
        </View>
        <View style={styles.fieldGrid}>
          <Field icon="calendar-outline" label="DATA" value={`${formatData(atendimento.data)} · ${atendimento.hora}`} />
          <Field icon="clipboard-outline" label="CATEGORIA" value={atendimento.categoria} />
          <Field icon="person-outline" label="PROFISSIONAL" value={atendimento.profissional} />
          <Field icon="document-text-outline" label="EVOLUÇÃO" value={`#${atendimento.id}`} />
        </View>
      </View>

      {/* Desempenho geral */}
      <View style={styles.card}>
        <View style={styles.geralHead}>
          <Ionicons name="stats-chart-outline" size={16} color={colors.primary[70]} />
          <Text style={styles.geralTitle}>Desempenho geral</Text>
        </View>
        <View style={styles.geralRow}>
          <Text style={[styles.geralPct, { color: geralCor }]}>{geral.pct}%</Text>
          <Text style={styles.geralSub}>Média ponderada · {geral.validas} tentativas válidas</Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${geral.pct}%`, backgroundColor: geralCor }]} />
        </View>
        <View style={styles.pillsRow}>
          {counts.map(([k, r]) => {
            const v = resultVisual(colors, r)
            return (
              <View key={k} style={styles.pill}>
                <View style={[styles.pillDot, { backgroundColor: v.color }]}>
                  <Text style={styles.pillSym}>{v.sym}</Text>
                </View>
                <Text style={styles.pillCount}>{geral.counts[k]}</Text>
                <Text style={styles.pillLabel}>{v.label}</Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* Folhas */}
      <Text style={styles.listTitle}>
        {folhas.length} {folhas.length === 1 ? 'folha de registro' : 'folhas de registro'}
      </Text>
      <View style={{ gap: 10 }}>
        {folhas.map((f, i) => (
          <FolhaRegistroSheet
            key={f.ordem}
            folha={f}
            open={aberta === i}
            onToggle={() => setAberta(aberta === i ? -1 : i)}
          />
        ))}
      </View>
    </ScrollView>
  )
}
