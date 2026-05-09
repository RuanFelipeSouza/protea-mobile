import { Stack } from 'expo-router'
import { View } from 'react-native'
import { FooterNavBar } from '../../src/components/organisms'

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <FooterNavBar />
    </View>
  )
}
