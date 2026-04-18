import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary[80],
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 36,
  },
  profileSide: {
    width: 36,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.neutral[0],
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})
