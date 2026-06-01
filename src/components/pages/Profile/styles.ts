import { StyleSheet } from 'react-native'
import type { SemanticPalette } from '../../../theme'

export const makeStyles = (c: SemanticPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    scroll: {
      padding: 16,
      gap: 14,
      paddingBottom: 32,
    },

    // ── Cabeçalho ──────────────────────────────────────────────
    headCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.iconBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 22,
      fontWeight: '700',
      color: c.primaryStrong,
    },
    name: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
    },
    username: {
      fontSize: 13,
      color: c.textMuted,
      marginTop: 2,
    },
    badge: {
      alignSelf: 'flex-start',
      marginTop: 6,
      backgroundColor: c.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: c.primary,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },

    // ── Cards agrupados ────────────────────────────────────────
    groupCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      overflow: 'hidden',
    },

    // ── Linha ──────────────────────────────────────────────────
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 12,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowIconDanger: {
      backgroundColor: c.dangerSoft,
    },
    rowLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: c.text,
    },
    rowLabelDanger: {
      color: c.danger,
    },
    rowSub: {
      fontSize: 12,
      color: c.textMuted,
      marginTop: 2,
    },
  })
