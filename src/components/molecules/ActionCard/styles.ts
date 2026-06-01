import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.primary[70],
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
      gap: 10,
    },
    label: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
  })
