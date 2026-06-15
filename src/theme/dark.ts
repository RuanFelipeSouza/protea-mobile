/**
 * Paleta de cores do tema escuro — espelha a estrutura de `colors.ts`.
 *
 * A escala neutra é invertida propositalmente:
 *   neutral[0]  = surface (#1E1E1E)   ←  light: #FFFFFF
 *   neutral[10] = page bg (#121212)   ←  light: #F5F5F5
 *   neutral[90] = texto   (#F5F5F5)   ←  light: #212121
 *
 * Assim, todo componente que usa `colors.neutral[N]` ou `colors.primary[N]`
 * recebe automaticamente o tom dark correto ao trocar para esta paleta.
 */
export const darkColors = {
  primary: {
    10:  '#1B3320', // soft icon bg      (light: #E8F5E9)
    20:  '#1B3320', // icon bg           (light: #C8E6C9)
    30:  '#2D5C35', //                   (light: #A5D6A7)
    40:  '#3D7A44', //                   (light: #81C784)
    50:  '#4E9955', //                   (light: #66BB6A)
    60:  '#5BAE62', //                   (light: #4CAF50)
    70:  '#66BB6A', // primary           (light: #43A047) — levantado p/ contraste
    80:  '#81C784', // primaryStrong     (light: #388E3C)
    90:  '#A5D6A7', //                   (light: #2E7D32)
    100: '#C8E6C9', //                   (light: #1B5E20)
  },
  secondary: {
    10:  '#1A2E1A',
    20:  '#243824',
    30:  '#2E4A2E',
    40:  '#3A5C3A',
    50:  '#4A6E4A',
    60:  '#5A7E5A',
    70:  '#6A8E6A',
    80:  '#7CB37C',
    90:  '#9CCC65',
    100: '#AED581',
  },
  neutral: {
    0:   '#1E1E1E', // surface / cards   (light: #FFFFFF)
    10:  '#121212', // page background   (light: #F5F5F5)
    20:  '#2E2E2E', // border / divider  (light: #EEEEEE)
    30:  '#3D3D3D', //                   (light: #E0E0E0)
    40:  '#4A4A4A', //                   (light: #BDBDBD)
    50:  '#6B6B6B', // textFaint         (light: #9E9E9E)
    60:  '#9E9E9E', // textMuted         (light: #757575)
    70:  '#BDBDBD', //                   (light: #616161)
    80:  '#E0E0E0', //                   (light: #424242)
    90:  '#F5F5F5', // text              (light: #212121)
    100: '#FFFFFF', //                   (light: #000000)
  },
  warning: {
    10: '#3A2A12',
    40: '#FFB74D',
    60: '#FFA726',
  },
  error: {
    10:  '#3B1A1A', // soft bg           (light: #FFEBEE)
    40:  '#EF5350', // danger            (light: #EF5350)
    60:  '#EF5350', // danger (levantado)(light: #E53935)
    100: '#EF9A9A', //                   (light: #D32F2F)
  },
  success: {
    40: '#66BB6A',
    60: '#81C784',
  },
  // Azul de status — usado pelo "Agendado" na agenda.
  info: {
    10: '#15293B', // soft bg            (light: #E3F2FD)
    40: '#64B5F6', //                    (light: #42A5F5)
    60: '#42A5F5', // azul (levantado)   (light: #1E88E5)
  },
} as const
