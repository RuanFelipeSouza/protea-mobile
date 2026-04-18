import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { InputField } from '../../molecules/InputField'
import { Button } from '../../molecules/Button'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'

type LoginFormProps = {
  onLogin: (usuario: string, senha: string) => Promise<void>
  onForgotPassword?: () => void
  onParentArea?: () => void
}

export function LoginForm({ onLogin, onForgotPassword, onParentArea }: LoginFormProps) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!usuario.trim() || !senha.trim()) return
    setLoading(true)
    try {
      await onLogin(usuario.trim(), senha)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>E-mail</Text>
        <InputField
          iconName="mail-outline"
          value={usuario}
          onChangeText={setUsuario}
          placeholder="•••••"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <InputField
          iconName="lock-closed-outline"
          value={senha}
          onChangeText={setSenha}
          placeholder="••••••"
          secureTextEntry={!showPassword}
          rightElement={
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.neutral[50]}
              />
            </Pressable>
          }
        />
      </View>

      <Pressable onPress={onForgotPassword} style={styles.forgotPassword} hitSlop={8}>
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </Pressable>

      <View style={styles.buttons}>
        <Button label={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
        <Button label="Área dos Pais" onPress={onParentArea ?? (() => {})} variant="ghost" />
      </View>
    </View>
  )
}
