import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    inputGroup: {
      gap: 6,
    },
    label: {
      color: c.neutral[70],
      fontSize: 14,
      fontWeight: '500',
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: 4,
    },
    forgotPasswordText: {
      color: c.primary[70],
      fontSize: 13,
    },
    buttons: {
      gap: 4,
      marginTop: 16,
    },
    primeiroAcessoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 4,
    },
    primeiroAcessoLabel: {
      fontSize: 13.5,
      color: c.neutral[60],
    },
    primeiroAcessoLink: {
      fontSize: 13.5,
      color: c.primary[70],
      fontWeight: '700',
    },
  })
