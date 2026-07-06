import { StyleSheet } from 'react-native';
import type { darkColors } from '../../../theme/dark';
import type { colors } from '../../../theme/colors';

type Colors = typeof colors | typeof darkColors;

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
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 11,
    },
    ordemChip: {
      width: 28, height: 28, borderRadius: 8,
      backgroundColor: c.neutral[10],
      alignItems: 'center', justifyContent: 'center',
    },
    ordemChipOn: { backgroundColor: c.primary[10] },
    ordemText: { fontSize: 13, fontWeight: '800', color: c.neutral[50] },
    ordemTextOn: { color: c.primary[70] },
    headerTexts: { flex: 1, minWidth: 0 },
    programa: { fontSize: 14, fontWeight: '700', color: c.neutral[90] },
    programaEmpty: { color: c.neutral[50] },
    dominio: { fontSize: 11.5, color: c.neutral[60], marginTop: 1 },
    pct: { fontSize: 15, fontWeight: '800' },
    trash: { padding: 4 },
    // Progress
    barWrap: { paddingLeft: 50, paddingRight: 12, paddingBottom: 11 },
    barTrack: { height: 6, borderRadius: 6, backgroundColor: c.neutral[20], overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 6 },
    // Body
    body: {
      paddingHorizontal: 13, paddingTop: 13, paddingBottom: 16,
      borderTopWidth: 1, borderTopColor: c.neutral[20], gap: 16,
    },
    // Field (dropdown)
    field: {},
    fieldHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    fieldLabel: { fontSize: 12.5, fontWeight: '700', color: c.neutral[70] },
    req: { fontSize: 14, color: c.error[60], lineHeight: 14 },
    // Section label
    sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 9 },
    sectionLabelText: {
      fontSize: 11, fontWeight: '800', letterSpacing: 0.5,
      textTransform: 'uppercase', color: c.neutral[60],
    },
    sectionLabelRight: { marginLeft: 'auto', fontSize: 11, fontWeight: '700', color: c.neutral[50] },
    // Hint
    hintBox: { backgroundColor: c.neutral[10], borderRadius: 12, padding: 14 },
    hintText: { fontSize: 13, color: c.neutral[50], fontWeight: '600' },
    // Alvos
    alvoMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
    alvoMetaText: { fontSize: 12, color: c.neutral[60], fontWeight: '600' },
    alvoBadge: {
      marginLeft: 'auto', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3,
      backgroundColor: c.primary[10],
    },
    alvoBadgeOk: { backgroundColor: c.primary[10] },
    alvoBadgeText: { fontSize: 11, fontWeight: '800', color: c.primary[90] },
    alvoBadgeTextOk: { color: c.success[60] },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    alvoChip: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: 13, paddingVertical: 9, borderRadius: 999,
      borderWidth: 1.5, borderColor: c.neutral[30], backgroundColor: c.neutral[0],
    },
    alvoChipOn: { borderColor: c.primary[70], backgroundColor: c.primary[70] },
    alvoChipDisabled: { opacity: 0.5 },
    alvoChipText: { fontSize: 13, fontWeight: '700', color: c.neutral[80] },
    alvoChipTextOn: { color: c.neutral[0] },
    // Bulk
    bulkRow: { flexDirection: 'row', gap: 8, marginBottom: 11 },
    bulkBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 9, borderRadius: 10, borderWidth: 1,
    },
    bulkOk: { borderColor: c.primary[20], backgroundColor: c.primary[10] },
    bulkClear: { borderColor: c.neutral[20], backgroundColor: c.neutral[10] },
    bulkText: { fontSize: 12.5, fontWeight: '700' },
    // Tentativa row
    row: { borderWidth: 1, borderColor: c.neutral[20], borderRadius: 13, padding: 10 },
    rowTop: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 },
    rowNum: {
      width: 26, height: 26, borderRadius: 8, backgroundColor: c.neutral[10],
      alignItems: 'center', justifyContent: 'center',
    },
    rowNumText: { fontSize: 12.5, fontWeight: '800', color: c.neutral[60] },
    alvoPill: {
      flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5, minWidth: 0,
      alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999,
      borderWidth: 1, borderColor: c.neutral[30], backgroundColor: c.neutral[0],
    },
    alvoPillOn: { borderColor: c.primary[20], backgroundColor: c.primary[10] },
    alvoPillText: { flex: 1, fontSize: 11.5, fontWeight: '700', color: c.neutral[50] },
    alvoPillTextOn: { color: c.primary[90] },
    resultRow: { flexDirection: 'row', gap: 6 },
    resultBtn: {
      flex: 1, height: 46, borderRadius: 11, borderWidth: 1.5,
      alignItems: 'center', justifyContent: 'center',
    },
    resultSym: { fontSize: 19, fontWeight: '800' },
    // Observação
    obsInput: {
      minHeight: 76, borderWidth: 1.5, borderColor: c.neutral[20], borderRadius: 12,
      paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: c.neutral[90],
      textAlignVertical: 'top', backgroundColor: c.neutral[0],
    },
    obsCount: { textAlign: 'right', fontSize: 11, color: c.neutral[50], fontWeight: '600', marginTop: 4 },
  });
