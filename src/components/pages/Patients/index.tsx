import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { HeaderBar } from '../../organisms'
import { PatientsTemplate } from '../../templates'
import { usePacientes } from '../../../hooks/usePacientes'
import { styles } from './styles'
import type { Patient } from '../../../types/patient'

export function PatientsPage() {
  const router = useRouter()
  const { pacientes, loading } = usePacientes()
  const [activeTab, setActiveTab] = useState('pacientes')
  const [searchQuery, setSearchQuery] = useState('')

  const pacientesFiltrados = useMemo(
    () =>
      pacientes.filter((p) => p.nome.toLowerCase().includes(searchQuery.toLowerCase())),
    [pacientes, searchQuery],
  )

  function handlePatientPress(patient: Patient) {
    // TODO: navegar para detalhe do paciente
    console.log('Patient selected:', patient.id)
  }

  function handleNovoPaciente() {
    // TODO: navegar para criar paciente
    console.log('Novo paciente')
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="Área Profissional" showBack onBack={() => router.back()} />
      <PatientsTemplate
        patients={pacientesFiltrados}
        loading={loading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPatientPress={handlePatientPress}
        onNovoPaciente={handleNovoPaciente}
      />
    </View>
  )
}
