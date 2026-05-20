import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (!evolucaoId) {
      setState({ evolucao: null, loading: false, erro: null })
      return
    }

    const controller = new AbortController()
    console.log('[useEvolucaoDetalhes] iniciando com ID:', evolucaoId)
    setState({ evolucao: null, loading: true, erro: null })

    evolucaoService
      .getEvolucaoDetalhes(evolucaoId)
      .then((evolucao) => {
        console.log('[useEvolucaoDetalhes] sucesso:', evolucao)
        setState({ evolucao, loading: false, erro: null })
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return
        console.error('[useEvolucaoDetalhes] erro:', err)
        setState({
          evolucao: null,
          loading: false,
          erro: 'Erro ao carregar evolução',
        })
      })

    return () => controller.abort()
  }, [evolucaoId])

  return state
}
