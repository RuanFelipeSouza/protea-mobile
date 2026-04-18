import { FlatList, View, Text, ActivityIndicator } from 'react-native'
import { PatientCard } from '../../molecules'
import { theme } from '../../../theme'
import { styles } from './styles'
import type { Patient } from '../../../types/patient'

type PatientsListProps = {
  patients: Patient[]
  loading: boolean
  onPress: (patient: Patient) => void
}

export function PatientsList({ patients, loading, onPress }: PatientsListProps) {
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[80]} />
      </View>
    )
  }

  return (
    <FlatList
      data={patients}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <PatientCard patient={item} onPress={() => onPress(item)} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum paciente encontrado</Text>
        </View>
      }
    />
  )
}
