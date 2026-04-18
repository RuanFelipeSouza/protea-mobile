import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: theme.colors.neutral[0],
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    color: theme.colors.neutral[0],
    fontSize: 13,
  },
  buttons: {
    gap: 4,
    marginTop: 16,
  },
})
