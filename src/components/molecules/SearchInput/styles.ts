import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.neutral[0],
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.neutral[30],
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: c.neutral[90],
      padding: 0,
    },
  })
