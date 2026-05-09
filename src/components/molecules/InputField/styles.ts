import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[10],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.neutral[20],
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.neutral[90],
    padding: 0,
  },
})
