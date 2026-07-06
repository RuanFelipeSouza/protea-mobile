import { useEffect, useMemo } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { usePerfilPaciente } from '../../../../hooks/usePerfilPaciente'
import { useProntuarioGarden } from '../../../../hooks/useProntuarioGarden'
import { useTheme, usePacienteTheme, type PacienteTheme } from '../../../../theme'
import { GardenProfileBlock } from '../../../molecules/GardenProfileBlock'
import type { PerfilPaciente } from '../../../../types/perfilPaciente'
import type { GardenStatusPaciente } from '../../../../types/pacienteContextTypes'
import type { darkColors } from '../../../../theme/dark'
import type { colors as lightColors } from '../../../../theme/colors'

type Colors = typeof lightColors | typeof darkColors
type Styles = ReturnType<typeof makeStyles>

type PerfilTabProps = {
  pacienteId: string
}

function titleCase(s: string | null | undefined): string {
  if (!s) return ''
  return s.trim().toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())
}

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

function fmtPhone(s: string | null | undefined): string | null {
  if (!s) return null
  const d = s.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return s
}

function present(v: unknown): boolean {
  if (v == null || typeof v === 'object') return false
  return String(v).trim() !== '' && String(v).trim() !== '-'
}

function toDisplay(v: unknown): string | null {
  return present(v) ? String(v) : null
}

// ── Sub-components (stateless, receive styles from parent) ────

type CellProps = {
  label: string
  value: string | null | undefined
  styles: Styles
  rightBorder?: boolean
  topBorder?: boolean
}

function Cell({ label, value, styles, rightBorder, topBorder }: CellProps) {
  const displayText = toDisplay(value)
  return (
    <View
      style={[
        styles.cell,
        rightBorder && styles.cellRightBorder,
        topBorder && styles.cellTopBorder,
      ]}
    >
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={[styles.cellValue, !displayText && styles.cellValueEmpty]}>
        {displayText ?? '—'}
      </Text>
    </View>
  )
}

type FullCellProps = {
  label: string
  value: string | null | undefined
  styles: Styles
  topBorder?: boolean
}

function FullCell({ label, value, styles, topBorder }: FullCellProps) {
  const displayText = toDisplay(value)
  return (
    <View style={[styles.fullCell, topBorder && styles.cellTopBorder]}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={[styles.cellValue, !displayText && styles.cellValueEmpty]}>
        {displayText ?? '—'}
      </Text>
    </View>
  )
}

function Block({ title, children, styles }: { title: string; children: React.ReactNode; styles: Styles }) {
  return (
    <View>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockContainer}>{children}</View>
    </View>
  )
}

// ── Profile content ───────────────────────────────────────────

function PerfilContent({
  perfil, garden, gardenColors, styles, colors,
}: {
  perfil: PerfilPaciente
  garden: GardenStatusPaciente | null
  gardenColors: PacienteTheme
  styles: Styles
  colors: Colors
}) {
  const nomeExibido = titleCase(perfil.nomesocial || perfil.nome)
  const sexoIcone = perfil.sexo === 'Masculino' ? 'male' : 'female'

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {/* Hero */}
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(perfil.nome)}</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroNome}>{nomeExibido}</Text>
          <View style={styles.heroSub}>
            <Ionicons name={sexoIcone} size={13} color={(colors as typeof lightColors).primary[70]} />
            <Text style={styles.heroSubText}>{perfil.sexo} · {perfil.idade} anos</Text>
          </View>
          {perfil.demanda_judicial && (
            <View style={styles.badgeDemanda}>
              <Text style={styles.badgeDemandaText}>Demanda judicial</Text>
            </View>
          )}
        </View>
      </View>

      {/* Garden */}
      {garden && <GardenProfileBlock data={garden} colors={gardenColors} />}

      {/* Dados pessoais */}
      <Block title="Dados pessoais" styles={styles}>
        <View style={styles.row}>
          <Cell label="Nascimento" value={perfil.datanascimento} styles={styles} rightBorder />
          <Cell label="Idade" value={`${perfil.idade} anos`} styles={styles} />
        </View>
        <View style={styles.row}>
          <Cell label="CPF" value={perfil.cpf} styles={styles} rightBorder topBorder />
          <Cell label="CNS" value={perfil.cns} styles={styles} topBorder />
        </View>
        <FullCell label="CID" value={perfil.cid} styles={styles} topBorder />
      </Block>

      {/* Responsável e contato */}
      <Block title="Responsável e contato" styles={styles}>
        <FullCell
          label="Responsável"
          value={present(perfil.nomeresponsavel) ? titleCase(perfil.nomeresponsavel) : null}
          styles={styles}
        />
        <View style={styles.row}>
          <Cell label="Tel. responsável" value={fmtPhone(perfil.telefone_responsavel)} styles={styles} rightBorder topBorder />
          <Cell label="Tel. paciente" value={fmtPhone(perfil.telefone)} styles={styles} topBorder />
        </View>
      </Block>

      {/* Acompanhamento */}
      <Block title="Acompanhamento" styles={styles}>
        <View style={styles.row}>
          <Cell label="Período ativo" value={toDisplay(perfil.periodo_ativo)} styles={styles} rightBorder />
          <Cell label="Plano de cuidado" value={toDisplay(perfil.plano_cuidado_ativo)} styles={styles} />
        </View>
        <View style={styles.row}>
          <Cell label="Última evolução" value={toDisplay(perfil.ultima_evolucao)} styles={styles} rightBorder topBorder />
          <Cell label="Último agend." value={toDisplay(perfil.ultimo_agendamento)} styles={styles} topBorder />
        </View>
      </Block>
    </ScrollView>
  )
}

