import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.neutral[0],
      borderRadius: 12,
      padding: 14,
      gap: 8,
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: c.neutral[60],
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    dropdownWrapper: {
      flex: 1,
    },
    hint: {
      fontSize: 13,
      color: c.warning[60],
      fontWeight: '500',
      flexShrink: 1,
    },
    erro: {
      fontSize: 12,
      color: c.error[40],
    },
  })
