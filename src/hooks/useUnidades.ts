import { useEffect, useState } from 'react'
import { mobileService } from '../services/mobileService'
import { useAuthStore } from '../stores/authStore'
import type { Unidade } from '../types/unidade'

type State = {
  unidades: Unidade[]
  loading: boolean
  erro: string | null
}

/**
 * Hook responsável por carregar a lista de unidades vinculadas ao
 * profissional logado. Usado pelo seletor de unidade na home.
 *
 * Só dispara o request quando há um usuário autenticado.
 */
export function useUnidades() {
  const token = useAuthStore((s) => s.token)
  const [state, setState] = useState<State>({
    unidades: [],
    loading: false,
    erro: null,
  })

  useEffect(() => {
    if (!token) {
      setState({ unidades: [], loading: false, erro: null })
      return
    }

    setState((s) => ({ ...s, loading: true, erro: null }))
    const controller = new AbortController()

    mobileService
      .getMinhasUnidades(controller.signal)
      .then((unidades: Unidade[]) => {
        setState({ unidades, loading: false, erro: null })
      })
      .catch((err: { code?: string; message?: string }) => {
        if (err?.code === 'ERR_CANCELED') return
        console.error('[useUnidades] erro:', err?.message)
        setState({ unidades: [], loading: false, erro: 'Erro ao carregar unidades' })
      })

    return () => controller.abort()
  }, [token])

  return state
}
