import { useEffect, useState } from 'react'
import { patientService } from '../services/patientService'
import type { Patient } from '../types/patient'

type State = {
  pacientes: Patient[]
  loading: boolean
  erro: string | null
}

export function usePacientesDaUnidade(unidadeId: number) {
  const [state, setState] = useState<State>({ pacientes: [], loading: false, erro: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ pacientes: [], loading: true, erro: null })

    patientService
      .buscarPorUnidade(unidadeId, undefined, controller.signal)
      .then((pacientes) => setState({ pacientes, loading: false, erro: null }))
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return
        console.error('[usePacientesDaUnidade] erro:', err?.message)
        setState({ pacientes: [], loading: false, erro: 'Erro ao carregar pacientes' })
      })

    return () => controller.abort()
  }, [unidadeId])

  return state
}
