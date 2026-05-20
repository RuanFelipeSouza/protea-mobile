import { useState, useEffect } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import { useUnidadeStore } from '../stores/unidadeStore'
import type { EvolucaoPendente, EvolucaoStatusType } from '../types/evolucaoPendente'

export function useEvolucoesPendentes() {
  const unidade = useUnidadeStore((s) => s.selecionada)
  const [todasEvolucoes, setTodasEvolucoes] = useState<EvolucaoPendente[]>([])
  const [evolucoes, setEvolucoes] = useState<EvolucaoPendente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [statusSelecionado, setStatusSelecionado] = useState<EvolucaoStatusType | null>(null)
  const [statusDisponiveis, setStatusDisponiveis] = useState<EvolucaoStatusType[]>([])

  useEffect(() => {
    // Sem unidade não dispara request; o componente pai mostrará empty state.
    if (!unidade) {
      setEvolucoes([])
      setTodasEvolucoes([])
      setLoading(false)
      setErro(null)
      setStatusDisponiveis([])
      return
    }

    setLoading(true)
    evolucaoService
      .getEvolucoesPendentes(unidade.id)
      .then((data) => {
        setTodasEvolucoes(data)
        setEvolucoes(data)
        setErro(null)

        const statusUnicos = Array.from(new Set(data.map((e) => e.status)))
        setStatusDisponiveis(statusUnicos)
        setStatusSelecionado(null)
      })
      .catch((error) => {
        console.error('[useEvolucoesPendentes] erro:', error?.message)
        setErro('Erro ao carregar evoluções')
      })
      .finally(() => setLoading(false))
  }, [unidade?.id])

  const setStatusFiltro = (status: EvolucaoStatusType | null) => {
    setStatusSelecionado(status)
    if (status === null) {
      setEvolucoes(todasEvolucoes)
    } else {
      setEvolucoes(todasEvolucoes.filter((e) => e.status === status))
    }
  }

  return { evolucoes, loading, erro, statusSelecionado, statusDisponiveis, setStatusFiltro }
}
