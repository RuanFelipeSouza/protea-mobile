import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../theme'
import {
  calcFolha,
  groupByAlvo,
  bandTone,
  type ResumoFolha,
} from '../../../services/folhaRegistroService'
import type { FolhaRegistro, Resultado } from '../../../types/folhaRegistro'
import { makeStyles } from './styles'

type Colors = ReturnType<typeof useTheme>['colors']

/** Cor sólida do percentual conforme a faixa de desempenho. */
function toneColor(c: Colors, pct: number): string {
  const t = bandTone(pct)
  if (t === 'ok') return c.success[60]
  if (t === 'warn') return c.warning[60]
  return c.error[60]
}

type Visual = { label: string; sym: string; color: string }
/** Mapeia o resultado para símbolo + cor (usa a escala do tema). */
function resultVisual(c: Colors, r: Resultado): Visual {
  if (r === 1) return { label: 'Acerto', sym: '✓', color: c.success[60] }
  if (r === 0.5) return { label: 'Com ajuda', sym: '½', color: c.warning[60] }
  if (r === 0) return { label: 'Erro', sym: '✕', color: c.error[60] }
  return { label: 'N/A', sym: '–', color: c.neutral[50] }
}

type Props = {
  folha: FolhaRegistro
  open: boolean
  onToggle: () => void
}

export function FolhaRegistroSheet({ folha, open, onToggle }: Props) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const resumo: ResumoFolha = useMemo(() => calcFolha(folha.tentativas), [folha.tentativas])
  const grupos = useMemo(() => groupByAlvo(folha.tentativas), [folha.tentativas])
  const cor = toneColor(colors, resumo.pct)

  return (
    <View style={[styles.card, open && styles.cardOpen]}>
      <Pressable style={styles.header} onPress={onToggle} android_ripple={{ color: colors.neutral[10] }}>
        <View style={styles.ordemChip}>
          <Text style={styles.ordemText}>{folha.ordem}</Text>
        </View>
        <View style={styles.headerTexts}>
          <Text style={styles.programa} numberOfLines={1}>{folha.programa}</Text>
          <Text style={styles.dominio} numberOfLines={1}>{folha.dominio}</Text>
        </View>
        <Text style={[styles.pct, { color: cor }]}>{resumo.pct}%</Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={colors.neutral[50]}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {/* barra de progresso (sempre visível) */}
      <View style={styles.barWrap}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${resumo.pct}%`, backgroundColor: cor }]} />
        </View>
      </View>

      {open && (
        <View style={styles.body}>
          {/* Ajuda */}
          <View style={styles.block}>
            <SectionLabel icon="hand-left-outline" styles={styles} colors={colors}>Ajuda</SectionLabel>
            <Text style={styles.ajudaValue}>{folha.ajuda}</Text>
          </View>

          {/* Tentativas agrupadas por alvo */}
          <View style={styles.block}>
            <SectionLabel icon="list-outline" styles={styles} colors={colors}>Tentativas por alvo</SectionLabel>
            <View style={{ gap: 10 }}>
              {grupos.map((g) => {
                const gcor = toneColor(colors, g.pct)
                return (
                  <View key={g.alvo} style={styles.alvoCard}>
                    <View style={styles.alvoHead}>
                      <View style={styles.alvoTitleWrap}>
                        <Ionicons name="locate-outline" size={14} color={colors.primary[70]} style={{ marginTop: 1 }} />
                        <Text style={styles.alvoTitle}>{g.alvo}</Text>
                      </View>
                      <View style={styles.alvoStats}>
                        <Text style={[styles.alvoPct, { color: gcor }]}>{g.pct}%</Text>
                        <Text style={styles.alvoValidas}>{g.validas}/{g.total} válidas</Text>
                      </View>
                    </View>
                    <View style={styles.chipsRow}>
                      {g.tentativas.map((t) => {
                        const v = resultVisual(colors, t.resultado)
                        return (
                          <View key={t.numero} style={[styles.chip, { backgroundColor: v.color }]}>
                            <Text style={styles.chipSym}>{v.sym}</Text>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )
              })}
            </View>
          </View>

          {/* Observações */}
          {!!folha.observacao && (
            <View style={styles.obsBox}>
              <SectionLabel icon="chatbubble-ellipses-outline" styles={styles} colors={colors}>Observações</SectionLabel>
              <Text style={styles.obsText}>{folha.observacao}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

type LabelProps = {
  icon: keyof typeof Ionicons.glyphMap
  children: string
  styles: ReturnType<typeof makeStyles>
  colors: Colors
}
function SectionLabel({ icon, children, styles, colors }: LabelProps) {
  return (
    <View style={styles.sectionLabel}>
      <Ionicons name={icon} size={13} color={colors.primary[70]} />
      <Text style={styles.sectionLabelText}>{children}</Text>
    </View>
  )
}
