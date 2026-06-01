import { View } from 'react-native'
import { HeaderBar } from '../../src/components/organisms'
import { useTheme } from '../../src/theme'

export default function MensagensScreen() {
  const { colors } = useTheme()
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="Mensagens" />
      <View style={{ flex: 1, backgroundColor: colors.neutral[10] }} />
    </View>
  )
}
