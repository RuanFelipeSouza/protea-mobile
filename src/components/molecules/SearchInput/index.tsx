import { useMemo } from 'react'
import { View, TextInput } from 'react-native'
import { Icon } from '../../atoms'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <View style={styles.container}>
      <Icon name="search-outline" size={18} color={colors.neutral[50]} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[50]}
      />
    </View>
  )
}
