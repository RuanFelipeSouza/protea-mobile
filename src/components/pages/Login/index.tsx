import { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { LoginTemplate } from '../../templates'
import { loginRequest } from '../../../services/loginService'
import { pacienteLoginRequest } from '../../../services/pacienteLoginService'
import { saveToken, saveUsuario, removeToken, removeUsuario } from '../../../services/authService'
import { savePatientToken, savePacienteMeta, removePatientToken, removePacienteMeta } from '../../../services/pacienteAuthService'
import { useAuthStore } from '../../../stores/authStore'
import { usePacienteAuthStore } from '../../../stores/pacienteAuthStore'

type LoginMode = 'prof' | 'paciente'

export function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setPacienteAuth = usePacienteAuthStore((s) => s.setAuth)
  const [mode, setMode] = useState<LoginMode>('prof')

  async function handleLogin(usuario: string, senha: string) {
    if (mode === 'prof') {
      const result = await loginRequest(usuario, senha).catch((e: any) => {
        Alert.alert('Erro', `${e?.response?.data?.mensagem ?? e?.message ?? 'Erro desconhecido'}`)
        throw e
      })
      await saveToken(result.token)
      await saveUsuario(result.user)
      setAuth(result.token, result.user)
      // Garante exclusividade: limpa qualquer sessão paciente ativa
      await removePatientToken()
      await removePacienteMeta()
      usePacienteAuthStore.getState().logout()
    } else {
      const result = await pacienteLoginRequest(usuario, senha).catch((e: any) => {
        Alert.alert('Erro', `${e?.response?.data?.mensagem ?? e?.message ?? 'Erro desconhecido'}`)
        throw e
      })
      await savePatientToken(result.token)
      await savePacienteMeta(result.paciente_id, result.nome)
      setPacienteAuth(result.token, result.paciente_id, result.nome)
      // Garante exclusividade: limpa qualquer sessão profissional ativa
      await removeToken()
      await removeUsuario()
      useAuthStore.getState().logout()
      router.replace('/(paciente)' as never)
    }
  }

  return (
    <LoginTemplate
      mode={mode}
      onLogin={handleLogin}
      onForgotPassword={() =>
        router.push((mode === 'paciente' ? '/paciente-esqueci-senha' : '/esqueci-senha') as never)
      }
      onModeChange={setMode}
      onPrimeiroAcesso={() => router.push('/paciente-criar-senha' as never)}
    />
  )
}
