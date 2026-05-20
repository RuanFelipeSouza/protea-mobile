import { useLocalSearchParams } from 'expo-router'
import { EvolucoesDoPacientePage } from '../../../src/components/pages'

export default function EvolucoesDoPacienteScreen() {
  const { unidade_id, paciente_id, nome } = useLocalSearchParams<{
    unidade_id: string
    paciente_id: string
    nome?: string
  }>()
  return (
    <EvolucoesDoPacientePage
      unidadeId={Number(unidade_id)}
      pacienteId={Number(paciente_id)}
      nomePaciente={nome ? decodeURIComponent(nome) : undefined}
    />
  )
}
