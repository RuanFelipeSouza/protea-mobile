import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheet: {
      backgroundColor: c.neutral[0],
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      maxHeight: '88%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 16,
    },
    grabber: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.neutral[30],
      marginTop: 10,
    },
    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 16,
    },
    headerText: {
      flex: 1,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
      color: c.neutral[50],
    },
    nome: {
      fontSize: 20,
      fontWeight: '700',
      color: c.neutral[90],
      marginTop: 4,
      lineHeight: 24,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginTop: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
    },
    closeBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.neutral[10],
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Body
    body: {
      flexGrow: 0,
    },
    bodyContent: {
      paddingHorizontal: 20,
      paddingBottom: 4,
    },
    hero: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: c.primary[10],
      borderRadius: 14,
      padding: 14,
      marginBottom: 6,
    },
    heroIcon: {
      width: 42,
      height: 42,
      borderRadius: 11,
      backgroundColor: c.neutral[0],
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroData: {
      fontSize: 13,
      fontWeight: '600',
      color: c.primary[90],
    },
    heroHora: {
      fontSize: 22,
      fontWeight: '700',
      color: c.primary[100],
      lineHeight: 26,
    },
    subBadge: {
      alignSelf: 'flex-start',
      backgroundColor: c.warning[10],
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    subBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: c.warning[60],
    },
    note: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingTop: 8,
      paddingBottom: 2,
      paddingHorizontal: 2,
    },
    noteText: {
      fontSize: 12,
      color: c.neutral[60],
    },
    // Detail rows
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowIcon: {
      width: 34,
      height: 34,
      borderRadius: 9,
      backgroundColor: c.primary[10],
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: c.neutral[60],
    },
    rowValue: {
      fontSize: 14,
      fontWeight: '600',
      color: c.neutral[90],
      marginTop: 1,
    },
    // Footer
    footer: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: c.neutral[20],
    },
    cta: {
      height: 50,
      borderRadius: 12,
      backgroundColor: c.primary[70],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    ctaPressed: {
      backgroundColor: c.primary[80],
    },
    ctaText: {
      fontSize: 15,
      fontWeight: '700',
      color: c.neutral[0],
    },
  })
