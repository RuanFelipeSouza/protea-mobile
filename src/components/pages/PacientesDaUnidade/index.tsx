import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar } from '../../organisms'
import { usePacientesDaUnidade } from '../../../hooks/usePacientesDaUnidade'
import { theme } from '../../../theme'
import type { PacienteMobile } from '../../../types/mobile'

type Props = {
  unidadeId: number
  nomeUnidade?: string
}

export function PacientesDaUnidadePage({ unidadeId, nomeUnidade }: Props) {
  const router = useRouter()
  const { pacientes, loading, erro } = usePacientesDaUnidade(unidadeId)

  function handlePress(paciente: PacienteMobile) {
    router.push(
      `/minhas-unidades/${unidadeId}/${paciente.id}?nome=${encodeURIComponent(paciente.nome)}` as any,
    )
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title={nomeUnidade ?? 'Pacientes'}
        showBack
        onBack={() => router.back()}
        showProfile={false}
        showUnidade={false}
      />

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary[70]} />
        </View>
      )}

      {erro && (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color={theme.colors.error[40]} />
          <Text style={styles.erroText}>{erro}</Text>
        </View>
      )}

      {!loading && !erro && (
        <FlatList
          data={pacientes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            pacientes.length > 0 ? (
              <Text style={styles.count}>
                {pacientes.length} {pacientes.length === 1 ? 'paciente' : 'pacientes'}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="people-outline" size={48} color={theme.colors.neutral[40]} />
              <Text style={styles.emptyText}>Nenhum paciente nesta unidade</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handlePress(item)}>
              <View style={styles.cardLeft}>
                <Ionicons name="person-circle-outline" size={36} color={theme.colors.primary[50]} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
                {item.datanascimento && (
                  <Text style={styles.data}>Nasc. {item.datanascimento}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[40]} />
            </Pressable>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[10],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 60,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  count: {
    fontSize: 13,
    color: theme.colors.neutral[60],
    marginBottom: 8,
  },
  card: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLeft: {
    width: 36,
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  nome: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  data: {
    fontSize: 13,
    color: theme.colors.neutral[60],
  },
  erroText: {
    fontSize: 14,
    color: theme.colors.error[40],
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.neutral[60],
    textAlign: 'center',
  },
})
