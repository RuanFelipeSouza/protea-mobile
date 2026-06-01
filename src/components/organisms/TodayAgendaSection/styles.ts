import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    section: {
      flexDirection: 'column',
      gap: 10,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.primary[80],
    },
    headerCount: {
      fontSize: 12,
      color: c.neutral[60],
    },
    list: {
      gap: 8,
    },
    footer: {
      alignSelf: 'flex-end',
      marginTop: 2,
    },
    footerLink: {
      fontSize: 13,
      fontWeight: '600',
      color: c.primary[70],
    },

    // Empty state
    emptyCard: {
      backgroundColor: c.neutral[0],
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    emptyIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.primary[10],
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTextWrap: {
      flex: 1,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: c.neutral[90],
    },
    emptySubtitle: {
      fontSize: 12,
      color: c.neutral[60],
      marginTop: 2,
    },

    // Loading / erro
    loadingCard: {
      backgroundColor: c.neutral[0],
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
    },
    errorCard: {
      backgroundColor: c.neutral[0],
      borderRadius: 12,
      padding: 16,
    },
    errorText: {
      fontSize: 13,
      color: c.error[40],
    },
  })
