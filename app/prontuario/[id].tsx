import { useLocalSearchParams } from 'expo-router'
import { ProntuarioPage } from '../../src/components/pages'

export default function ProntuarioScreen() {
  const { id, nome } = useLocalSearchParams<{ id: string; nome: string }>()

  return <ProntuarioPage pacienteId={id} pacienteNome={nome ?? 'Paciente'} />
}
