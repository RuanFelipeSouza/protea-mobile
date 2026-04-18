import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.neutral[10],
  },
  content: {
    padding: 16,
    gap: 16,
  },
})
