import { View, Text, Pressable } from 'react-native'
import { AlertItem } from '../../molecules'
import { styles } from './styles'

type Alert = {
  message: string
  time: string
}

type AlertsSectionProps = {
  alerts: Alert[]
  onVerTodos?: () => void
}

export function AlertsSection({ alerts, onVerTodos }: AlertsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas</Text>
      {alerts.map((alert) => (
        <AlertItem key={alert.message} message={alert.message} time={alert.time} />
      ))}
      <Pressable onPress={onVerTodos}>
        <Text style={styles.verTodos}>Ver Todos</Text>
      </Pressable>
    </View>
  )
}
