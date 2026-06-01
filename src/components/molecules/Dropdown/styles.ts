import { StyleSheet } from 'react-native'
import type { darkColors } from '../../../theme/dark'
import type { colors } from '../../../theme/colors'

type Colors = typeof colors | typeof darkColors

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.neutral[0],
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.neutral[30],
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 8,
      minHeight: 44,
    },
    fieldDisabled: {
      backgroundColor: c.neutral[10],
      opacity: 0.6,
    },
    value: {
      flex: 1,
      fontSize: 14,
      color: c.neutral[90],
    },
    placeholder: {
      color: c.neutral[50],
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: c.neutral[0],
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '70%',
      paddingBottom: 12,
    },
    sheetHeader: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    sheetTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: c.neutral[90],
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    optionActive: {
      backgroundColor: c.primary[10],
    },
    optionLabel: {
      fontSize: 15,
      color: c.neutral[90],
      flex: 1,
    },
    optionLabelActive: {
      color: c.primary[80],
      fontWeight: '600',
    },
    separator: {
      height: 1,
      backgroundColor: c.neutral[20],
      marginHorizontal: 20,
    },
    empty: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: c.neutral[60],
    },
  })
