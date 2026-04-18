import { View, TextInput } from 'react-native'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Icon name="search-outline" size={18} color={theme.colors.neutral[50]} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral[50]}
      />
    </View>
  )
}
