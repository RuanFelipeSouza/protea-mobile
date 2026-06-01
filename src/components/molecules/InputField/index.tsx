import { useMemo } from 'react'
import { View, TextInput, type TextInputProps } from 'react-native'
import type { ComponentProps, ReactNode } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Icon } from '../../atoms'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type InputFieldProps = TextInputProps & {
  iconName: ComponentProps<typeof Ionicons>['name']
  rightElement?: ReactNode
}

export function InputField({ iconName, rightElement, ...rest }: InputFieldProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <View style={styles.container}>
      <Icon name={iconName} size={20} color={colors.neutral[50]} />
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.neutral[40]}
        {...rest}
      />
      {rightElement}
    </View>
  )
}
