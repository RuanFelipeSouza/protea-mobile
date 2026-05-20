import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Pressable, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import { HeaderBar } from '../../organisms'
import { useEvolucaoDetalhes } from '../../../hooks/useEvolucaoDetalhes'
import { useAssinaturaCertificada } from '../../../hooks/useAssinaturaCertificada'
import { SenhaDialog } from '../../molecules/SenhaDialog'
import { isAssinado } from '../../../types/mobile'
import { theme } from '../../../theme'

type Props = {
  evolucaoId: number
  onBack?: () => void
}

export function EvolucaoDetalhesPage({ evolucaoId, onBack }: Props) {
  const router = useRouter()
  const { evolucao, loading, erro } = useEvolucaoDetalhes(evolucaoId)
  const { assinar, carregarCertificado, loading: assinandoLoading, erro: erroAssinatura, sucesso, certificadoHabilitado, resetar } = useAssinaturaCertificada()
  const [senhaDialogVisivel, setSenhaDialogVisivel] = useState(false)

  useEffect(() => {
    carregarCertificado()
  }, [])

  useEffect(() => {
    if (sucesso) {
      Alert.alert('Sucesso', 'Documento assinado com sucesso!')
      resetar()
      setSenhaDialogVisivel(false)
    }
  }, [sucesso])

  useEffect(() => {
    if (erroAssinatura) {
      Alert.alert('Erro', erroAssinatura)
    }
  }, [erroAssinatura])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const handleAssinar = () => {
    if (!evolucao || !certificadoHabilitado) {
      Alert.alert('Aviso', 'Certificado digital não está ativado')
      return
    }
    setSenhaDialogVisivel(true)
  }

  const handleConfirmarSenha = async (senha: string) => {
    if (evolucao) {
      await assinar(senha, evolucao)
    }
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Evolução"
        showBack
        onBack={handleBack}
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

      {evolucao && !loading && !erro && (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.headerInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.primary[60]} />
                <Text style={styles.label}>{evolucao.data}</Text>
                {evolucao.hora && <Text style={styles.label}>· {evolucao.hora}</Text>}
              </View>
              <Text style={styles.tipo}>{evolucao.tipo}</Text>

              {isAssinado(evolucao) && (
                <View style={styles.assinadoBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={theme.colors.success[60]} />
                  <Text style={styles.assinadoText}>Assinado</Text>
                </View>
              )}
            </View>

            <View style={styles.pacienteInfo}>
              <Ionicons name="person-outline" size={16} color={theme.colors.neutral[60]} />
              <Text style={styles.pacienteNome}>{evolucao.paciente_nome}</Text>
            </View>

            <View style={styles.conteudoContainer}>
              <Text style={styles.conteudoLabel}>Conteúdo da Evolução</Text>
              <Text style={styles.conteudo}>{evolucao.evolucao}</Text>
            </View>

            {evolucao.pode_assinar && !isAssinado(evolucao) && (
              <View style={styles.assinatureInfo}>
                <Ionicons name="information-circle" size={16} color={theme.colors.secondary[60]} />
                <Text style={styles.assinatureInfoText}>
                  Esta evolução está pendente de assinatura
                </Text>
              </View>
            )}
          </ScrollView>

          {evolucao.pode_assinar && !isAssinado(evolucao) && (
            <View style={styles.footer}>
              <Pressable
                style={[styles.assinarButton, assinandoLoading && styles.assinarButtonDisabled]}
                onPress={handleAssinar}
                disabled={assinandoLoading}
              >
                {assinandoLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="pencil" size={18} color="white" />
                    <Text style={styles.assinarButtonText}>Assinar</Text>
                  </>
                )}
              </Pressable>
            </View>
          )}
        </>
      )}

      <SenhaDialog
        visible={senhaDialogVisivel}
        onClose={() => setSenhaDialogVisivel(false)}
        onSubmit={handleConfirmarSenha}
        loading={assinandoLoading}
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
  },
  content: {
    padding: 16,
    gap: 16,
  },
  headerInfo: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 10,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.neutral[80],
  },
  tipo: {
    fontSize: 15,
    color: theme.colors.primary[70],
    fontWeight: '500',
  },
  pacienteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  pacienteNome: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.neutral[80],
  },
  conteudoContainer: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 10,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },
  conteudoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.neutral[60],
    textTransform: 'uppercase',
  },
  conteudo: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.neutral[80],
  },
  erroText: {
    fontSize: 14,
    color: theme.colors.error[40],
    textAlign: 'center',
  },
  assinadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary[10],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  assinadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary[70],
  },
  assinatureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.secondary[10],
    borderRadius: 10,
    padding: 12,
  },
  assinatureInfoText: {
    fontSize: 13,
    color: theme.colors.secondary[80],
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[20],
  },
  assinarButton: {
    backgroundColor: theme.colors.primary[70],
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  assinarButtonDisabled: {
    backgroundColor: theme.colors.neutral[30],
  },
  assinarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
