import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.neutral[0],
      borderRadius: 10,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    hora: {
      fontSize: 14,
      fontWeight: '700',
      color: c.neutral[70],
      width: 44,
    },
    body: {
      flex: 1,
      gap: 2,
    },
    paciente: {
      fontSize: 14,
      fontWeight: '600',
      color: c.neutral[90],
    },
    meta: {
      fontSize: 12,
      color: c.neutral[60],
    },
    profissional: {
      fontSize: 12,
      color: c.neutral[50],
    },
    statusBadge: {
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '600',
    },
  })
