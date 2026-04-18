import type { Patient } from '../types/patient'

const MOCK_PACIENTES: Patient[] = [
  { id: '1', nome: 'João', idade: 5 },
  { id: '2', nome: 'Laura', idade: 5 },
  { id: '3', nome: 'Pedro', idade: 6 },
  { id: '4', nome: 'Ana', idade: 4 },
  { id: '5', nome: 'Guilherme', idade: 6 },
]

export const patientService = {
  listar: async (): Promise<Patient[]> => {
    // TODO: remover mock quando API estiver pronta
    // const { data } = await apiClient.get<Patient[]>('/pacientes')
    // return data
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PACIENTES), 600))
  },
}
