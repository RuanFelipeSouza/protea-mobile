import { useEffect, useState } from 'react'
import { mobileService } from '../services/mobileService'
import type { Unidade } from '../types/unidade'

type State = {
  unidades: Unidade[]
  loading: boolean
  erro: string | null
}

export function useMinhasUnidades() {
  const [state, setState] = useState<State>({ unidades: [], loading: false, erro: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ unidades: [], loading: true, erro: null })

    mobileService
      .getMinhasUnidades(controller.signal)
      .then((unidades) => setState({ unidades, loading: false, erro: null }))
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return
        console.error('[useMinhasUnidades] erro:', err?.message)
        setState({ unidades: [], loading: false, erro: 'Erro ao carregar unidades' })
      })

    return () => controller.abort()
  }, [])

  return state
}
