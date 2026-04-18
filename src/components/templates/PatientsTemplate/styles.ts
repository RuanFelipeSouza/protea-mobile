import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[10],
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  novoPacienteButton: {
    margin: 16,
    backgroundColor: theme.colors.primary[80],
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  novoPacienteLabel: {
    color: theme.colors.neutral[0],
    fontSize: 15,
    fontWeight: '700',
  },
})
