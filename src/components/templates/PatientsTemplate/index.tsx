import { View, Text, Pressable } from 'react-native'
import { SegmentedControl, SearchInput } from '../../molecules'
import { PatientsList } from '../../organisms'
import { styles } from './styles'
import type { Patient } from '../../../types/patient'

const TABS = [
  { label: 'Pacientes', value: 'pacientes' },
  { label: 'Evoluções', value: 'evolucoes' },
]

type PatientsTemplateProps = {
  patients: Patient[]
  loading: boolean
  activeTab: string
  onTabChange: (value: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onPatientPress: (patient: Patient) => void
  onNovoPaciente: () => void
}

export function PatientsTemplate({
  patients,
  loading,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onPatientPress,
  onNovoPaciente,
}: PatientsTemplateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SegmentedControl tabs={TABS} active={activeTab} onChange={onTabChange} />
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar paciente..."
        />
        <PatientsList patients={patients} loading={loading} onPress={onPatientPress} />
      </View>
      <Pressable style={styles.novoPacienteButton} onPress={onNovoPaciente}>
        <Text style={styles.novoPacienteLabel}>+ Novo Paciente</Text>
      </Pressable>
    </View>
  )
}
