import { useCallback, useEffect, useState } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import type { EvolucaoDetalhes } from '../types/mobile'

type State = {
  evolucao: EvolucaoDetalhes | null
  loading: boolean
  erro: string | null
}

export function useEvolucaoDetalhes(evolucaoId: number) {
  const [state, setState] = useState<State>({
    evolucao: null,
    loading: false,
    erro: null,
  })

  const carregar = useCallback(() => {
    if (!evolucaoId) {
      setState({ evolucao: null, loading: false, erro: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, erro: null }))

    evolucaoService
      .getEvolucaoDetalhes(evolucaoId)
      .then((evolucao) => {
        console.log('[useEvolucaoDetalhes] ✅ sucesso:', evolucao)
        setState({ evolucao, loading: false, erro: null })
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return
        console.error('[useEvolucaoDetalhes] ❌ erro:', err?.message || err)
        setState({
          evolucao: null,
          loading: false,
          erro: `Erro ao carregar: ${err?.message || 'desconhecido'}`,
        })
      })
  }, [evolucaoId])

  useEffect(() => {
    console.log('[useEvolucaoDetalhes] useEffect triggered, evolucaoId:', evolucaoId)
    carregar()
  }, [carregar])

  return { ...state, recarregar: carregar }
}
