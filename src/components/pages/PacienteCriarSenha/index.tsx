import { useMemo, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { InputField } from '../../molecules/InputField'
import { Icon } from '../../atoms'
import { usePacienteTheme } from '../../../theme'
import { pacienteDefinirSenha } from '../../../services/pacienteLoginService'
import { savePatientToken, savePacienteMeta, removePatientToken, removePacienteMeta } from '../../../services/pacienteAuthService'
import { removeToken, removeUsuario } from '../../../services/authService'
import { useAuthStore } from '../../../stores/authStore'
import { usePacienteAuthStore } from '../../../stores/pacienteAuthStore'

type Rule = { label: string; check: (v: string) => boolean }

const RULES: Rule[] = [
  { label: 'Mínimo de 8 caracteres', check: (v) => v.length >= 8 },
  { label: 'Uma letra maiúscula', check: (v) => /[A-Z]/.test(v) },
  { label: 'Um número', check: (v) => /\d/.test(v) },
]

export function PacienteCriarSenhaPage() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors } = usePacienteTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const setPacienteAuth = usePacienteAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [loading, setLoading] = useState(false)

  const allRulesOk = RULES.every((r) => r.check(senha))
  const senhasIguais = senha === confirmar && senha.length > 0

  async function handleCriar() {
    if (!email.trim() || !allRulesOk || !senhasIguais) return
    setLoading(true)
    try {
      const result = await pacienteDefinirSenha(email.trim(), senha)
      await savePatientToken(result.token)
      await savePacienteMeta(result.paciente_id, result.nome)
      setPacienteAuth(result.token, result.paciente_id, result.nome)
      // Garante exclusividade: limpa qualquer sessão profissional ativa
      await removeToken()
      await removeUsuario()
      useAuthStore.getState().logout()
      router.replace('/(paciente)' as never)
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.mensagem ?? e?.message ?? 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.authBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* folhas decorativas */}
      <View style={styles.leafTopRight} pointerEvents="none">
        <Icon name="leaf" size={220} color={colors.primarySoft} />
      </View>
      <View style={styles.leafBottomLeft} pointerEvents="none">
        <Icon name="leaf" size={200} color={colors.primarySoft} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* voltar */}
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
        </Pressable>

        {/* logo */}
        <View style={styles.logoSection}>
          <Icon name="flower-outline" size={44} color={colors.primary} />
        </View>

        {/* título */}
        <Text style={[styles.title, { color: colors.text }]}>Primeiro acesso</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Informe o e-mail cadastrado na clínica e defina uma senha para acessar a Área do Paciente.
        </Text>

        {/* campos */}
        <View style={styles.fields}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>E-mail cadastrado</Text>
            <InputField
              iconName="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Nova senha</Text>
            <InputField
              iconName="lock-closed-outline"
              value={senha}
              onChangeText={setSenha}
              placeholder="••••••••"
              secureTextEntry={!showSenha}
              rightElement={
                <Pressable onPress={() => setShowSenha((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={showSenha ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textFaint}
                  />
                </Pressable>
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Confirmar senha</Text>
            <InputField
              iconName="lock-closed-outline"
              value={confirmar}
              onChangeText={setConfirmar}
              placeholder="••••••••"
              secureTextEntry={!showConfirmar}
              rightElement={
                <Pressable onPress={() => setShowConfirmar((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={showConfirmar ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textFaint}
                  />
                </Pressable>
              }
            />
          </View>

          {/* checklist de regras */}
          <View style={styles.rules}>
            {RULES.map((r) => {
              const ok = r.check(senha)
              return (
                <View key={r.label} style={styles.ruleRow}>
                  <View
                    style={[
                      styles.ruleDot,
                      {
                        backgroundColor: ok ? colors.primary : 'transparent',
                        borderColor: ok ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {ok && (
                      <Ionicons name="checkmark" size={10} color={colors.primaryInk} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.ruleText,
                      { color: ok ? colors.primary : colors.textFaint },
                    ]}
                  >
                    {r.label}
                  </Text>
                </View>
              )
            })}
          </View>

          {/* botão */}
          <Pressable
            onPress={handleCriar}
            disabled={loading || !allRulesOk || !senhasIguais || !email.trim()}
            style={[
              styles.btn,
              {
                backgroundColor:
                  allRulesOk && senhasIguais && email.trim()
                    ? colors.primary
                    : colors.border,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryInk} />
            ) : (
              <Text
                style={[
                  styles.btnLabel,
                  {
                    color:
                      allRulesOk && senhasIguais && email.trim()
                        ? colors.primaryInk
                        : colors.textFaint,
                  },
                ]}
              >
                Criar senha e entrar
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function makeStyles(colors: ReturnType<typeof usePacienteTheme>['colors']) {
  return StyleSheet.create({
    container: { flex: 1 },
    leafTopRight: {
      position: 'absolute',
      top: -40,
      right: -60,
      opacity: 0.2,
      transform: [{ rotate: '-20deg' }],
    },
    leafBottomLeft: {
      position: 'absolute',
      bottom: -20,
      left: -60,
      opacity: 0.18,
      transform: [{ rotate: '160deg' }],
    },
    scroll: {
      paddingHorizontal: 32,
      flexGrow: 1,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 8,
      alignSelf: 'flex-start',
    },
    backText: { fontSize: 14, fontWeight: '600' },
    logoSection: {
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      marginTop: 8,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 22,
      marginTop: 8,
      marginBottom: 24,
    },
    fields: { gap: 16 },
    inputGroup: { gap: 6 },
    label: { fontSize: 14, fontWeight: '600' },
    rules: { gap: 8, paddingHorizontal: 2 },
    ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    ruleDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ruleText: { fontSize: 12.5 },
    btn: {
      width: '100%',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    btnLabel: { fontSize: 15, fontWeight: '700' },
  })
}
