import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar } from '../../organisms'
import { useMinhasUnidades } from '../../../hooks/useMinhasUnidades'
import { theme } from '../../../theme'
import type { Unidade } from '../../../types/unidade'

export function MinhasUnidadesPage() {
  const router = useRouter()
  const { unidades, loading, erro } = useMinhasUnidades()

  function handlePress(unidade: Unidade) {
    router.push(
      `/minhas-unidades/${unidade.id}?nome=${encodeURIComponent(unidade.unidade)}` as any,
    )
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="Minhas Unidades" showBack onBack={() => router.back()} showProfile={false} showUnidade={false} />

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
          data={unidades}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            unidades.length > 0 ? (
              <Text style={styles.count}>
                {unidades.length} {unidades.length === 1 ? 'unidade' : 'unidades'}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="business-outline" size={48} color={theme.colors.neutral[40]} />
              <Text style={styles.emptyText}>Nenhuma unidade cadastrada</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handlePress(item)}>
              <View style={styles.cardLeft}>
                <Ionicons name="business" size={20} color={theme.colors.primary[60]} />
              </View>
              <Text style={styles.nome} numberOfLines={2}>{item.unidade}</Text>
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
    padding: 16,
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
    width: 32,
    alignItems: 'center',
  },
  nome: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.neutral[90],
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
