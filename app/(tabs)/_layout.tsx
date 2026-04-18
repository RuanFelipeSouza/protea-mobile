import { Tabs } from 'expo-router'
import { FooterNavBar } from '../../src/components/organisms'

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FooterNavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="pacientes" />
      <Tabs.Screen name="localizacao" />
      <Tabs.Screen name="mensagens" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  )
}
