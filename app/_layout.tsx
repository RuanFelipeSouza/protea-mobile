import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { getToken } from '../src/services/authService'
import { useAuthStore } from '../src/stores/authStore'

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
        setAuth(stored, null)
      }
      setIsReady(true)
    }
    bootstrap()
  }, [])

  useEffect(() => {
    if (!isReady) return
    const inTabs = segments[0] === '(tabs)'
    if (!token && inTabs) {
      router.replace('/login' as never)
    } else if (token && !inTabs) {
      router.replace('/(tabs)')
    }
  }, [token, segments, isReady])

  return <Stack screenOptions={{ headerShown: false }} />
}
