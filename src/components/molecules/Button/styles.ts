import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    base: {
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: c.primary[60],
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryLabel: {
      color: c.neutral[0],
    },
    ghostLabel: {
      color: c.primary[70],
      textDecorationLine: 'underline',
      fontWeight: '400',
    },
  })
