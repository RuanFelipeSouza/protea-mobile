import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.neutral[80],
    textAlign: 'center',
    marginTop: 8,
  },
  message: {
    fontSize: 14,
    color: theme.colors.neutral[60],
    textAlign: 'center',
    lineHeight: 20,
  },
  action: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primary[60],
  },
  actionLabel: {
    color: theme.colors.neutral[0],
    fontSize: 14,
    fontWeight: '600',
  },
})
