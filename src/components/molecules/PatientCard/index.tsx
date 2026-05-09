import { View, Text, Pressable } from 'react-native'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'
import { calcularIdade } from '../../../types/patient'
import type { Patient } from '../../../types/patient'

type PatientCardProps = {
  patient: Patient
  onPress: () => void
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  const idade = calcularIdade(patient.datanasc)
  const isAtivo = patient.is_active

  return (
    <Pressable
      style={[styles.container, !isAtivo && styles.containerInativo]}
      onPress={onPress}
    >
      <View style={[styles.avatar, !isAtivo && styles.avatarInativo]}>
        <Text style={[styles.avatarInitial, !isAtivo && styles.avatarInitialInativo]}>
          {patient.nome.charAt(0)}
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nomeRow}>
          <Text style={styles.nome} numberOfLines={1}>{patient.nome}</Text>
          {!isAtivo && (
            <View style={styles.badgeInativo}>
              <Text style={styles.badgeInativoText}>Inativo</Text>
            </View>
          )}
        </View>
        <Text style={styles.meta}>
          {idade != null ? `${idade} anos` : '—'}
          {patient.sexo ? ` · ${patient.sexo}` : ''}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={onPress} hitSlop={6}>
          <Icon name="id-card-outline" size={20} color={theme.colors.primary[70]} />
        </Pressable>
      </View>
    </Pressable>
  )
}
