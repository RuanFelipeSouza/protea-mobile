import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { HeaderBar } from '../../organisms'
import { ProfessionalAreaTemplate } from '../../templates'
import { styles } from './styles'

export function ProfessionalAreaPage() {
  const router = useRouter()

  const ACTIONS = [
    { icon: 'people' as const, label: 'Pacientes', onPress: () => router.push('/(tabs)/pacientes') },
    { icon: 'create' as const, label: 'Evoluções' },
    { icon: 'clipboard' as const, label: 'Relatórios' },
    { icon: 'calendar' as const, label: 'Agenda' },
  ]

  const ALERTS = [
    { message: 'Revisar sessão de João', time: 'Há 10 minutos' },
    { message: 'Novo documento enviado por Ana', time: 'Há 30 min' },
  ]

  return (
    <View style={styles.container}>
      <HeaderBar title="Área Profissional" />
      <ProfessionalAreaTemplate actions={ACTIONS} alerts={ALERTS} />
    </View>
  )
}
