import { Stack, usePathname } from 'expo-router'
import { View } from 'react-native'
import { PacienteFooterNavBar } from '../../src/components/organisms/PacienteFooterNavBar'

export default function PacienteLayout() {
  const pathname = usePathname()
  // Esconde footer em sub-páginas (detalhes que têm seu próprio header com back button)
  const showFooter = !pathname.includes('/evolucao/')

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      {showFooter && <PacienteFooterNavBar />}
    </View>
  )
}
