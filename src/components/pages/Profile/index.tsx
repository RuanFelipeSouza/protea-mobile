import { useMemo } from 'react'
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  StatusBar,
} from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { HeaderBar } from '../../organisms'
import { removeToken, removeUsuario } from '../../../services/authService'
import { removePatientToken, removePacienteMeta } from '../../../services/pacienteAuthService'
import { useAuthStore } from '../../../stores/authStore'
import { usePacienteAuthStore } from '../../../stores/pacienteAuthStore'
import { useThemeStore } from '../../../stores/themeStore'
import { useSemanticColors } from '../../../theme'
import { usePerfilProfissional } from '../../../hooks/usePerfilProfissional'
import { makeStyles } from './styles'

export function ProfilePage() {
  const router = useRouter()
  const { dark, colors } = useSemanticColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const toggleTheme = useThemeStore((s) => s.toggle)
  const { perfil } = usePerfilProfissional(usuario?.id)

  const nome = useMemo(() => {
    if (usuario?.first_name) {
      return `${usuario.first_name}${usuario.last_name ? ' ' + usuario.last_name : ''}`
    }
    return usuario?.username ?? 'Profissional'
  }, [usuario])

  const iniciais = useMemo(() => {
    if (usuario?.first_name) {
      const a = usuario.first_name.charAt(0)
      const b = usuario.last_name?.charAt(0) ?? ''
      return (a + b).toUpperCase()
    }
    return (usuario?.username ?? 'P').charAt(0).toUpperCase()
  }, [usuario])

  const cargo = usuario?.is_superuser
    ? 'Superuser'
    : usuario?.is_staff
      ? 'Staff'
      : null

  async function handleLogout() {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await removeToken()
            await removeUsuario()
            await removePatientToken()
            await removePacienteMeta()
            logout()
            usePacienteAuthStore.getState().logout()
            router.replace('/login' as never)
          },
        },
      ],
    )
  }

  function emBreve() {
    Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <HeaderBar title="Perfil" showUnidade={false} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cabeçalho: avatar + dados do usuário ── */}
        <View style={styles.headCard}>
          <View style={styles.avatar}>
            {perfil?.foto_url ? (
              <Image
                source={{ uri: perfil.foto_url }}
                style={styles.avatarImage}
                contentFit="cover"
                transition={150}
              />
            ) : (
              <Text style={styles.avatarText}>{iniciais}</Text>
            )}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.name} numberOfLines={1}>
              {nome}
            </Text>
            {usuario?.username && (
              <Text style={styles.username} numberOfLines={1}>
                {usuario.username}
              </Text>
            )}
            {cargo && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cargo}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Ajustes ── */}
        <View style={styles.groupCard}>
          <Row
            colors={colors}
            iconName={dark ? 'moon' : 'sunny'}
            label="Tema escuro"
            sub={dark ? 'Ativado' : 'Desativado'}
            right={<Switch value={dark} onChange={toggleTheme} colors={colors} />}
          />
          <Divider colors={colors} />
          <Row
            colors={colors}
            iconName="notifications-outline"
            label="Notificações"
            sub="Push e alertas no app"
            right={<Switch value={true} onChange={emBreve} colors={colors} />}
          />
          <Divider colors={colors} />
          <Row
            colors={colors}
            iconName="business-outline"
            label="Unidade atual"
            sub="Toque para escolher outra"
            onPress={() => router.push('/minhas-unidades' as never)}
            chevron
          />
          <Divider colors={colors} />
          <Row
            colors={colors}
            iconName="information-circle-outline"
            label="Sobre o app"
            onPress={() => router.push('/sobre' as never)}
            chevron
          />
        </View>

        {/* ── Sair ── */}
        <View style={styles.groupCard}>
          <Row
            colors={colors}
            iconName="log-out-outline"
            label="Sair"
            danger
            onPress={handleLogout}
            chevron
          />
        </View>
      </ScrollView>
    </View>
  )
}

// ─── Subcomponentes ────────────────────────────────────────────────────────────

type RowColors = ReturnType<typeof import('./styles').makeStyles> extends never
  ? never
  : Parameters<typeof import('./styles').makeStyles>[0]

function Row({
  colors,
  iconName,
  label,
  sub,
  right,
  onPress,
  chevron,
  danger,
}: {
  colors: RowColors
  iconName: React.ComponentProps<typeof Ionicons>['name']
  label: string
  sub?: string
  right?: React.ReactNode
  onPress?: () => void
  chevron?: boolean
  danger?: boolean
}) {
  const styles = useMemo(() => makeStyles(colors), [colors])

  const content = (
    <View style={styles.row}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Ionicons
          name={iconName}
          size={20}
          color={danger ? colors.danger : colors.primary}
        />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={[styles.rowLabel, danger && styles.rowLabelDanger]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {sub && (
          <Text style={styles.rowSub} numberOfLines={1}>
            {sub}
          </Text>
        )}
      </View>
      {right}
      {chevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={danger ? colors.danger : colors.textFaint}
        />
      )}
    </View>
  )

  return onPress ? (
    <Pressable onPress={onPress} android_ripple={{ color: colors.divider }}>
      {content}
    </Pressable>
  ) : (
    content
  )
}

function Divider({ colors }: { colors: RowColors }) {
  return (
    <View
      style={{ height: 1, backgroundColor: colors.divider, marginLeft: 64 }}
    />
  )
}

function Switch({
  value,
  onChange,
  colors,
}: {
  value: boolean
  onChange: (v: boolean) => void
  colors: RowColors
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        padding: 2,
        backgroundColor: value ? colors.primary : colors.border,
        justifyContent: 'center',
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
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
