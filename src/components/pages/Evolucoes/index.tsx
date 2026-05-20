import { useState } from 'react'
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar, UnidadeRequired } from '../../organisms'
import { HtmlViewerModal } from '../../molecules'
import { useEvolucoesPendentes } from '../../../hooks/useEvolucoesPendentes'
import { theme } from '../../../theme'
import type { EvolucaoPendente, EvolucaoStatusType } from '../../../types/evolucaoPendente'

const STATUS_LABELS: Record<EvolucaoStatusType, string> = {
  realizada: 'Realizada',
  pendente: 'Pendente',
  cancelada: 'Cancelada',
}

const STATUS_COLORS: Record<EvolucaoStatusType, string> = {
  realizada: theme.colors.success?.[60] ?? '#4CAF50',
  pendente: theme.colors.warning?.[60] ?? '#FF9800',
  cancelada: theme.colors.error?.[40] ?? '#F44336',
}

export function EvolucoesPendentesPage() {
  const router = useRouter()
  const { evolucoes, loading, erro, statusDisponiveis, statusSelecionado, setStatusFiltro } =
    useEvolucoesPendentes()
  const [selecionada, setSelecionada] = useState<EvolucaoPendente | null>(null)

  function formatId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`
  }

  function handleCardPress(evolucao: EvolucaoPendente) {
    setSelecionada(evolucao)
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="Evoluções" showBack onBack={() => router.back()} showProfile={false} />

      <UnidadeRequired contextMessage="Selecione a unidade na home para visualizar as evoluções.">
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
          <>
            {statusDisponiveis.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContainer}
              >
                <Pressable
                  style={[
                    styles.filterChip,
                    statusSelecionado === null && styles.filterChipActive,
                  ]}
                  onPress={() => setStatusFiltro(null)}
                >
                  <Ionicons
                    name={statusSelecionado === null ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={statusSelecionado === null ? theme.colors.primary[70] : theme.colors.neutral[50]}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      statusSelecionado === null && styles.filterChipTextActive,
                    ]}
                  >
                    Todas
                  </Text>
                </Pressable>

                {statusDisponiveis.map((status) => (
                  <Pressable
                    key={status}
                    style={[
                      styles.filterChip,
                      statusSelecionado === status && styles.filterChipActive,
                    ]}
                    onPress={() => setStatusFiltro(status)}
                  >
                    <Ionicons
                      name={statusSelecionado === status ? 'checkmark-circle' : 'ellipse-outline'}
                      size={16}
                      color={statusSelecionado === status ? STATUS_COLORS[status] : theme.colors.neutral[50]}
                    />
                    <Text
                      style={[
                        styles.filterChipText,
                        statusSelecionado === status && styles.filterChipTextActive,
                      ]}
                    >
                      {STATUS_LABELS[status]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            <FlatList
              data={evolucoes}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.list}
              ListHeaderComponent={
                evolucoes.length > 0 ? (
                  <Text style={styles.count}>
                    {evolucoes.length} {evolucoes.length === 1 ? 'evolução' : 'evoluções'}
                  </Text>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.center}>
                  <Ionicons
                    name="document-text-outline"
                    size={48}
                    color={theme.colors.neutral[40]}
                  />
                  <Text style={styles.emptyText}>Nenhuma evolução encontrada</Text>
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
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: STATUS_COLORS[item.status] },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{STATUS_LABELS[item.status]}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[40]} />
                </Pressable>
              )}
            />
          </>
        )}

        <HtmlViewerModal
          visible={!!selecionada}
          onClose={() => setSelecionada(null)}
          title={selecionada ? `Evolução ${formatId(selecionada.id)}` : ''}
          subtitle={
            selecionada
              ? `${selecionada.dataform}${selecionada.hora ? ` · ${selecionada.hora}` : ''}`
              : undefined
          }
          html={selecionada?.evolucao ?? null}
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[0],
    borderWidth: 1,
    borderColor: theme.colors.neutral[20],
  },
  filterChipActive: {
    borderColor: theme.colors.primary[70],
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.neutral[50],
  },
  filterChipTextActive: {
    color: theme.colors.primary[70],
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.neutral[0],
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
