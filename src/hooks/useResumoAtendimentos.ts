import { useEffect, useState } from 'react'
import { getResumoAtendimentos } from '../services/resumoAtendimentosService'
import type { ResumoAtendimentosPlano } from '../types/resumoAtendimentos'

export function useResumoAtendimentos(pacienteId: number | null) {
  const [resumo, setResumo] = useState<ResumoAtendimentosPlano | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!pacienteId) return
    const ctrl = new AbortController()
    setLoading(true)
    setErro(null)

    getResumoAtendimentos(pacienteId)
      .then((d) => { if (!ctrl.signal.aborted) setResumo(d) })
      .catch((e) => { if (!ctrl.signal.aborted) setErro(e?.message ?? 'Erro ao carregar resumo de atendimentos') })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false) })

    return () => ctrl.abort()
  }, [pacienteId])

  return { resumo, loading, erro }
}
