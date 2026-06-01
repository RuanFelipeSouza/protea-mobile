import { useEffect, useState } from 'react'
import { getPacienteAgendamentos } from '../services/pacienteDataService'
import { usePacienteAuthStore } from '../stores/pacienteAuthStore'
import type { AgendamentoPaciente } from '../types/pacienteContextTypes'

export function usePacienteAgendamentos() {
  const [futuros, setFuturos] = useState<AgendamentoPaciente[]>([])
  const [passados, setPassados] = useState<AgendamentoPaciente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const token = usePacienteAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) return
    const ctrl = new AbortController()
    setLoading(true)
    setErro(null)

    getPacienteAgendamentos()
      .then((d) => {
        if (ctrl.signal.aborted) return
        setFuturos(d.futuros)
        setPassados(d.passados)
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return
        setErro(e?.message ?? 'Erro ao carregar agendamentos')
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })

    return () => ctrl.abort()
  }, [token])

  return { futuros, passados, loading, erro }
}
