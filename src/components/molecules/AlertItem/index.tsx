import { View, Text } from 'react-native'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'

type AlertItemProps = {
  message: string
  time: string
}

export function AlertItem({ message, time }: AlertItemProps) {
  return (
    <View style={styles.container}>
      <Icon name="warning" size={20} color={theme.colors.warning[40]} />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  )
}
