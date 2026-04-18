import { Pressable, Text } from 'react-native'
import { styles } from './styles'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
  disabled?: boolean
}

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <Pressable
      style={[styles.base, variant === 'primary' ? styles.primary : styles.ghost]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.label, variant === 'primary' ? styles.primaryLabel : styles.ghostLabel]}>
        {label}
      </Text>
    </Pressable>
  )
}
