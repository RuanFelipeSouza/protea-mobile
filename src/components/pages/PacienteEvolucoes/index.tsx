import { useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePacienteTheme, type PacienteTheme } from '../../../theme'
import { usePacienteEvolucoes } from '../../../hooks/usePacienteEvolucoes'
import type { EvolucaoPaciente } from '../../../types/pacienteContextTypes'

function EvoCard({ e, colors, onPress }: {
  e: EvolucaoPaciente
  colors: PacienteTheme
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[cardStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={cardStyles.top}>
        <Text style={[cardStyles.id, { color: colors.primary }]}>#{e.id}</Text>
        <Text style={[cardStyles.date, { color: colors.textFaint }]}>
          {e.data} · {e.hora}
        </Text>
      </View>
      <View style={cardStyles.row}>
        <Ionicons name="add-circle-outline" size={16} color={colors.textFaint} />
        <Text style={[cardStyles.tipo, { color: colors.text }]}>{e.tipo}</Text>
      </View>
      <View style={cardStyles.row}>
        <Ionicons name="pulse-outline" size={16} color={colors.textFaint} />
        <Text style={[cardStyles.meta, { color: colors.textMuted }]}>{e.modalidade}</Text>
      </View>
      <View style={cardStyles.row}>
        <Ionicons name="person-outline" size={16} color={colors.textFaint} />
        <Text style={[cardStyles.meta, { color: colors.textMuted }]}>{e.profissional}</Text>
      </View>
      <View style={[cardStyles.footer, { borderTopColor: colors.border }]}>
        <Text style={[cardStyles.link, { color: colors.primary }]}>Ver evolução</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </View>
    </Pressable>
  )
}

const cardStyles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingTop: 13, paddingBottom: 0 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  id: { fontSize: 15, fontWeight: '700' },
  date: { fontSize: 12.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 7 },
  tipo: { fontSize: 13.5, fontWeight: '600' },
  meta: { fontSize: 13.5 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    borderTopWidth: 1,
    marginTop: 12,
    paddingVertical: 10,
  },
  link: { fontSize: 13.5, fontWeight: '600' },
})

export function PacienteEvolucoesPage() {
  const router = useRouter()
  const { dark, colors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const insets = useSafeAreaInsets()

  const { evolucoes, loading, erro } = usePacienteEvolucoes()

  function handleOpen(e: EvolucaoPaciente) {
    router.push({
      pathname: '/(paciente)/evolucao/[id]',
      params: { id: String(e.id) },
    } as never)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 8 },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerSide}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Evoluções</Text>
        <View style={styles.headerSide} />
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
      ) : (
        <FlatList
          data={evolucoes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="document-text-outline" size={48} color={colors.textFaint} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nenhuma evolução encontrada</Text>
            </View>
          }
          renderItem={({ item }) => <EvoCard e={item} colors={colors} onPress={() => handleOpen(item)} />}
        />
      )}
    </View>
  )
}

function makeStyles(colors: PacienteTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1 },
    headerSide: { width: 40, alignItems: 'center' },
    headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', textAlign: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 60 },
    list: { padding: 14, gap: 12 },
    erroText: { fontSize: 14, textAlign: 'center' },
    emptyText: { fontSize: 15, textAlign: 'center' },
  })
}
