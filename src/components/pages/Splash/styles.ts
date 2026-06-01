import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors as lightColors } from '../../../theme/colors'

type Colors = typeof lightColors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.neutral[0],
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    content: {
      alignItems: 'center',
    },
    logo: {
      width: 200,
      height: 80,
    },
    slogan: {
      marginTop: 28,
      textAlign: 'center',
      color: c.primary[90],
      fontSize: 17,
      lineHeight: 26,
      fontWeight: '400',
    },
    sloganBold: {
      fontWeight: '700',
    },
    spinnerWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    logoPlaceholder: {
      backgroundColor: c.primary[10],
      borderRadius: 8,
    },
  })
