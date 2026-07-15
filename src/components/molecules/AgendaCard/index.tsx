import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../theme'
import type { AgendaItem } from '../../../types/agenda'
import { useFolhaAgendamento } from '../../../hooks/useFolhaAgendamento'
import type { FolhaAgendamentoStatus } from '../../../services/folhaAgendamentoService'
import { makeStyles } from './styles'

/**
 * Cores canônicas de status (compartilhadas pela borda do card e pelo badge).
 * Valores fixos definidos pelo time de design/produto — não seguem a escala do tema.
 */
export function getStatusStyle(status: string): { color: string; bg: string } {
  const s = status.toLowerCase()
  if (s.includes('atendido'))  return { color: '#25a66a', bg: '#eaf7f2' }
  if (s.includes('faltou'))    return { color: '#c95b5b', bg: '#fbeeee' }
  if (s.includes('cancel'))    return { color: '#69736e', bg: '#f0f2f1' }
  if (s.includes('pendente'))  return { color: '#d98a31', bg: '#fdf3e7' }
  if (s.includes('bloquead'))  return { color: '#8069a8', bg: '#f1edf7' }
  return { color: '#2f80ed', bg: '#eaf3fd' } // Agendado (e demais)
}

type FolhaColors = ReturnType<typeof useTheme>['colors']

/** Apresentação da faixa de folha por estado. `null` ⇒ sem faixa (sem_plano). */
export function folhaMeta(status: FolhaAgendamentoStatus, colors: FolhaColors) {
  switch (status) {
    case 'pendente':
      return {
        label: 'Folha pendente',
        color: colors.warning[60],
        soft: colors.warning[10],
        cta: 'Preencher',
        ctaFill: true,
        icon: 'create-outline' as const,
        destino: 'criar' as const,
      }
    case 'preenchida':
      return {
        label: 'Rascunho salvo',
        color: colors.info[60],
        soft: colors.info[10],
        cta: 'Editar',
        ctaFill: false,
        icon: 'create-outline' as const,
        destino: 'editar' as const,
      }
    case 'concluida':
      return {
        label: 'Folha concluída',
        color: colors.primary[70],
        soft: colors.primary[10],
        cta: 'Ver',
        ctaFill: false,
        icon: 'checkmark-circle-outline' as const,
        destino: 'ver' as const,
      }
    default:
      return null
  }
}

type Props = {
  item: AgendaItem
  onPress?: () => void
}

export function AgendaCard({ item, onPress }: Props) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const statusStyle = getStatusStyle(item.status)
  const router = useRouter()
  const { status: folhaStatus, chaveEditor } = useFolhaAgendamento(item)
  const [aberta, setAberta] = useState(true) // faixa é um accordion — padrão aberto
  const fm = folhaMeta(folhaStatus, colors)
  const Container = onPress ? Pressable : View

  function handleFolhaAction() {
    if (!fm || chaveEditor == null) return
    if (fm.destino === 'criar') router.push(`/folha-registro/criar/${chaveEditor}` as never)
    else if (fm.destino === 'editar') router.push(`/folha-registro/editar/${chaveEditor}` as never)
    else router.push(`/folha-registro/${chaveEditor}` as never)
  }

  return (
    <View style={[styles.container, { borderLeftColor: item.cor || colors.primary[60] }]}>
      <Container onPress={onPress} style={styles.row}>
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
        {fm && (
          <Pressable
            onPress={() => setAberta((o) => !o)}
            hitSlop={8}
            style={styles.chevronBtn}
          >
            <Ionicons
              name={aberta ? 'chevron-up' : 'chevron-down'}
              size={17}
              color={colors.neutral[50]}
            />
          </Pressable>
        )}
      </Container>

      {fm && aberta && (
        <View style={[styles.faixa, { backgroundColor: colors.neutral[10] }]}>
          <Ionicons name={fm.icon} size={15} color={fm.color} />
          <Text style={[styles.faixaLabel, { color: fm.color }]} numberOfLines={1}>
            {fm.label}
          </Text>
          <Pressable
            onPress={handleFolhaAction}
            style={[
              styles.faixaPill,
              fm.ctaFill
                ? { backgroundColor: fm.color }
                : { borderWidth: 1, borderColor: fm.color },
            ]}
          >
            <Text
              style={[
                styles.faixaPillText,
                { color: fm.ctaFill ? colors.neutral[0] : fm.color },
              ]}
            >
              {fm.cta}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
