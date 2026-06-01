import { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePacienteTheme, type PacienteTheme } from '../../../theme'
import { getPacienteEvolucaoDetalhe } from '../../../services/pacienteDataService'
import type { EvolucaoPacienteDetalhe } from '../../../types/pacienteContextTypes'

type Props = { evolucaoId: string }

export function PacienteEvolucaoDetalhePage({ evolucaoId }: Props) {
  const router = useRouter()
  const { dark, colors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const insets = useSafeAreaInsets()

  const [detalhe, setDetalhe] = useState<EvolucaoPacienteDetalhe | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getPacienteEvolucaoDetalhe(evolucaoId)
      .then(setDetalhe)
      .catch((e) => setErro(e?.message ?? 'Erro ao carregar evolução'))
      .finally(() => setLoading(false))
  }, [evolucaoId])

  return (
    <View style={styles.container}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* header com voltar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Evolução #{evolucaoId}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
          <Text style={[styles.erroText, { color: colors.danger }]}>{erro}</Text>
        </View>
      ) : detalhe ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* cabeçalho da evolução */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardTop}>
              <Text style={[styles.evoId, { color: colors.primary }]}>#{detalhe.id}</Text>
              <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{detalhe.tipo}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="pulse-outline" size={15} color={colors.textFaint} />
              <Text style={[styles.meta, { color: colors.textMuted }]}>{detalhe.modalidade}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={15} color={colors.textFaint} />
              <Text style={[styles.meta, { color: colors.textMuted }]}>{detalhe.profissional}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={15} color={colors.textFaint} />
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {detalhe.data} · {detalhe.hora}
              </Text>
            </View>
          </View>

          {/* blocos de conteúdo clínico */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {detalhe.objetivo && (
              <ContentBlock
                title="Objetivo da sessão"
                body={detalhe.objetivo}
                colors={colors}
              />
            )}
            {detalhe.conduta && (
              <ContentBlock
                title="Conduta"
                body={detalhe.conduta}
                colors={colors}
                separator
              />
            )}
            {detalhe.orientacoes && (
              <ContentBlock
                title="Orientações para casa"
                body={detalhe.orientacoes}
                colors={colors}
                separator
              />
            )}
            {!detalhe.objetivo && !detalhe.conduta && !detalhe.orientacoes && (
              <Text style={[styles.emptyContent, { color: colors.textMuted }]}>
                Conteúdo clínico não disponível.
              </Text>
            )}
          </View>
        </ScrollView>
      ) : null}
    </View>
  )
}

function ContentBlock({
  title,
  body,
  colors,
  separator,
}: {
  title: string
  body: string
  colors: PacienteTheme
  separator?: boolean
}) {
  return (
    <View style={{ gap: 6, marginTop: separator ? 18 : 0 }}>
      {separator && <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 12 }} />}
      <Text style={{ fontSize: 11.5, fontWeight: '700', color: colors.primaryStrong, letterSpacing: 0.4, textTransform: 'uppercase' }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14.5, color: colors.text, lineHeight: 23 }}>{body}</Text>
    </View>
  )
}

function makeStyles(colors: PacienteTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 17, fontWeight: '700' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    scroll: { padding: 16, gap: 16 },
    card: { borderRadius: 14, borderWidth: 1, padding: 16 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
    evoId: { fontSize: 16, fontWeight: '700' },
    badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
    badgeText: { fontSize: 12, fontWeight: '700' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
    meta: { fontSize: 13.5 },
    erroText: { fontSize: 14, textAlign: 'center' },
    emptyContent: { fontSize: 14, textAlign: 'center', paddingVertical: 16 },
  })
}
