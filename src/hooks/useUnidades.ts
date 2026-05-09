import { useEffect, useState } from 'react'
import { unidadeService } from '../services/unidadeService'
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
  const usuario = useAuthStore((s) => s.usuario)
  const [state, setState] = useState<State>({
    unidades: [],
    loading: false,
    erro: null,
  })

  useEffect(() => {
    if (!usuario?.id) {
      setState({ unidades: [], loading: false, erro: null })
      return
    }

    setState((s) => ({ ...s, loading: true, erro: null }))
    const controller = new AbortController()

    unidadeService
      .listarPorUsuario(usuario.id, controller.signal)
      .then((unidades) => {
        setState({ unidades, loading: false, erro: null })
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return
        console.error('[useUnidades] erro:', err?.message)
        setState({ unidades: [], loading: false, erro: 'Erro ao carregar unidades' })
      })

    return () => controller.abort()
  }, [usuario?.id])

  return state
}
