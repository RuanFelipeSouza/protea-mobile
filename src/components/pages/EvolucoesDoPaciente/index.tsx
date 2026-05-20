import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { HeaderBar } from '../../organisms'
import { HtmlViewerModal } from '../../molecules'
import { useEvolucoesDoPaciente } from '../../../hooks/useEvolucoesDoPaciente'
import { useEvolucaoDetalhes } from '../../../hooks/useEvolucaoDetalhes'
import { theme } from '../../../theme'
import type { EvolucaoStatus, EvolucaoMobile } from '../../../types/mobile'

type Props = {
  unidadeId: number
  pacienteId: number
  nomePaciente?: string
}

const STATUS_LABELS: Record<EvolucaoStatus, string> = {
  realizada: 'Realizada',
  pendente: 'Pendente',
  cancelada: 'Cancelada',
}

const STATUS_COLORS: Record<EvolucaoStatus, string> = {
  realizada: theme.colors.success?.[60] ?? '#4CAF50',
  pendente: theme.colors.warning?.[60] ?? '#FF9800',
  cancelada: theme.colors.error?.[40] ?? '#F44336',
}

export function EvolucoesDoPacientePage({ unidadeId, pacienteId, nomePaciente }: Props) {
  const router = useRouter()
  const [selecionada, setSelecionada] = useState<EvolucaoMobile | null>(null)
  const { evolucoes, loading, erro, statusDisponiveis, statusSelecionado, setStatusFiltro } =
    useEvolucoesDoPaciente(unidadeId, pacienteId)
  const { evolucao: detalhes, loading: carregandoDetalhes } = useEvolucaoDetalhes(
    selecionada?.id ?? 0,
  )

  const handleCardPress = (evolucao: EvolucaoMobile) => {
    setSelecionada(evolucao)
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title={nomePaciente ?? 'Evoluções'}
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
              <Pressable
                style={styles.card}
                onPress={() => handleCardPress(item)}
                android_ripple={{ color: theme.colors.primary[10] }}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.dateRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color={theme.colors.primary[60]}
                    />
                    <Text style={styles.data}>{item.data}</Text>
                    {item.hora && <Text style={styles.hora}>· {item.hora}</Text>}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: STATUS_COLORS[item.status] },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{STATUS_LABELS[item.status]}</Text>
                  </View>
                </View>
                <Text style={styles.tipo}>{item.tipo ?? 'Sem tipo'}</Text>
              </Pressable>
            )}
          />
        </>
      )}

      {carregandoDetalhes && (
        <View style={styles.modalLoading}>
          <ActivityIndicator size="large" color={theme.colors.primary[70]} />
        </View>
      )}

      {selecionada && (
        <>
          {console.log('[DEBUG] selecionada:', selecionada)}
          {console.log('[DEBUG] detalhes:', detalhes)}
        </>
      )}

      <HtmlViewerModal
        visible={!!selecionada && !carregandoDetalhes}
        onClose={() => setSelecionada(null)}
        title={selecionada ? `Evolução #${selecionada.id.toString().padStart(4, '0')}` : ''}
        subtitle={
          selecionada
            ? `${selecionada.data}${selecionada.hora ? ` · ${selecionada.hora}` : ''}`
            : undefined
        }
        html={detalhes?.evolucao ?? null}
      />
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
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  data: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.neutral[80],
  },
  hora: {
    fontSize: 13,
    color: theme.colors.neutral[60],
  },
  tipo: {
    fontSize: 13,
    color: theme.colors.primary[70],
    fontWeight: '500',
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
