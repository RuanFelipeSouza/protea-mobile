import { StyleSheet } from 'react-native';
import type { darkColors } from '../../../theme/dark';
import type { colors } from '../../../theme/colors';

type Colors = typeof colors | typeof darkColors;

export const makeStyles = (c: Colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.neutral[10] },
    content: { padding: 14, gap: 14, paddingBottom: 24 },
    center: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: 24, backgroundColor: c.neutral[10],
    },
    erroText: { fontSize: 13, color: c.neutral[60], textAlign: 'center' },

    // Card base
    card: {
      backgroundColor: c.neutral[0], borderRadius: 16, borderWidth: 1,
      borderColor: c.neutral[20], padding: 14,
    },

    // Sessão
    paciente: { fontSize: 16, fontWeight: '800', color: c.neutral[90], lineHeight: 20 },
    especialidade: { fontSize: 12.5, color: c.neutral[60], marginTop: 2, marginBottom: 8 },
    sessGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    sessField: {
      width: '50%', flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6,
    },
    sessIcon: {
      width: 30, height: 30, borderRadius: 8, backgroundColor: c.primary[10],
      alignItems: 'center', justifyContent: 'center',
    },
    sessLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3, color: c.neutral[60] },
    sessValue: { fontSize: 13, fontWeight: '600', color: c.neutral[90], marginTop: 1 },

    // Geral
    geralHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    geralTitle: { fontSize: 13, fontWeight: '800', color: c.neutral[90] },
    geralPct: { marginLeft: 'auto', fontSize: 22, fontWeight: '800' },
    barTrack: { height: 8, borderRadius: 8, backgroundColor: c.neutral[20], overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 8 },
    geralSub: { fontSize: 11.5, color: c.neutral[60], marginTop: 8 },

    // Adicionar
    addBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      height: 48, borderRadius: 13, borderWidth: 1.5, borderStyle: 'dashed',
      borderColor: c.primary[20], backgroundColor: c.primary[10],
    },
    addText: { fontSize: 14.5, fontWeight: '800', color: c.primary[90] },

    // Rodapé
    footer: {
      flexDirection: 'row', gap: 10, padding: 12,
      backgroundColor: c.neutral[0], borderTopWidth: 1, borderTopColor: c.neutral[20],
    },
    cancelBtn: {
      flex: 1, height: 48, borderRadius: 13, borderWidth: 1.5, borderColor: c.neutral[30],
      alignItems: 'center', justifyContent: 'center', backgroundColor: c.neutral[0],
    },
    cancelText: { fontSize: 15, fontWeight: '700', color: c.neutral[70] },
    saveBtn: {
      flex: 2, height: 48, borderRadius: 13, flexDirection: 'row', gap: 8,
      alignItems: 'center', justifyContent: 'center', backgroundColor: c.primary[70],
    },
    saveText: { fontSize: 15, fontWeight: '800', color: c.neutral[0] },
  });
