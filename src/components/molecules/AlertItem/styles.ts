import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[20],
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  time: {
    fontSize: 12,
    color: theme.colors.neutral[50],
  },
})
