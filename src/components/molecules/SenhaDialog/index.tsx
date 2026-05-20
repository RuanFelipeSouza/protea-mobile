import { View, Text, StyleSheet, TextInput, Pressable, Modal, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../../theme'
import { useState } from 'react'

type Props = {
  visible: boolean
  onClose: () => void
  onSubmit: (senha: string) => void
  loading?: boolean
}

export function SenhaDialog({ visible, onClose, onSubmit, loading = false }: Props) {
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const handleSubmit = () => {
    if (senha.trim()) {
      onSubmit(senha)
      setSenha('')
    }
  }

  const handleClose = () => {
    setSenha('')
    setMostrarSenha(false)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirmar Assinatura</Text>
            <Pressable onPress={handleClose} disabled={loading}>
              <Ionicons name="close" size={24} color={theme.colors.neutral[70]} />
            </Pressable>
          </View>

          <Text style={styles.description}>
            Digite sua senha do certificado digital para assinar este documento:
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha do certificado"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
              placeholderTextColor={theme.colors.neutral[50]}
            />
            <Pressable
              onPress={() => setMostrarSenha(!mostrarSenha)}
              disabled={loading}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={mostrarSenha ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.neutral[60]}
              />
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleClose}
              style={[styles.button, styles.cancelButton]}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              style={[styles.button, styles.submitButton, !senha.trim() && styles.submitButtonDisabled]}
              disabled={!senha.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Assinar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  description: {
    fontSize: 14,
    color: theme.colors.neutral[70],
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral[30],
    borderRadius: 8,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: theme.colors.neutral[80],
  },
  eyeIcon: {
    padding: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[30],
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.neutral[70],
  },
  submitButton: {
    backgroundColor: theme.colors.primary[70],
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.neutral[30],
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
})
