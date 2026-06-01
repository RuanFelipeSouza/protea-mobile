import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.neutral[0],
      paddingBottom: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    side: {
      width: 36,
    },
    profileSide: {
      width: 36,
      alignItems: 'flex-end',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '500',
      color: c.neutral[60],
      letterSpacing: 0.2,
      lineHeight: 14,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 1,
      maxWidth: '100%',
    },
    unidadeLabel: {
      fontSize: 15,
      fontWeight: '600',
      flexShrink: 1,
    },
    unidadeLabelSelected: {
      color: c.neutral[90],
    },
    unidadeLabelEmpty: {
      color: c.neutral[60],
    },
    /** Usado quando showUnidade={false} — título único, sem eyebrow */
    titleStandalone: {
      fontSize: 17,
      fontWeight: '600',
      color: c.neutral[90],
      letterSpacing: 0.3,
    },
  })
