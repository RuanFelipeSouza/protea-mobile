import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    scrim: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: c.neutral[0],
      borderRadius: 20,
      padding: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.28,
      shadowRadius: 40,
      elevation: 24,
    },
    // Month nav
    monthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    monthBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.neutral[10],
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: c.neutral[90],
    },
    // Week
    weekRow: {
      flexDirection: 'row',
    },
    weekday: {
      flex: 1,
      textAlign: 'center',
      fontSize: 11,
      fontWeight: '700',
      color: c.neutral[50],
      paddingVertical: 4,
    },
    // Day cell
    cell: {
      flex: 1,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    },
    day: {
      width: '100%',
      height: '100%',
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    daySelected: {
      backgroundColor: c.primary[70],
    },
    dayToday: {
      borderWidth: 1.5,
      borderColor: c.primary[60],
    },
    dayText: {
      fontSize: 14,
      fontWeight: '500',
      color: c.neutral[80],
    },
    dayTextSelected: {
      color: c.neutral[0],
      fontWeight: '700',
    },
    dayTextToday: {
      color: c.primary[70],
      fontWeight: '700',
    },
    // Footer
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: c.neutral[20],
    },
    closeBtn: {
      fontSize: 14,
      fontWeight: '600',
      color: c.neutral[60],
    },
  })
