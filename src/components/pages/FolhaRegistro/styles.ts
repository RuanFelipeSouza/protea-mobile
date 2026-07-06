import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: c.neutral[10],
    },
    content: {
      padding: 14,
      gap: 14,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 24,
      backgroundColor: c.neutral[10],
    },
    erroText: {
      fontSize: 13,
      color: c.neutral[60],
      textAlign: 'center',
    },
    // Card base
    card: {
      backgroundColor: c.neutral[0],
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.neutral[20],
      padding: 14,
    },
    // Sessão
    sessHead: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 12,
    },
    paciente: {
      fontSize: 16,
      fontWeight: '800',
      color: c.neutral[90],
      lineHeight: 20,
    },
    especialidade: {
      fontSize: 12.5,
      color: c.neutral[60],
      marginTop: 2,
    },
    assinadoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: c.primary[10],
      borderRadius: 999,
      paddingHorizontal: 9,
      paddingVertical: 4,
    },
    assinadoText: {
      fontSize: 11,
      fontWeight: '800',
      color: c.success[60],
    },
    fieldGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    field: {
      width: '50%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 6,
    },
    fieldIcon: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: c.primary[10],
      alignItems: 'center',
      justifyContent: 'center',
    },
    fieldLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.3,
      color: c.neutral[60],
    },
    fieldValue: {
      fontSize: 13,
      fontWeight: '600',
      color: c.neutral[90],
      marginTop: 1,
    },
    // Geral
    geralHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    geralTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: c.neutral[90],
    },
    geralRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 10,
    },
    geralPct: {
      fontSize: 26,
      fontWeight: '800',
    },
    geralSub: {
      flex: 1,
      fontSize: 11.5,
      color: c.neutral[60],
    },
    barTrack: {
      height: 8,
      borderRadius: 8,
      backgroundColor: c.neutral[20],
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: 8,
    },
    pillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    pillDot: {
      width: 16,
      height: 16,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillSym: {
      fontSize: 9.5,
      fontWeight: '800',
      color: c.neutral[0],
    },
    pillCount: {
      fontSize: 13,
      fontWeight: '800',
      color: c.neutral[90],
    },
    pillLabel: {
      fontSize: 11.5,
      color: c.neutral[60],
      fontWeight: '600',
    },
    // Lista
    listTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: c.neutral[70],
      marginTop: 2,
    },
  })
