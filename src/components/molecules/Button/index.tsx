import { useMemo } from 'react'
import { Pressable, Text } from 'react-native'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
  disabled?: boolean
}

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

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
