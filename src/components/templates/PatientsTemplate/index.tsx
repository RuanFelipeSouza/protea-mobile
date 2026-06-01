import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SearchInput } from '../../molecules'
import { PatientsList } from '../../organisms'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'
import type { Patient } from '../../../types/patient'

type PatientsTemplateProps = {
  patients: Patient[]
  loading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  somenteAtivos: boolean
  onToggleSomenteAtivos: () => void
  onPatientPress: (patient: Patient) => void
}

export function PatientsTemplate({
  patients,
  loading,
  searchQuery,
  onSearchChange,
  somenteAtivos,
  onToggleSomenteAtivos,
  onPatientPress,
}: PatientsTemplateProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar paciente..."
        />

        <Pressable style={styles.filterChip} onPress={onToggleSomenteAtivos}>
          <Ionicons
            name={somenteAtivos ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={somenteAtivos ? colors.success[60] : colors.neutral[50]}
          />
          <Text style={[styles.filterChipText, somenteAtivos && styles.filterChipTextActive]}>
            {somenteAtivos ? 'Somente ativos' : 'Todos os pacientes'}
          </Text>
        </Pressable>

        <PatientsList
          patients={patients}
          loading={loading}
          onPress={onPatientPress}
        />
      </View>
    </View>
  )
}
