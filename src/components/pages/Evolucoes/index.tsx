import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar, UnidadeRequired } from '../../organisms'
import { useEvolucoesPendentes } from '../../../hooks/useEvolucoesPendentes'
import { theme } from '../../../theme'
import type { EvolucaoPendente } from '../../../types/evolucaoPendente'

export function EvolucoesPendentesPage() {
  const router = useRouter()
  const { evolucoes, loading, erro } = useEvolucoesPendentes()

  function handleCardPress(evolucao: EvolucaoPendente) {
    if (!evolucao.pacienteid) return
    router.push(
      `/prontuario/${evolucao.pacienteid}?nome=${encodeURIComponent(evolucao.pacientenome ?? 'Paciente')}` as any,
    )
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="Evoluções Pendentes" showBack onBack={() => router.back()} showProfile={false} />

      <UnidadeRequired contextMessage="Selecione a unidade na home para visualizar as evoluções pendentes.">
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
          data={evolucoes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            evolucoes.length > 0 ? (
              <Text style={styles.count}>
                {evolucoes.length} {evolucoes.length === 1 ? 'evolução pendente' : 'evoluções pendentes'}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.primary[60]} />
              <Text style={styles.emptyText}>Nenhuma evolução pendente</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handleCardPress(item)}>
              <View style={styles.cardLeft}>
                <Text style={styles.pacienteNome}>{item.pacientenome ?? '—'}</Text>
                <View style={styles.cardRow}>
                  <Text style={styles.tipo}>{item.tipoevolucao?.tipo ?? 'Sem tipo'}</Text>
                  {item.dataform && (
                    <Text style={styles.data}>
                      {'  ·  '}
                      {item.dataform}
                      {item.hora ? ` ${item.hora}` : ''}
                    </Text>
                  )}
                </View>
                {item.profissionalnome && (
                  <Text style={styles.profissional}>{item.profissionalnome}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[40]} />
            </Pressable>
          )}
        />
      )}
      </UnidadeRequired>
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
    flex: 1,
    gap: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pacienteNome: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  tipo: {
    fontSize: 13,
    color: theme.colors.primary[70],
    fontWeight: '500',
  },
  data: {
    fontSize: 13,
    color: theme.colors.neutral[60],
  },
  profissional: {
    fontSize: 12,
    color: theme.colors.neutral[50],
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
