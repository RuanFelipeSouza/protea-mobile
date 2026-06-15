import { useEffect, useMemo, useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../theme'
import { getStatusStyle } from '../AgendaCard'
import type { AgendaItem } from '../../../types/agenda'
import { makeStyles } from './styles'

const SCREEN_H = Dimensions.get('window').height

const DIAS = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado',
]
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

// "2026-06-16" → "Terça-feira, 16 de junho"
function formatData(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${DIAS[dt.getDay()]}, ${String(d).padStart(2, '0')} de ${MESES[m - 1]}`
}

type Props = {
  /** Item selecionado. Quando `null`, o sheet fica fechado. */
  item: AgendaItem | null
  visible: boolean
  /** Nome da unidade atual (vem do unidadeStore na página). */
  unidadeNome?: string
  onClose: () => void
  /** Disparado pelo botão "Ver paciente". */
  onVerPaciente: (item: AgendaItem) => void
}

export function AgendaDetailSheet({
  item,
  visible,
  unidadeNome = '—',
  onClose,
  onVerPaciente,
}: Props) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  const translateY = useRef(new Animated.Value(SCREEN_H)).current
  const scrim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_H)
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 24,
          stiffness: 280,
          mass: 0.9,
        }),
        Animated.timing(scrim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start()
    }
  }, [visible, translateY, scrim])

  function handleClose() {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SCREEN_H, duration: 240, useNativeDriver: true }),
      Animated.timing(scrim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onClose()
    })
  }

  if (!item) return null

  const statusStyle = getStatusStyle(item.status, colors as any)
  const categoria = (item.categoria || '').trim()
  const especialidade = (item.especialidade || '').trim() || '—'
  const isBloqueio = categoria.toLowerCase() === 'bloqueado'
  const semSala = !item.sala || /não há horário/i.test(item.sala)
  const substituicao = item.substituicao === true

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.root}>
        {/* scrim */}
        <Animated.View style={[styles.scrim, { opacity: scrim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* sheet */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.grabber} />

          {/* header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>
                {isBloqueio ? 'DETALHES DO BLOQUEIO' : 'DETALHES DO AGENDAMENTO'}
              </Text>
              <Text style={styles.nome} numberOfLines={2}>{item.nome}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
              </View>
            </View>
            <Pressable onPress={handleClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.neutral[60]} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* date / time hero */}
            <View style={styles.hero}>
              <View style={styles.heroIcon}>
                <Ionicons name="time-outline" size={22} color={colors.primary[80]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroData}>{formatData(item.data)}</Text>
                <Text style={styles.heroHora}>{item.hora}</Text>
              </View>
              {substituicao && (
                <View style={styles.subBadge}>
                  <Text style={styles.subBadgeText}>SUBSTITUIÇÃO</Text>
                </View>
              )}
            </View>

            {(semSala || isBloqueio) && (
              <View style={styles.note}>
                <Ionicons name="alert-circle-outline" size={15} color={colors.neutral[50]} />
                <Text style={styles.noteText}>
                  {isBloqueio ? 'Horário bloqueado na agenda' : 'Não há horário configurado'}
                </Text>
              </View>
            )}

            {/* detail rows */}
            <DetailRow icon="list-outline" label="Tipo" value={categoria} styles={styles} colors={colors} />
            <DetailRow icon="medkit-outline" label="Especialidade" value={especialidade} styles={styles} colors={colors} />
            <DetailRow icon="person-outline" label="Profissional" value={item.profissional} styles={styles} colors={colors} />
            <DetailRow icon="location-outline" label="Sala" value={semSala ? 'Não informada' : item.sala} styles={styles} colors={colors} />
            <DetailRow icon="business-outline" label="Unidade" value={unidadeNome} styles={styles} colors={colors} last />
          </ScrollView>

          {/* footer — único CTA: tela do paciente (perfil + evoluções) */}
          {!isBloqueio && (
            <View style={styles.footer}>
              <Pressable
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
                onPress={() => onVerPaciente(item)}
              >
                <Ionicons name="person-circle-outline" size={20} color={colors.neutral[0]} />
                <Text style={styles.ctaText}>Ver paciente</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.neutral[0]} />
              </Pressable>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value: string
  last?: boolean
  styles: ReturnType<typeof makeStyles>
  colors: ReturnType<typeof useTheme>['colors']
}

function DetailRow({ icon, label, value, last, styles, colors }: RowProps) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.primary[70]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  )
}
