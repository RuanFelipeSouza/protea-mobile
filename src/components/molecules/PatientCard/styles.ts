import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[20],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary[80],
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  idade: {
    fontSize: 13,
    color: theme.colors.neutral[50],
    marginTop: 2,
  },
})
