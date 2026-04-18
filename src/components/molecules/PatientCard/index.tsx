import { View, Text, Pressable } from 'react-native'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'
import type { Patient } from '../../../types/patient'

type PatientCardProps = {
  patient: Patient
  onPress: () => void
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{patient.nome.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome}>{patient.nome}</Text>
        <Text style={styles.idade}>Idade: {patient.idade} anos</Text>
      </View>
      <Icon name="chevron-forward" size={20} color={theme.colors.neutral[40]} />
    </Pressable>
  )
}
