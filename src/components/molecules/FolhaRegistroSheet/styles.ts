import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.neutral[0],
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.neutral[20],
      overflow: 'hidden',
    },
    cardOpen: {
      borderColor: c.primary[20],
      shadowColor: c.primary[90],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 3,
    },
    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 13,
      paddingTop: 12,
      paddingBottom: 10,
    },
    ordemChip: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: c.primary[10],
      alignItems: 'center',
      justifyContent: 'center',
    },
    ordemText: {
      fontSize: 13,
      fontWeight: '700',
      color: c.primary[70],
    },
    headerTexts: {
      flex: 1,
      minWidth: 0,
    },
    programa: {
      fontSize: 14,
      fontWeight: '700',
      color: c.neutral[90],
    },
    dominio: {
      fontSize: 11.5,
      color: c.neutral[60],
      marginTop: 1,
    },
    pct: {
      fontSize: 15,
      fontWeight: '800',
      minWidth: 46,
      textAlign: 'right',
    },
    // Progress bar
    barWrap: {
      paddingLeft: 51,
      paddingRight: 13,
      paddingBottom: 12,
    },
    barTrack: {
      height: 6,
      borderRadius: 6,
      backgroundColor: c.neutral[20],
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: 6,
    },
    // Body
    body: {
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: c.neutral[20],
      gap: 14,
    },
    block: {},
    sectionLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    sectionLabelText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: c.neutral[60],
    },
    ajudaValue: {
      fontSize: 13.5,
      fontWeight: '600',
      color: c.neutral[80],
    },
    // Alvo group
    alvoCard: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.neutral[20],
      padding: 11,
      backgroundColor: c.neutral[0],
    },
    alvoHead: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 9,
    },
    alvoTitleWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
    },
    alvoTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: '700',
      color: c.neutral[90],
      lineHeight: 17,
    },
    alvoStats: {
      alignItems: 'flex-end',
    },
    alvoPct: {
      fontSize: 14,
      fontWeight: '800',
    },
    alvoValidas: {
      fontSize: 10.5,
      fontWeight: '600',
      color: c.neutral[50],
      marginTop: 1,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    chip: {
      width: 24,
      height: 24,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipSym: {
      fontSize: 12,
      fontWeight: '800',
      color: c.neutral[0],
    },
    // Observação
    obsBox: {
      backgroundColor: c.neutral[10],
      borderRadius: 10,
      padding: 12,
    },
    obsText: {
      fontSize: 13,
      lineHeight: 19,
      color: c.neutral[80],
    },
  })
