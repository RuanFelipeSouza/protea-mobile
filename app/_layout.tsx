import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { getToken, removeToken } from '../src/services/authService'
import { useAuthStore } from '../src/stores/authStore'
import { useUnidadeStore } from '../src/stores/unidadeStore'

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function bootstrap() {
      const stored = await getToken()
      if (stored) {
        if (isTokenExpired(stored)) {
          await removeToken()
        } else {
          setAuth(stored, null)
        }
      }
      // Recupera a última unidade selecionada do SecureStore
      await useUnidadeStore.getState().hidratar()
      setIsReady(true)
    }
    bootstrap()
  }, [])

  useEffect(() => {
    if (!isReady) return
    const inLogin = segments[0] === 'login'
    if (!token && !inLogin) {
      router.replace('/login' as never)
    } else if (token && inLogin) {
      router.replace('/(tabs)')
    }
  }, [token, segments, isReady])

  return <Stack screenOptions={{ headerShown: false }} />
}
