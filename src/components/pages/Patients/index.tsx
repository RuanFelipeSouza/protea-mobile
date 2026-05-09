import { useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { HeaderBar, UnidadeRequired } from '../../organisms'
import { PatientsTemplate } from '../../templates'
import { usePacientes } from '../../../hooks/usePacientes'
import { styles } from './styles'
import type { Patient } from '../../../types/patient'

export function PatientsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('pacientes')
  const [searchQuery, setSearchQuery] = useState('')
  const [somenteAtivos, setSomenteAtivos] = useState(true)

  const { pacientes, loading } = usePacientes(searchQuery, somenteAtivos)

  function handlePatientPress(patient: Patient) {
    router.push(`/prontuario/${patient.id}?nome=${encodeURIComponent(patient.nome)}` as any)
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="Pacientes" showBack onBack={() => router.back()} />
      <UnidadeRequired contextMessage="Selecione a unidade no header para listar os pacientes.">
        <PatientsTemplate
          patients={pacientes}
          loading={loading}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          somenteAtivos={somenteAtivos}
          onToggleSomenteAtivos={() => setSomenteAtivos((v) => !v)}
          onPatientPress={handlePatientPress}
        />
      </UnidadeRequired>
    </View>
  )
}
