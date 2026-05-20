import { useEffect, useState } from 'react'
import { mobileService } from '../services/mobileService'
import type { EvolucaoMobile, EvolucaoStatus } from '../types/mobile'

type State = {
  todasEvolucoes: EvolucaoMobile[]
  evolucoes: EvolucaoMobile[]
  loading: boolean
  erro: string | null
  statusSelecionado: EvolucaoStatus | null
  statusDisponiveis: EvolucaoStatus[]
}

export function useEvolucoesDoPaciente(unidadeId: number, pacienteId: number) {
  const [state, setState] = useState<State>({
    todasEvolucoes: [],
    evolucoes: [],
    loading: false,
    erro: null,
    statusSelecionado: null,
    statusDisponiveis: [],
  })

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, evolucoes: [], loading: true, erro: null }))

    mobileService
      .getEvolucoesDoPaciente(unidadeId, pacienteId, controller.signal)
      .then((todasEvolucoes) => {
        const statusUnicos = Array.from(new Set(todasEvolucoes.map((e) => e.status)))
        setState({
          todasEvolucoes,
          evolucoes: todasEvolucoes,
          loading: false,
          erro: null,
          statusSelecionado: null,
          statusDisponiveis: statusUnicos,
        })
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return
        console.error('[useEvolucoesDoPaciente] erro:', err?.message)
        setState((prev) => ({
          ...prev,
          evolucoes: [],
          loading: false,
          erro: 'Erro ao carregar evoluções',
        }))
      })

    return () => controller.abort()
  }, [unidadeId, pacienteId])

  const setStatusFiltro = (status: EvolucaoStatus | null) => {
    setState((prev) => {
      const evolucoesFiltradas =
        status === null
          ? prev.todasEvolucoes
          : prev.todasEvolucoes.filter((e) => e.status === status)

      return {
        ...prev,
        statusSelecionado: status,
        evolucoes: evolucoesFiltradas,
      }
    })
  }

  return {
    evolucoes: state.evolucoes,
    loading: state.loading,
    erro: state.erro,
    statusSelecionado: state.statusSelecionado,
    statusDisponiveis: state.statusDisponiveis,
    setStatusFiltro,
  }
}
