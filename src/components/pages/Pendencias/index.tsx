import { useState } from 'react'
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar, UnidadeRequired } from '../../organisms'
import { HtmlViewerModal } from '../../molecules'
import { usePendencias } from '../../../hooks/usePendencias'
import { useEvolucaoDetalhes } from '../../../hooks/useEvolucaoDetalhes'
import { theme } from '../../../theme'
import type { Pendencia } from '../../../types/evolucaoPendente'

export function PendenciasPage() {
  const router = useRouter()
  const { pendencias, loading, erro } = usePendencias()
  const [selecionada, setSelecionada] = useState<Pendencia | null>(null)
  const { evolucao: detalhes, loading: carregandoDetalhes } = useEvolucaoDetalhes(
    selecionada?.id ?? 0,
  )

  function formatId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`
  }

  function handleCardPress(pendencia: Pendencia) {
    setSelecionada(pendencia)
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
                  color={theme.colors.neutral[40]}
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
                <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[40]} />
              </Pressable>
            )}
          />
        )}

        {carregandoDetalhes && (
          <View style={styles.modalLoading}>
            <ActivityIndicator size="large" color={theme.colors.primary[70]} />
          </View>
        )}

        <HtmlViewerModal
          visible={!!selecionada && !carregandoDetalhes}
          onClose={() => setSelecionada(null)}
          title={selecionada ? `Pendência ${formatId(selecionada.id)}` : ''}
          subtitle={
            selecionada
              ? `${selecionada.data}${selecionada.hora ? ` · ${selecionada.hora}` : ''}`
              : undefined
          }
          html={detalhes?.evolucao ?? null}
        />
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
  modalLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
})
