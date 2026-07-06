import { View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { HeaderBar } from '../../../src/components/organisms'
import { FolhaRegistroEditor } from '../../../src/components/pages'
import { useTheme } from '../../../src/theme'

export default function EditarFolhaRegistroScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { evolucao_id } = useLocalSearchParams<{ evolucao_id: string }>()
  const evolucaoId = evolucao_id ? parseInt(evolucao_id, 10) : 0

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[10] }}>
      <HeaderBar
        title="Editar folha de registro"
        showBack
        onBack={() => router.back()}
        showProfile={false}
        showUnidade={false}
      />
      <FolhaRegistroEditor evolucaoId={evolucaoId} modo="editar" />
    </View>
  )
}
