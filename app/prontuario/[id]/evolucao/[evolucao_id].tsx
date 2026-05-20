import { useLocalSearchParams } from 'expo-router'
import { EvolucaoDetalhesPage } from '../../../src/components/pages'

export default function EvolucaoDetalhesScreen() {
  const { evolucao_id } = useLocalSearchParams<{ evolucao_id: string }>()

  const evolucaoId = evolucao_id ? parseInt(evolucao_id, 10) : 0

  return <EvolucaoDetalhesPage evolucaoId={evolucaoId} />
}
