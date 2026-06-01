import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    message: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: c.neutral[90],
    },
    time: {
      fontSize: 12,
      color: c.neutral[50],
    },
  })
