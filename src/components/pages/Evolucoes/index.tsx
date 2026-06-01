import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEvolucoesPendentes } from '../../../hooks/useEvolucoesPendentes';
import { useTheme } from '../../../theme';
import type { colors as lightColors } from '../../../theme/colors';
import type { darkColors } from '../../../theme/dark';
import type { EvolucaoPendente, EvolucaoStatusType } from '../../../types/evolucaoPendente';
import { HeaderBar, UnidadeRequired } from '../../organisms';

type Colors = typeof lightColors | typeof darkColors;

const STATUS_LABELS: Record<EvolucaoStatusType, string> = {
  realizada: 'Realizada',
  pendente: 'Pendente',
  cancelada: 'Cancelada',
};

export function EvolucoesPendentesPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { evolucoes, loading, erro, statusDisponiveis, statusSelecionado, setStatusFiltro } =
    useEvolucoesPendentes();

  const STATUS_COLORS: Record<EvolucaoStatusType, string> = {
    realizada: colors.success[60],
    pendente: colors.warning[60],
    cancelada: colors.error[40],
  };

  function handleCardPress(evolucao: EvolucaoPendente) {
    if (!evolucao.pacienteid) return;
    router.push({
      pathname: '/prontuario/[id]/evolucao/[evolucao_id]',
      params: { id: evolucao.pacienteid, evolucao_id: evolucao.id },
    } as never);
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="Evoluções" showBack onBack={() => router.back()} showProfile={false} />

      <UnidadeRequired contextMessage="Selecione a unidade na home para visualizar as evoluções.">
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
          <View style={styles.content}>
            {statusDisponiveis.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScrollView}
                contentContainerStyle={styles.filterContainer}
              >
                <Pressable
                  style={[styles.filterChip, statusSelecionado === null && styles.filterChipActive]}
                  onPress={() => setStatusFiltro(null)}
                >
                  <Ionicons
                    name={statusSelecionado === null ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={statusSelecionado === null ? colors.primary[70] : colors.neutral[50]}
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
                      color={
                        statusSelecionado === status ? STATUS_COLORS[status] : colors.neutral[50]
                      }
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
                  <Ionicons name="document-text-outline" size={48} color={colors.neutral[40]} />
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
                    style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}
                  >
                    <Text style={styles.statusBadgeText}>{STATUS_LABELS[item.status]}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.neutral[40]} />
                </Pressable>
              )}
            />
          </View>
        )}
      </UnidadeRequired>
    </View>
  );
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
    content: {
      flex: 1,
    },
    filterScrollView: {
      height: 58,
      flexShrink: 0,
      flexGrow: 0,
    },
    filterContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      alignItems: 'center' as const,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: c.neutral[0],
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    filterChipActive: {
      borderColor: c.primary[70],
    },
    filterChipText: {
      fontSize: 13,
      fontWeight: '500',
      color: c.neutral[50],
    },
    filterChipTextActive: {
      color: c.primary[70],
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
    profissional: {
      fontSize: 12,
      color: c.neutral[50],
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: c.neutral[0],
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
  });
}
