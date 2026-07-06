import { useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePacienteTheme, type PacienteTheme } from '../../../theme'
import { useThemeStore } from '../../../stores/themeStore'
import { usePacienteAuthStore } from '../../../stores/pacienteAuthStore'
import { usePacientePerfil } from '../../../hooks/usePacientePerfil'
import { usePacienteGarden } from '../../../hooks/usePacienteGarden'
import { GardenProfileBlock } from '../../molecules/GardenProfileBlock'
import { removePatientToken, removePacienteMeta } from '../../../services/pacienteAuthService'
import { removeToken, removeUsuario } from '../../../services/authService'
import { useAuthStore } from '../../../stores/authStore'

// ─── helpers ─────────────────────────────────────────────────────────────────

function toTitle(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase())
}

function initials(s: string) {
  const parts = s.trim().split(/\s+/).filter(Boolean)
  return parts.length ? (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase() : '?'
}

function formatPhone(s: string | null | undefined) {
  if (!s) return null
  const d = s.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return s
}

function hasValue(v: string | null | undefined) {
  return v != null && String(v).trim() !== '' && String(v).trim() !== '-'
}

// ─── subcomponents ────────────────────────────────────────────────────────────

function DataCell({
  label,
  value,
  full,
  colors,
}: {
  label: string
  value: string | null | undefined
  full?: boolean
  colors: PacienteTheme
}) {
  const empty = !hasValue(value)
  return (
    <View
      style={[
        cellStyles.cell,
        { borderTopColor: colors.border, gridColumn: full ? '1 / -1' : 'auto' } as any,
        full && { width: '100%' },
      ]}
    >
      <Text style={[cellStyles.cellLabel, { color: colors.textFaint }]}>{label}</Text>
      <Text
        style={[
          cellStyles.cellValue,
          { color: empty ? colors.textFaint : colors.text, fontStyle: empty ? 'italic' : 'normal' },
        ]}
      >
        {empty ? '—' : value}
      </Text>
    </View>
  )
}

const cellStyles = StyleSheet.create({
  cell: { padding: 12, borderTopWidth: 1 },
  cellLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  cellValue: { fontSize: 14.5, marginTop: 3, fontWeight: '600' },
})

function SettingRow({
  icon,
  label,
  sub,
  right,
  danger,
  last,
  onPress,
  colors,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  sub?: string
  right?: React.ReactNode
  danger?: boolean
  last?: boolean
  onPress?: () => void
  colors: PacienteTheme
}) {
  const content = (
    <View
      style={[
        rowStyles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.divider },
      ]}
    >
      <View
        style={[
          rowStyles.iconWrap,
          { backgroundColor: danger ? colors.dangerSoft : colors.primarySoft },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? colors.danger : colors.primary}
        />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={[rowStyles.label, { color: danger ? colors.danger : colors.text }]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {sub && (
          <Text style={[rowStyles.sub, { color: colors.textMuted }]} numberOfLines={1}>
            {sub}
          </Text>
        )}
      </View>
      {right}
      {!right && onPress && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={danger ? colors.danger : colors.textFaint}
        />
      )}
    </View>
  )

  return onPress ? (
    <Pressable onPress={onPress} android_ripple={{ color: colors.border }}>
      {content}
    </Pressable>
  ) : (
    content
  )
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 13 },
  iconWrap: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  label: { fontSize: 14.5, fontWeight: '500' },
  sub: { fontSize: 12, marginTop: 1 },
})

function ToggleSwitch({ value, onChange, colors }: {
  value: boolean
  onChange: () => void
  colors: PacienteTheme
}) {
  return (
    <Pressable
      onPress={onChange}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        padding: 2,
        backgroundColor: value ? colors.primary : colors.border,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: '#FFFFFF',
          alignSelf: value ? 'flex-end' : 'flex-start',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        }}
      />
    </Pressable>
  )
}

// ─── main page ───────────────────────────────────────────────────────────────

