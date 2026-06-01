import { useEffect, useState } from 'react'
import { getPacienteEvolucoes } from '../services/pacienteDataService'
import { usePacienteAuthStore } from '../stores/pacienteAuthStore'
import type { EvolucaoPaciente } from '../types/pacienteContextTypes'

export function usePacienteEvolucoes() {
  const [evolucoes, setEvolucoes] = useState<EvolucaoPaciente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const token = usePacienteAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) return
    const ctrl = new AbortController()
    setLoading(true)
    setErro(null)

    getPacienteEvolucoes()
      .then((d) => {
        if (ctrl.signal.aborted) return
        setEvolucoes(d)
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return
        setErro(e?.message ?? 'Erro ao carregar evoluções')
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })

    return () => ctrl.abort()
  }, [token])

  return { evolucoes, loading, erro }
}
