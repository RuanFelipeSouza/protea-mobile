import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingVertical: 48,
      gap: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: c.neutral[80],
      textAlign: 'center',
      marginTop: 8,
    },
    message: {
      fontSize: 14,
      color: c.neutral[60],
      textAlign: 'center',
      lineHeight: 20,
    },
    action: {
      marginTop: 16,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: c.primary[60],
    },
    actionLabel: {
      color: c.neutral[0],
      fontSize: 14,
      fontWeight: '600',
    },
  })
