import { StyleSheet } from 'react-native'
import { theme } from '../../../theme'

export const styles = StyleSheet.create({
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
    color: theme.colors.primary[80],
  },
  headerCount: {
    fontSize: 12,
    color: theme.colors.neutral[60],
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
    color: theme.colors.primary[70],
  },

  // Empty state
  emptyCard: {
    backgroundColor: theme.colors.neutral[0],
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
    backgroundColor: theme.colors.primary[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextWrap: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.neutral[90],
  },
  emptySubtitle: {
    fontSize: 12,
    color: theme.colors.neutral[60],
    marginTop: 2,
  },

  // Loading / erro
  loadingCard: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  errorCard: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 16,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.error[40],
  },
})
