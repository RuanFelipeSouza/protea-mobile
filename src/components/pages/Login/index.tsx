import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { LoginTemplate } from '../../templates'
import { loginRequest } from '../../../services/loginService'
import { saveToken } from '../../../services/authService'
import { useAuthStore } from '../../../stores/authStore'

export function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  async function handleLogin(usuario: string, senha: string) {
    try {
      const result = await loginRequest(usuario, senha)
      await saveToken(result.token)
      setAuth(result.token, result.user)
    } catch (e: any) {
      console.error('Login error:', JSON.stringify(e?.response?.data ?? e?.message ?? e))
      Alert.alert('Erro', `${e?.response?.data?.mensagem ?? e?.message ?? 'Erro desconhecido'}`)
    }
  }

  return (
    <LoginTemplate
      onLogin={handleLogin}
      onForgotPassword={() => Alert.alert('Em breve', 'Recuperação de senha em breve.')}
      onParentArea={() => Alert.alert('Em breve', 'Área dos pais em breve.')}
    />
  )
}