// ── Main export ───────────────────────────────────────────────

export function PerfilTab({ pacienteId }: PerfilTabProps) {
  const { colors } = useTheme()
  const { colors: gardenColors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { perfil, loading, erro, carregar } = usePerfilPaciente(pacienteId)
  const { garden } = useProntuarioGarden(pacienteId)

  useEffect(() => {
    carregar()
  }, [carregar])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={(colors as typeof lightColors).primary[70]} />
      </View>
    )
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={40} color={(colors as typeof lightColors).error[60]} />
        <Text style={styles.erroText}>{erro}</Text>
      </View>
    )
  }

  if (!perfil) return null

  return (
    <PerfilContent
      perfil={perfil}
      garden={garden}
      gardenColors={gardenColors}
      styles={styles}
      colors={colors}
    />
  )
}

// ── Styles ────────────────────────────────────────────────────

function makeStyles(c: Colors) {
  return StyleSheet.create({
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    erroText: {
      fontSize: 14,
      color: c.error[60],
    },
    scroll: {
      flex: 1,
      backgroundColor: c.neutral[10],
    },
    scrollContent: {
      padding: 14,
      gap: 16,
    },
    // Hero
    heroCard: {
      backgroundColor: c.neutral[0],
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.primary[20],
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarText: {
      fontSize: 19,
      fontWeight: '700',
      color: c.primary[80],
    },
    heroInfo: {
      flex: 1,
      minWidth: 0,
    },
    heroNome: {
      fontSize: 16,
      fontWeight: '700',
      color: c.neutral[90],
      lineHeight: 20,
    },
    heroSub: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 3,
    },
    heroSubText: {
      fontSize: 12.5,
      color: c.neutral[60],
    },
    badgeDemanda: {
      alignSelf: 'flex-start',
      marginTop: 7,
      backgroundColor: c.warning[10],
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    badgeDemandaText: {
      fontSize: 11,
      fontWeight: '700',
      color: c.warning[60],
    },
    // Block
    blockTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: c.primary[80],
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 4,
      paddingBottom: 6,
    },
    blockContainer: {
      backgroundColor: c.neutral[0],
      borderWidth: 1,
      borderColor: c.neutral[20],
      borderRadius: 14,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
    },
    // Cell
    cell: {
      flex: 1,
      paddingVertical: 11,
      paddingHorizontal: 14,
    },
    fullCell: {
      paddingVertical: 11,
      paddingHorizontal: 14,
    },
    cellRightBorder: {
      borderRightWidth: 1,
      borderRightColor: c.neutral[20],
    },
    cellTopBorder: {
      borderTopWidth: 1,
      borderTopColor: c.neutral[20],
    },
    cellLabel: {
      fontSize: 10.5,
      fontWeight: '700',
      color: c.neutral[50],
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    cellValue: {
      fontSize: 14.5,
      fontWeight: '600',
      color: c.neutral[90],
      marginTop: 3,
    },
    cellValueEmpty: {
      fontWeight: '400',
      color: c.neutral[40],
      fontStyle: 'italic',
    },
  })
}
