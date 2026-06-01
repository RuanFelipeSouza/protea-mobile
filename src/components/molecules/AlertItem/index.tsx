import { useMemo } from 'react'
import { View, Text } from 'react-native'
import { Icon } from '../../atoms'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type AlertItemProps = {
  message: string
  time: string
}

export function AlertItem({ message, time }: AlertItemProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <View style={styles.container}>
      <Icon name="warning" size={20} color={colors.warning[40]} />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  )
}
