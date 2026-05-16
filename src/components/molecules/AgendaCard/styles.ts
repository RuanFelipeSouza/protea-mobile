import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  hora: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.neutral[70],
    width: 44,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  paciente: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  meta: {
    fontSize: 12,
    color: theme.colors.neutral[60],
  },
  profissional: {
    fontSize: 12,
    color: theme.colors.neutral[50],
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
})
