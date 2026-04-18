import { Text, Pressable } from 'react-native'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'

type ActionCardProps = {
  icon: ComponentProps<typeof Ionicons>['name']
  label: string
  onPress?: () => void
}

export function ActionCard({ icon, label, onPress }: ActionCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Icon name={icon} size={40} color={theme.colors.neutral[0]} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}
