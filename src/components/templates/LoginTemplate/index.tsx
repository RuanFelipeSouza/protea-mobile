import { useMemo } from 'react'
import { View, Text, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../../atoms'
import { LoginForm } from '../../organisms/LoginForm'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type LoginMode = 'prof' | 'paciente'

type LoginTemplateProps = {
  mode?: LoginMode
  onLogin: (usuario: string, senha: string) => Promise<void>
  onForgotPassword?: () => void
  onModeChange?: (mode: LoginMode) => void
  onPrimeiroAcesso?: () => void
}

export function LoginTemplate({
  mode = 'prof',
  onLogin,
  onForgotPassword,
  onModeChange,
  onPrimeiroAcesso,
}: LoginTemplateProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.leafTopRight} pointerEvents="none">
        <Icon name="leaf" size={220} color={colors.primary[30]} />
      </View>
      <View style={styles.leafBottomLeft} pointerEvents="none">
        <Icon name="leaf" size={200} color={colors.primary[30]} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {mode === 'paciente' && (
          <View style={styles.chipRow}>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: colors.primary[10],
                  borderColor: colors.primary[70] + '33',
                },
              ]}
            >
              <Text style={[styles.chipText, { color: colors.primary[70] }]}>
                ÁREA DO PACIENTE
              </Text>
            </View>
          </View>
        )}

        <View style={styles.logoSection}>
          <Icon name="flower-outline" size={64} color={colors.primary[70]} />
          <Text style={styles.logoText}>PROTEA</Text>
        </View>

        <LoginForm
          mode={mode}
          onLogin={onLogin}
          onForgotPassword={onForgotPassword}
          onModeChange={onModeChange}
          onPrimeiroAcesso={onPrimeiroAcesso}
        />

        <Pressable
          onPress={() => onModeChange?.(mode === 'paciente' ? 'prof' : 'paciente')}
          style={styles.modeLink}
          hitSlop={8}
        >
          <Text style={[styles.modeLinkText, { color: colors.primary[70] }]}>
            {mode === 'paciente' ? 'Sou profissional' : 'Área do Paciente'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
