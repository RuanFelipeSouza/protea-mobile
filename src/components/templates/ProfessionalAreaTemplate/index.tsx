import { ScrollView } from 'react-native'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { ActionGrid, AlertsSection } from '../../organisms'
import { styles } from './styles'

type ActionItem = {
  icon: ComponentProps<typeof Ionicons>['name']
  label: string
  onPress?: () => void
}

type Alert = {
  message: string
  time: string
}

type ProfessionalAreaTemplateProps = {
  actions: ActionItem[]
  alerts: Alert[]
  onVerTodos?: () => void
}

export function ProfessionalAreaTemplate({
  actions,
  alerts,
  onVerTodos,
}: ProfessionalAreaTemplateProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ActionGrid items={actions} />
      <AlertsSection alerts={alerts} onVerTodos={onVerTodos} />
    </ScrollView>
  )
}
