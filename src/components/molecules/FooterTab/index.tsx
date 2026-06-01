import { Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { Icon } from '../../atoms'
import { useTheme } from '../../../theme'

type FooterTabProps = {
  icon: ComponentProps<typeof Ionicons>['name']
  label: string
  isActive: boolean
  onPress: () => void
}

export function FooterTab({ icon, label, isActive, onPress }: FooterTabProps) {
  const { colors } = useTheme()
  const color = isActive ? colors.primary[80] : colors.neutral[50]

  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 3 }}
    >
      <Icon name={icon} size={22} color={color} />
      <Text style={{ fontSize: 10, fontWeight: isActive ? '600' : '400', color, letterSpacing: 0.1 }}>
        {label}
      </Text>
    </Pressable>
  )
}
