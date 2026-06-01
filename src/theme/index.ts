import { colors } from './colors'
import { darkColors } from './dark'
import { useThemeStore } from '../stores/themeStore'

// ─── Retrocompatibilidade ───────────────────────────────────────────────────
// Mantém `theme.colors.*` funcionando em todas as telas que ainda não
// foram migradas para o hook reativo.
export const theme = { colors }
export type Theme = typeof theme

// ─── Hook de escala (padrão principal) ─────────────────────────────────────
/**
 * Retorna a escala de cores no mesmo formato de `colors.ts` — reativa ao
 * modo escuro. Use onde antes era usado `theme.colors.*`.
 *
 * Exemplo:
 *   const { colors } = useTheme()
 *   <View style={{ backgroundColor: colors.neutral[0] }} />
 */
export function useTheme() {
  const dark = useThemeStore((s) => s.dark)
  return {
    dark,
    colors: dark ? darkColors : colors,
  }
}

// ─── Paleta do paciente (estende semântica) ────────────────────────────────
export interface PacienteTheme extends SemanticPalette {
  primaryInk: string
  warn: string
  warnSoft: string
  info: string
  infoSoft: string
  authBg: string
}

export function usePacienteTheme(): { dark: boolean; colors: PacienteTheme } {
  const { dark, colors: sp } = useSemanticColors()
  return {
    dark,
    colors: {
      ...sp,
      primaryInk: dark ? '#0E2912' : '#FFFFFF',
      warn:      dark ? '#FFA726' : '#FB8C00',
      warnSoft:  dark ? '#3A2A12' : '#FFF3E0',
      info:      dark ? '#42A5F5' : '#1E88E5',
      infoSoft:  dark ? '#15293B' : '#E3F2FD',
      authBg:    dark ? '#101510' : '#F4F7F3',
    },
  }
}

// ─── Paleta semântica achatada (para telas migradas) ───────────────────────
/**
 * Paleta de tokens nomeados derivada da escala.
 * Use em telas que adotaram o padrão `makeStyles(colors: SemanticPalette)`.
 */
export interface SemanticPalette {
  bg: string
  surface: string
  surfaceAlt: string
  border: string
  divider: string
  text: string
  textMuted: string
  textFaint: string
  primary: string
  primarySoft: string
  primaryStrong: string
  danger: string
  dangerSoft: string
  iconBg: string
}

/**
 * Retorna a `SemanticPalette` derivada da escala de cores.
 * Use em telas que usam `makeStyles(colors: SemanticPalette)`.
 */
export function useSemanticColors(): { dark: boolean; colors: SemanticPalette } {
  const { dark, colors: c } = useTheme()
  return {
    dark,
    colors: {
      bg:            c.neutral[10],
      surface:       c.neutral[0],
      surfaceAlt:    dark ? '#242424' : c.neutral[0],
      border:        c.neutral[20],
      divider:       c.neutral[20],
      text:          c.neutral[90],
      textMuted:     c.neutral[60],
      textFaint:     c.neutral[50],
      primary:       c.primary[70],
      primarySoft:   c.primary[10],
      primaryStrong: c.primary[80],
      danger:        c.error[60],
      dangerSoft:    c.error[10],
      iconBg:        c.primary[20],
    },
  }
}
