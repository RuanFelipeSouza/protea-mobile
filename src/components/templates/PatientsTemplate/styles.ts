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
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[0],
    borderWidth: 1,
    borderColor: theme.colors.neutral[20],
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.neutral[50],
  },
  filterChipTextActive: {
    color: theme.colors.success[60],
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
