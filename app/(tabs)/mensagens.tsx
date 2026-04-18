import { View } from 'react-native'
import { HeaderBar } from '../../src/components/organisms'
import { theme } from '../../src/theme'

export default function MensagensScreen() {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="Mensagens" />
      <View style={{ flex: 1, backgroundColor: theme.colors.neutral[10] }} />
    </View>
  )
}
