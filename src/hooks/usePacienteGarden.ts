import { useEffect, useState } from 'react'
import { getPacienteGarden } from '../services/pacienteDataService'
import type { GardenStatusPaciente } from '../types/pacienteContextTypes'

export function usePacienteGarden() {
  const [garden, setGarden] = useState<GardenStatusPaciente | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)

    getPacienteGarden()
      .then((d) => { if (!ctrl.signal.aborted) setGarden(d) })
      .catch(() => {})
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false) })

    return () => ctrl.abort()
  }, [])

  return { garden, loading }
}
