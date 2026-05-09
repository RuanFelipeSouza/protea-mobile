import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[0],
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  leafTopRight: {
    position: 'absolute',
    top: -40,
    right: -60,
    opacity: 0.25,
    transform: [{ rotate: '-20deg' }],
  },
  leafBottomLeft: {
    position: 'absolute',
    bottom: -20,
    left: -60,
    opacity: 0.2,
    transform: [{ rotate: '160deg' }],
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 8,
  },
  logoText: {
    color: theme.colors.primary[80],
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
  },
})
