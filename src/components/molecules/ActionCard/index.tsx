import { useMemo } from 'react'
import { Text, Pressable } from 'react-native'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Icon } from '../../atoms'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type ActionCardProps = {
  icon: ComponentProps<typeof Ionicons>['name']
  label: string
  onPress?: () => void
}

export function ActionCard({ icon, label, onPress }: ActionCardProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Icon name={icon} size={40} color="#FFFFFF" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}
