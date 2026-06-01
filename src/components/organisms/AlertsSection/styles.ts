import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.neutral[0],
      borderRadius: 12,
      padding: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: c.primary[80],
      marginBottom: 4,
    },
    verTodos: {
      alignSelf: 'flex-end',
      marginTop: 12,
      fontSize: 14,
      fontWeight: '600',
      color: c.primary[70],
    },
  })
