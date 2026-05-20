import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { HeaderBar, UnidadeRequired } from '../../organisms'
import { theme } from '../../../theme'

export function PendenciasPage() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Pendências"
        showBack
        onBack={() => router.back()}
        showProfile={false}
      />

      <UnidadeRequired contextMessage="Selecione a unidade na home para visualizar as pendências.">
        <View style={styles.content}>
          <Text style={styles.placeholder}>Pendências - Em desenvolvimento</Text>
        </View>
      </UnidadeRequired>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[10],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholder: {
    fontSize: 16,
    color: theme.colors.neutral[60],
    textAlign: 'center',
  },
})
