import { useMemo } from 'react'
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../../theme'
import type { darkColors } from '../../../../theme/dark'
import type { colors as lightColors } from '../../../../theme/colors'
import type { EvolucaoRealizada } from '../../../../types/evolucao'

type Colors = typeof lightColors | typeof darkColors

type EvolucaoTabProps = {
  pacienteId: string
  evolucoes: EvolucaoRealizada[]
  loading: boolean
  erro: string | null
}

function formatId(id: number): string {
  return `#${id.toString().padStart(4, '0')}`
}

export function EvolucaoTab({ pacienteId, evolucoes, loading, erro }: EvolucaoTabProps) {
  const router = useRouter()
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[70]} />
      </View>
    )
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.error[60]} />
        <Text style={styles.erroText}>{erro}</Text>
      </View>
    )
  }

  if (evolucoes.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="document-text-outline" size={48} color={colors.neutral[30]} />
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
              <Ionicons name="medkit-outline" size={14} color={colors.neutral[50]} />
              <Text style={styles.cardLabel}>{item.tipoevolucao || '—'}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.neutral[50]} />
              <Text style={styles.cardLabel}>{item.tipoatendimento || '—'}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="person-outline" size={14} color={colors.neutral[50]} />
              <Text style={styles.cardLabel}>{item.profissional}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.verMais}>Ver evolução</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary[70]} />
            </View>
          </Pressable>
        )}
      />
    </>
  )
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    erroText: {
      fontSize: 14,
      color: c.error[60],
    },
    emptyText: {
      fontSize: 14,
      color: c.neutral[50],
    },
    list: {
      padding: 16,
      gap: 12,
    },
    card: {
      backgroundColor: c.neutral[0],
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
      color: c.primary[80],
    },
    cardData: {
      fontSize: 12,
      color: c.neutral[50],
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cardLabel: {
      fontSize: 13,
      color: c.neutral[70],
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
      borderTopColor: c.neutral[20],
    },
    verMais: {
      fontSize: 13,
      fontWeight: '600',
      color: c.primary[70],
    },
  })
}
