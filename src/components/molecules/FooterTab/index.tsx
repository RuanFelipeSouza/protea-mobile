import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'

type FooterTabProps = {
  icon: ComponentProps<typeof Ionicons>['name']
  isActive: boolean
  onPress: () => void
}

export function FooterTab({ icon, isActive, onPress }: FooterTabProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 }}
    >
      <Icon
        name={icon}
        size={26}
        color={isActive ? theme.colors.primary[80] : theme.colors.neutral[50]}
      />
    </Pressable>
  )
}
