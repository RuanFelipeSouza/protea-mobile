import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: c.neutral[10],
    },
    content: {
      padding: 16,
      gap: 16,
    },
  })
