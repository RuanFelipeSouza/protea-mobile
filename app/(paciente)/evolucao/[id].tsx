import { useLocalSearchParams } from 'expo-router'
import { PacienteEvolucaoDetalhePage } from '../../../src/components/pages/PacienteEvolucaoDetalhe'

export default function EvolucaoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <PacienteEvolucaoDetalhePage evolucaoId={id ?? ''} />
}
