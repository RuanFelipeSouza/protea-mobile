import { useState, useEffect } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import { useUnidadeStore } from '../stores/unidadeStore'
import type { EvolucaoRealizada } from '../types/evolucao'

export function useEvolucoes(pacienteId: string) {
  const unidade = useUnidadeStore((s) => s.selecionada)
  const [evolucoes, setEvolucoes] = useState<EvolucaoRealizada[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!pacienteId) return
    const controller = new AbortController()
    setLoading(true)
    evolucaoService
      .getEvolucoes(pacienteId, unidade?.id, controller.signal)
      .then((data) => {
        const ts = (e: EvolucaoRealizada) => {
          if (!e.data) return 0
          return new Date(`${e.data.split('/').reverse().join('-')}T${e.hora || '00:00'}`).getTime()
        }
        const sorted = [...data].sort((a, b) => ts(b) - ts(a))
        setEvolucoes(sorted)
        setErro(null)
      })
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        console.error('[useEvolucoes] erro ao buscar evoluções:', error?.response?.status, error?.message, error)
        setErro('Erro ao carregar evoluções')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [pacienteId, unidade?.id])

  return { evolucoes, loading, erro }
}
