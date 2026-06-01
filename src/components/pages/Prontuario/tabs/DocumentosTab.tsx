import { useMemo, useState } from 'react'
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { HtmlViewerModal } from '../../../molecules'
import { useDocumentos } from '../../../../hooks/useDocumentos'
import { isAssinado } from '../../../../types/documento'
import { useTheme } from '../../../../theme'
import type { darkColors } from '../../../../theme/dark'
import type { colors as lightColors } from '../../../../theme/colors'
import type { DocumentoEvolucao, DocumentoStatus } from '../../../../types/documento'

type Colors = typeof lightColors | typeof darkColors

type DocumentosTabProps = {
  pacienteId: string
}

const FILTROS: { key: DocumentoStatus; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'assinados', label: 'Assinados' },
  { key: 'pendentes', label: 'Pendentes' },
]

export function DocumentosTab({ pacienteId }: DocumentosTabProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { documentos, loading, erro } = useDocumentos(pacienteId)
  const [filtro, setFiltro] = useState<DocumentoStatus>('todos')
  const [selecionado, setSelecionado] = useState<DocumentoEvolucao | null>(null)

  const listaFiltrada = useMemo(() => {
    if (filtro === 'assinados') return documentos.filter(isAssinado)
    if (filtro === 'pendentes') return documentos.filter((d) => !isAssinado(d))
    return documentos
  }, [documentos, filtro])

  const totalAssinados = useMemo(() => documentos.filter(isAssinado).length, [documentos])
  const totalPendentes = useMemo(() => documentos.filter((d) => !isAssinado(d)).length, [documentos])

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

  return (
    <>
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.resumo}>
              <View style={styles.resumoItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success[60]} />
                <Text style={styles.resumoText}>{totalAssinados} assinados</Text>
              </View>
              <View style={styles.resumoItem}>
                <Ionicons name="time-outline" size={16} color={colors.warning[60]} />
                <Text style={styles.resumoText}>{totalPendentes} pendentes</Text>
              </View>
            </View>

            <View style={styles.filtros}>
              {FILTROS.map((f) => (
                <Pressable
                  key={f.key}
                  style={[styles.filtroBtn, filtro === f.key && styles.filtroBtnAtivo]}
                  onPress={() => setFiltro(f.key)}
                >
                  <Text style={[styles.filtroLabel, filtro === f.key && styles.filtroLabelAtivo]}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="folder-open-outline" size={48} color={colors.neutral[30]} />
            <Text style={styles.emptyText}>
              {filtro === 'todos' ? 'Nenhum documento encontrado' : `Nenhum documento ${filtro}`}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const assinado = isAssinado(item)
          return (
            <Pressable style={styles.card} onPress={() => setSelecionado(item)}>
              <View style={styles.cardHeader}>
                <View style={[styles.badge, assinado ? styles.badgeAssinado : styles.badgePendente]}>
                  <Ionicons
                    name={assinado ? 'checkmark-circle' : 'time-outline'}
                    size={12}
                    color={assinado ? colors.success[60] : colors.warning[60]}
                  />
                  <Text style={[styles.badgeText, assinado ? styles.badgeTextAssinado : styles.badgeTextPendente]}>
                    {assinado ? 'Assinado' : 'Pendente'}
                  </Text>
                </View>
                <Text style={styles.cardData}>{item.data}</Text>
              </View>

              <Text style={styles.cardNome} numberOfLines={1}>{item.nome}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.verMais}>Ver documento</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary[70]} />
              </View>
            </Pressable>
          )
        }}
      />

      <HtmlViewerModal
        visible={!!selecionado}
        onClose={() => setSelecionado(null)}
        title={selecionado?.nome ?? 'Documento'}
        subtitle={selecionado?.data}
        html={selecionado?.evolucao_html ?? null}
        emptyMessage="Conteúdo do documento não disponível"
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
      paddingTop: 48,
    },
    erroText: { fontSize: 14, color: c.error[60] },
    emptyText: { fontSize: 14, color: c.neutral[50] },
    list: {
      padding: 16,
      gap: 12,
    },
    header: {
      gap: 12,
      marginBottom: 4,
    },
    resumo: {
      flexDirection: 'row',
      gap: 16,
    },
    resumoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    resumoText: {
      fontSize: 13,
      color: c.neutral[60],
    },
    filtros: {
      flexDirection: 'row',
      gap: 8,
    },
    filtroBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: c.neutral[20],
    },
    filtroBtnAtivo: {
      backgroundColor: c.primary[70],
    },
    filtroLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: c.neutral[60],
    },
    filtroLabelAtivo: {
      color: c.neutral[0],
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
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    badgeAssinado: {
      backgroundColor: c.primary[10],
    },
    badgePendente: {
      backgroundColor: c.warning[10],
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
    },
    badgeTextAssinado: {
      color: c.success[60],
    },
    badgeTextPendente: {
      color: c.warning[60],
    },
    cardData: {
      fontSize: 12,
      color: c.neutral[50],
    },
    cardNome: {
      fontSize: 14,
      fontWeight: '500',
      color: c.neutral[80],
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
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
