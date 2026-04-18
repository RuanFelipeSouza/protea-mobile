import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: theme.colors.primary[80],
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.primary[80],
  },
  tabInactive: {
    backgroundColor: theme.colors.neutral[0],
  },
  labelActive: {
    color: theme.colors.neutral[0],
    fontSize: 14,
    fontWeight: '600',
  },
  labelInactive: {
    color: theme.colors.primary[80],
    fontSize: 14,
    fontWeight: '600',
  },
})
