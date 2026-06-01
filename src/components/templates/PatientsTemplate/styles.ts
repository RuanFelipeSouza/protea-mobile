import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.neutral[10],
    },
    content: {
      flex: 1,
      padding: 16,
      gap: 12,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: c.neutral[0],
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    filterChipText: {
      fontSize: 13,
      fontWeight: '500',
      color: c.neutral[50],
    },
    filterChipTextActive: {
      color: c.success[60],
    },
    novoPacienteButton: {
      margin: 16,
      backgroundColor: c.primary[80],
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
    },
    novoPacienteLabel: {
      color: c.neutral[0],
      fontSize: 15,
      fontWeight: '700',
    },
  })
