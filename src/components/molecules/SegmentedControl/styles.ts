import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: 1.5,
      borderColor: c.primary[80],
      borderRadius: 8,
      overflow: 'hidden',
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: c.primary[80],
    },
    tabInactive: {
      backgroundColor: c.neutral[0],
    },
    labelActive: {
      color: c.neutral[0],
      fontSize: 14,
      fontWeight: '600',
    },
    labelInactive: {
      color: c.primary[80],
      fontSize: 14,
      fontWeight: '600',
    },
  })
