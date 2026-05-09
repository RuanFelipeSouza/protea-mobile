import { useState, useEffect, useCallback } from 'react'
import { patientService } from '../services/patientService'
import { useUnidadeStore } from '../stores/unidadeStore'
import type { Patient } from '../types/patient'

type State = {
  all: Patient[]
  pacientes: Patient[]
  loading: boolean
  erro: string | null
}

/**
 * Carrega pacientes da unidade selecionada.
 * - `somenteAtivos=true` (padrão) → filtra no backend (is_active=true)
 * - `somenteAtivos=false` → traz todos do backend
 * Filtragem por searchQuery é sempre client-side.
 */
export function usePacientes(searchQuery: string, somenteAtivos: boolean = true) {
  const unidade = useUnidadeStore((s) => s.selecionada)

  const [state, setState] = useState<State>({
    all: [],
    pacientes: [],
    loading: false,
    erro: null,
  })

  const fetchPacientes = useCallback(
    (signal?: AbortSignal) => {
      if (!unidade) {
        setState({ all: [], pacientes: [], loading: false, erro: null })
        return
      }

      setState((s) => ({ ...s, loading: true, erro: null }))

      patientService
        .buscarPorUnidade(unidade.id, somenteAtivos ? true : undefined, signal)
        .then((all) => {
          setState({ all, pacientes: all, loading: false, erro: null })
        })
        .catch((err) => {
          if (err?.code === 'ERR_CANCELED') return
          console.error('[usePacientes] erro:', err?.message)
          setState({ all: [], pacientes: [], loading: false, erro: 'Erro ao carregar pacientes' })
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unidade?.id, somenteAtivos],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchPacientes(controller.signal)
    return () => controller.abort()
  }, [fetchPacientes])

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()
    setState((s) => ({
      ...s,
      pacientes: q
        ? s.all.filter((p) => p.nome.toLowerCase().includes(q))
        : s.all,
    }))
  }, [searchQuery])

  function reload() {
    fetchPacientes()
  }

  return { ...state, reload }
}
