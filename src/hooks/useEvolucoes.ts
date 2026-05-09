import { useState, useEffect } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import type { EvolucaoRealizada } from '../types/evolucao'

export function useEvolucoes(pacienteId: string) {
  const [evolucoes, setEvolucoes] = useState<EvolucaoRealizada[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!pacienteId) return
    setLoading(true)
    evolucaoService
      .getEvolucoes(pacienteId)
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}`)
          const dateB = new Date(`${b.data.split('/').reverse().join('-')}T${b.hora}`)
          return dateB.getTime() - dateA.getTime()
        })
        setEvolucoes(sorted)
        setErro(null)
      })
      .catch((error) => {
        console.error('[useEvolucoes] erro ao buscar evoluções:', error?.response?.status, error?.message, error)
        setErro('Erro ao carregar evoluções')
      })
      .finally(() => setLoading(false))
  }, [pacienteId])

  return { evolucoes, loading, erro }
}
