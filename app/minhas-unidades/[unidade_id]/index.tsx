import { useLocalSearchParams } from 'expo-router'
import { PacientesDaUnidadePage } from '../../../src/components/pages'

export default function PacientesDaUnidadeScreen() {
  const { unidade_id, nome } = useLocalSearchParams<{ unidade_id: string; nome?: string }>()
  return (
    <PacientesDaUnidadePage
      unidadeId={Number(unidade_id)}
      nomeUnidade={nome ? decodeURIComponent(nome) : undefined}
    />
  )
}
