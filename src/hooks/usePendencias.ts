import { useState, useEffect } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import { useUnidadeStore } from '../stores/unidadeStore'
import type { Pendencia } from '../types/evolucaoPendente'

export function usePendencias() {
  const unidade = useUnidadeStore((s) => s.selecionada)
  const [pendencias, setPendencias] = useState<Pendencia[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!unidade) {
      setPendencias([])
      setLoading(false)
      setErro(null)
      return
    }

    setLoading(true)
    evolucaoService
      .getPendencias(unidade.id)
      .then((data) => {
        setPendencias(data)
        setErro(null)
      })
      .catch((error) => {
        console.error('[usePendencias] erro:', error?.message)
        setErro('Erro ao carregar pendências')
      })
      .finally(() => setLoading(false))
  }, [unidade?.id])

  return { pendencias, loading, erro }
}
