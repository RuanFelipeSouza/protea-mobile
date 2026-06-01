import { useMemo } from 'react'
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar } from '../../organisms'
import { useMinhasUnidades } from '../../../hooks/useMinhasUnidades'
import { useTheme } from '../../../theme'
import type { darkColors } from '../../../theme/dark'
import type { colors as lightColors } from '../../../theme/colors'
import type { Unidade } from '../../../types/unidade'

type Colors = typeof lightColors | typeof darkColors

export function MinhasUnidadesPage() {
  const router = useRouter()
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
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
              <Ionicons name="business-outline" size={48} color={colors.neutral[40]} />
              <Text style={styles.emptyText}>Nenhuma unidade cadastrada</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handlePress(item)}>
              <View style={styles.cardLeft}>
                <Ionicons name="business" size={20} color={colors.primary[60]} />
              </View>
              <Text style={styles.nome} numberOfLines={2}>{item.unidade}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[40]} />
            </Pressable>
          )}
        />
      )}
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
      color: c.neutral[90],
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
