import { useMemo } from 'react'
import { FlatList, View, Text, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { PatientCard } from '../../molecules'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'
import type { Patient } from '../../../types/patient'

type PatientsListProps = {
  patients: Patient[]
  loading: boolean
  onPress: (patient: Patient) => void
}

export function PatientsList({ patients, loading, onPress }: PatientsListProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.primary[80]} />
      </View>
    )
  }

  return (
    <FlatList
      data={patients}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PatientCard
          patient={item}
          onPress={() => onPress(item)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={48} color={colors.neutral[30]} />
          <Text style={styles.emptyText}>Nenhum paciente nesta unidade</Text>
        </View>
      }
    />
  )
}
