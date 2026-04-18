import { useState, useEffect } from 'react'
import { patientService } from '../services/patientService'
import type { Patient } from '../types/patient'

type State = {
  pacientes: Patient[]
  loading: boolean
  erro: string | null
}

export function usePacientes() {
  const [state, setState] = useState<State>({ pacientes: [], loading: true, erro: null })

  useEffect(() => {
    patientService
      .listar()
      .then((pacientes) => setState({ pacientes, loading: false, erro: null }))
      .catch(() => setState({ pacientes: [], loading: false, erro: 'Erro ao carregar pacientes' }))
  }, [])

  return state
}
