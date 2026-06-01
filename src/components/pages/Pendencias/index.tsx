import { useMemo } from 'react'
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar, UnidadeRequired } from '../../organisms'
import { usePendencias } from '../../../hooks/usePendencias'
import { useTheme } from '../../../theme'
import type { darkColors } from '../../../theme/dark'
import type { colors as lightColors } from '../../../theme/colors'
import type { Pendencia } from '../../../types/evolucaoPendente'

type Colors = typeof lightColors | typeof darkColors

export function PendenciasPage() {
  const router = useRouter()
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { pendencias, loading, erro } = usePendencias()

  function handleCardPress(pendencia: Pendencia) {
    router.push({
      pathname: '/prontuario/[id]/evolucao/[evolucao_id]',
      params: { id: pendencia.paciente_id, evolucao_id: pendencia.id },
    } as never)
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Pendências"
        showBack
        onBack={() => router.back()}
        showProfile={false}
      />

      <UnidadeRequired contextMessage="Selecione a unidade na home para visualizar as pendências.">
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary[70]} />
          </View>
        )}

        {erro && (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.error[40]} />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        )}

        {!loading && !erro && (
          <FlatList
            data={pendencias}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              pendencias.length > 0 ? (
                <Text style={styles.count}>
                  {pendencias.length} {pendencias.length === 1 ? 'pendência' : 'pendências'}
                </Text>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={48}
                  color={colors.neutral[40]}
                />
                <Text style={styles.emptyText}>Nenhuma pendência encontrada</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => handleCardPress(item)}>
                <View style={styles.cardLeft}>
                  <Text style={styles.pacienteNome}>{item.paciente_nome ?? '—'}</Text>
                  <View style={styles.cardRow}>
                    <Text style={styles.tipo}>{item.tipo ?? 'Sem tipo'}</Text>
                    <Text style={styles.data}>
                      {'  ·  '}
                      {item.data}
                      {item.hora ? ` ${item.hora}` : ''}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.neutral[40]} />
              </Pressable>
            )}
          />
        )}

      </UnidadeRequired>
    </View>
  )
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.neutral[10],
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
      color: c.neutral[60],
      marginBottom: 8,
    },
    card: {
      backgroundColor: c.neutral[0],
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
      color: c.neutral[90],
    },
    tipo: {
      fontSize: 13,
      color: c.primary[70],
      fontWeight: '500',
    },
    data: {
      fontSize: 13,
      color: c.neutral[60],
    },
    erroText: {
      fontSize: 14,
      color: c.error[40],
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 15,
      color: c.neutral[60],
      textAlign: 'center',
    },
  })
}
