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
    console.log('[useEvolucaoDetalhes] useEffect triggered, evolucaoId:', evolucaoId)

    if (!evolucaoId) {
      console.log('[useEvolucaoDetalhes] ID inválido, retornando')
      setState({ evolucao: null, loading: false, erro: null })
      return
    }

    const controller = new AbortController()
    console.log('[useEvolucaoDetalhes] iniciando requisição com ID:', evolucaoId)
    setState({ evolucao: null, loading: true, erro: null })

    evolucaoService
      .getEvolucaoDetalhes(evolucaoId)
      .then((evolucao) => {
        console.log('[useEvolucaoDetalhes] ✅ sucesso:', evolucao)
        setState({ evolucao, loading: false, erro: null })
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') {
          console.log('[useEvolucaoDetalhes] requisição cancelada')
          return
        }
        console.error('[useEvolucaoDetalhes] ❌ erro:', err?.message || err)
        setState({
          evolucao: null,
          loading: false,
          erro: `Erro ao carregar: ${err?.message || 'desconhecido'}`,
        })
      })

    return () => controller.abort()
  }, [evolucaoId])

  return state
}
