import { StyleSheet } from 'react-native';
import type { colors } from '../../../theme/colors';
import type { darkColors } from '../../../theme/dark';

type Colors = typeof colors | typeof darkColors;

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.neutral[0],
      borderRadius: 12,
      padding: 12,
      gap: 12,
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    containerInativo: {
      backgroundColor: c.neutral[10],
      borderColor: c.neutral[30],
    },

    // Avatar
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.primary[20],
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarInativo: {
      backgroundColor: c.neutral[20],
    },
    avatarInitial: {
      fontSize: 18,
      fontWeight: '700',
      color: c.primary[80],
    },
    avatarInitialInativo: {
      color: c.neutral[50],
    },

    // Info
    info: {
      flex: 1,
      minWidth: 0,
    },
    nomeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    nome: {
      fontSize: 15,
      fontWeight: '600',
      color: c.neutral[90],
      flexShrink: 1,
    },
    meta: {
      fontSize: 13,
      color: c.neutral[80],
      marginTop: 2,
      fontVariant: ['tabular-nums'],
    },
    responsavel: {
      fontSize: 13,
      color: c.neutral[80],
      fontWeight: '500',
      marginTop: 2,
    },

    // Badge inativo
    badgeInativo: {
      backgroundColor: c.neutral[30],
      borderRadius: 4,
      paddingHorizontal: 5,
      paddingVertical: 1,
    },
    badgeInativoText: {
      fontSize: 10,
      fontWeight: '600',
      color: c.neutral[60],
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },

    // Botões de ação
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flexShrink: 0,
    },
    actionBtn: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
  });
