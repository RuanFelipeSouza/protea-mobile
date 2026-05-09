import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.neutral[20],
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.neutral[60],
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownWrapper: {
    flex: 1,
  },
  hint: {
    fontSize: 13,
    color: theme.colors.warning[60],
    fontWeight: '500',
    flexShrink: 1,
  },
  erro: {
    fontSize: 12,
    color: theme.colors.error[40],
  },
})
