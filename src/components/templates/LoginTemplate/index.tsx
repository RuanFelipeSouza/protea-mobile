import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../../atoms'
import { LoginForm } from '../../organisms/LoginForm'
import { theme } from '../../../theme'
import { styles } from './styles'

type LoginTemplateProps = {
  onLogin: (usuario: string, senha: string) => Promise<void>
  onForgotPassword?: () => void
  onParentArea?: () => void
}

export function LoginTemplate({ onLogin, onForgotPassword, onParentArea }: LoginTemplateProps) {
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.leafTopRight} pointerEvents="none">
        <Icon name="leaf" size={220} color={theme.colors.primary[80]} />
      </View>
      <View style={styles.leafBottomLeft} pointerEvents="none">
        <Icon name="leaf" size={200} color={theme.colors.primary[80]} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <Icon name="flower-outline" size={64} color={theme.colors.neutral[0]} />
          <Text style={styles.logoText}>PROTEA</Text>
        </View>

        <LoginForm
          onLogin={onLogin}
          onForgotPassword={onForgotPassword}
          onParentArea={onParentArea}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
