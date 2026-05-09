import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.neutral[30],
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    minHeight: 44,
  },
  fieldDisabled: {
    backgroundColor: theme.colors.neutral[10],
    opacity: 0.6,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.neutral[90],
  },
  placeholder: {
    color: theme.colors.neutral[50],
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.neutral[0],
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
    borderBottomColor: theme.colors.neutral[20],
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionActive: {
    backgroundColor: theme.colors.primary[10],
  },
  optionLabel: {
    fontSize: 15,
    color: theme.colors.neutral[90],
    flex: 1,
  },
  optionLabelActive: {
    color: theme.colors.primary[80],
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.neutral[20],
    marginHorizontal: 20,
  },
  empty: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.neutral[60],
  },
})
