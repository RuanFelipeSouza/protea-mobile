import { useEffect, useState } from 'react'
import { mobileService } from '../services/mobileService'
import type { GardenStatusPaciente } from '../types/pacienteContextTypes'

export function useProntuarioGarden(pacienteId: string) {
  const [garden, setGarden] = useState<GardenStatusPaciente | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!pacienteId) return
    const ctrl = new AbortController()
    setLoading(true)

    mobileService
      .getProntuarioGarden(pacienteId, ctrl.signal)
      .then((d) => { if (!ctrl.signal.aborted) setGarden(d) })
      .catch(() => {})
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false) })

    return () => ctrl.abort()
  }, [pacienteId])

  return { garden, loading }
}
