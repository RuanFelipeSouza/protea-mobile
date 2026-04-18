import { View } from 'react-native'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { ActionCard } from '../../molecules'
import { styles } from './styles'

type ActionItem = {
  icon: ComponentProps<typeof Ionicons>['name']
  label: string
  onPress?: () => void
}

type ActionGridProps = {
  items: ActionItem[]
}

export function ActionGrid({ items }: ActionGridProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.label} style={styles.cardWrapper}>
          <ActionCard icon={item.icon} label={item.label} onPress={item.onPress} />
        </View>
      ))}
    </View>
  )
}
