import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { HeaderBar } from '../../organisms'
import { ProfessionalAreaTemplate } from '../../templates'
import { styles } from './styles'

export function ProfessionalAreaPage() {
  const router = useRouter()

  const ACTIONS = [
    { icon: 'people' as const, label: 'Pacientes', onPress: () => router.push('/(tabs)/pacientes') },
    { icon: 'create' as const, label: 'Evoluções', onPress: () => router.push('/(tabs)/evolucoes') },
    { icon: 'clipboard' as const, label: 'Relatórios', onPress: () => router.push('/(tabs)/relatorios') },
    { icon: 'calendar' as const, label: 'Agenda', onPress: () => router.push('/(tabs)/agenda') },
  ]

  return (
    <View style={styles.container}>
      <HeaderBar title="Área Profissional" />
      <ProfessionalAreaTemplate actions={ACTIONS} />
    </View>
  )
}
