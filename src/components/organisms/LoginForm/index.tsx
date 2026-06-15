import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { InputField } from '../../molecules/InputField'
import { Button } from '../../molecules/Button'
import { Icon } from '../../atoms'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type LoginMode = 'prof' | 'paciente'

type LoginFormProps = {
  onLogin: (usuario: string, senha: string) => Promise<void>
  onForgotPassword?: () => void
  onModeChange?: (mode: LoginMode) => void
  onPrimeiroAcesso?: () => void
  mode?: LoginMode
}

export function LoginForm({
  onLogin,
  onForgotPassword,
  onModeChange,
  onPrimeiroAcesso,
  mode = 'prof',
}: LoginFormProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const isPaciente = mode === 'paciente'
  const usuarioLabel = isPaciente ? 'E-mail' : 'Usuário'

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
        <Text style={styles.label}>{usuarioLabel}</Text>
        <InputField
          iconName={isPaciente ? 'mail-outline' : 'person-outline'}
          value={usuario}
          onChangeText={setUsuario}
          placeholder="•••••"
          keyboardType={isPaciente ? 'email-address' : 'default'}
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
                color={colors.neutral[50]}
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

        {mode === 'paciente' && (
          <Pressable onPress={onPrimeiroAcesso} style={styles.primeiroAcessoRow} hitSlop={8}>
            <Text style={styles.primeiroAcessoLabel}>Primeiro acesso?</Text>
            <Text style={styles.primeiroAcessoLink}>Criar minha senha</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}