export function PacientePerfilPage() {
  const router = useRouter()
  const { dark, colors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const insets = useSafeAreaInsets()

  const pacienteId = usePacienteAuthStore((s) => s.pacienteId)
  const nome = usePacienteAuthStore((s) => s.nome) ?? ''
  const logout = usePacienteAuthStore((s) => s.logout)
  const toggleTheme = useThemeStore((s) => s.toggle)

  const { perfil, loading } = usePacientePerfil(pacienteId)
  const { garden } = usePacienteGarden()

  const displayNome = perfil?.nomesocial ?? perfil?.nome ?? nome
  const ini = initials(displayNome)

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await removePatientToken()
          await removePacienteMeta()
          await removeToken()
          await removeUsuario()
          logout()
          useAuthStore.getState().logout()
          router.replace('/login' as never)
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 8 },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerSide}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Meu perfil</Text>
        <View style={styles.headerSide} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* hero */}
          <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.iconBg }]}>
              <Text style={[styles.avatarText, { color: colors.primaryStrong }]}>{ini}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.heroName, { color: colors.text }]} numberOfLines={2}>
                {toTitle(displayNome)}
              </Text>
              {perfil && (
                <Text style={[styles.heroSub, { color: colors.textMuted }]}>
                  {perfil.sexo} · {perfil.idade} anos
                </Text>
              )}
            </View>
          </View>

          {/* garden */}
          {garden && (
            <GardenProfileBlock data={garden} colors={colors} />
          )}

          {/* dados pessoais */}
          <View style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.primaryStrong }]}>DADOS PESSOAIS</Text>
            <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.gridRow}>
                <DataCell label="Nascimento" value={perfil?.datanascimento} colors={colors} />
                <DataCell label="Idade" value={perfil ? `${perfil.idade} anos` : null} colors={colors} />
              </View>
              <View style={styles.gridRow}>
                <DataCell label="CPF" value={perfil?.cpf} colors={colors} />
                <DataCell label="CNS" value={perfil?.cns} colors={colors} />
              </View>
            </View>
          </View>

          {/* responsável e contato */}
          <View style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.primaryStrong }]}>RESPONSÁVEL E CONTATO</Text>
            <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <DataCell
                label="Responsável"
                value={perfil?.nomeresponsavel ? toTitle(perfil.nomeresponsavel) : null}
                full
                colors={colors}
              />
              <DataCell label="E-mail" value={perfil?.email} full colors={colors} />
              <DataCell label="Telefone" value={formatPhone(perfil?.telefone)} full colors={colors} />
            </View>
          </View>

          {/* ajustes */}
          <View style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.primaryStrong }]}>AJUSTES</Text>
            <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <SettingRow
                icon={dark ? 'moon' : 'sunny'}
                label="Tema escuro"
                colors={colors}
                right={<ToggleSwitch value={dark} onChange={toggleTheme} colors={colors} />}
              />
              <SettingRow
                icon="help-circle-outline"
                label="Ajuda e suporte"
                colors={colors}
                onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.')}
              />
              <SettingRow
                icon="shield-outline"
                label="Privacidade e termos"
                colors={colors}
                onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.')}
                last
              />
            </View>
          </View>

          {/* sair */}
          <View style={styles.group}>
            <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <SettingRow
                icon="log-out-outline"
                label="Sair"
                danger
                last
                colors={colors}
                onPress={handleLogout}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

function makeStyles(colors: PacienteTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1 },
    headerSide: { width: 40, alignItems: 'center' },
    headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', textAlign: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    scroll: { padding: 14, gap: 16 },
    heroCard: {
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
    },
    avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    avatarText: { fontSize: 20, fontWeight: '700' },
    heroName: { fontSize: 16.5, fontWeight: '700' },
    heroSub: { fontSize: 12.5, marginTop: 3 },
    group: { gap: 6 },
    groupTitle: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
      paddingHorizontal: 4,
    },
    groupCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
    gridRow: { flexDirection: 'row' },
  })
}
