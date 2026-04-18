import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary[80],
    marginBottom: 4,
  },
  verTodos: {
    alignSelf: 'flex-end',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary[70],
  },
})
