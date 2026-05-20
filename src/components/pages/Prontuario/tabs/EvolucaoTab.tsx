import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useEvolucoes } from '../../../../hooks/useEvolucoes'
import { theme } from '../../../../theme'
import type { EvolucaoRealizada } from '../../../../types/evolucao'

type EvolucaoTabProps = {
  pacienteId: string
}

function formatId(id: number): string {
  return `#${id.toString().padStart(4, '0')}`
}

export function EvolucaoTab({ pacienteId }: EvolucaoTabProps) {
  const router = useRouter()
  const { evolucoes, loading, erro } = useEvolucoes(pacienteId)

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary[70]} />
      </View>
    )
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={40} color={theme.colors.error[60]} />
        <Text style={styles.erroText}>{erro}</Text>
      </View>
    )
  }

  if (evolucoes.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="document-text-outline" size={48} color={theme.colors.neutral[30]} />
        <Text style={styles.emptyText}>Nenhuma evolução registrada</Text>
      </View>
    )
  }

  return (
    <>
      <FlatList
        data={evolucoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/prontuario/[id]/evolucao/[evolucao_id]',
                params: {
                  id: pacienteId,
                  evolucao_id: item.id,
                },
              })
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>{formatId(item.id)}</Text>
              <Text style={styles.cardData}>{item.data} · {item.hora}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="medkit-outline" size={14} color={theme.colors.neutral[50]} />
              <Text style={styles.cardLabel}>{item.tipoevolucao || '—'}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={14} color={theme.colors.neutral[50]} />
              <Text style={styles.cardLabel}>{item.tipoatendimento || '—'}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="person-outline" size={14} color={theme.colors.neutral[50]} />
              <Text style={styles.cardLabel}>{item.profissional}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.verMais}>Ver evolução</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary[70]} />
            </View>
          </Pressable>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  erroText: {
    fontSize: 14,
    color: theme.colors.error[60],
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.neutral[50],
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardId: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary[80],
  },
  cardData: {
    fontSize: 12,
    color: theme.colors.neutral[50],
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    color: theme.colors.neutral[70],
    flexShrink: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[20],
  },
  verMais: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary[70],
  },
})
