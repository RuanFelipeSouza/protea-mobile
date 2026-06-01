import { useEffect, useState } from 'react'
import { getPacientePerfilContexto } from '../services/pacienteDataService'
import type { PerfilPacienteContexto } from '../types/pacienteContextTypes'

export function usePacientePerfil(pacienteId: number | null) {
  const [perfil, setPerfil] = useState<PerfilPacienteContexto | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!pacienteId) return
    const ctrl = new AbortController()
    setLoading(true)
    setErro(null)

    getPacientePerfilContexto(pacienteId)
      .then((d) => {
        if (ctrl.signal.aborted) return
        setPerfil(d)
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return
        setErro(e?.message ?? 'Erro ao carregar perfil')
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })

    return () => ctrl.abort()
  }, [pacienteId])

  return { perfil, loading, erro }
}
