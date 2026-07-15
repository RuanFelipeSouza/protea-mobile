import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.neutral[0],
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
    logoImage: {
      width: '100%',
      maxWidth: 320,
      height: 82,
    },
    chipRow: {
      alignItems: 'center',
      marginBottom: 10,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.4,
    },
    modeLink: {
      alignItems: 'center',
      paddingVertical: 12,
      marginTop: 8,
    },
    modeLinkText: {
      fontSize: 14.5,
      fontWeight: '600',
      textDecorationLine: 'underline',
      textDecorationStyle: 'solid',
    },
  })
