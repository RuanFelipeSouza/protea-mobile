import { useState, useEffect } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import { useUnidadeStore } from '../stores/unidadeStore'
import type { EvolucaoPendente } from '../types/evolucaoPendente'

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'

const MOCK_EVOLUCOES: EvolucaoPendente[] = [
  {
    id: 101,
    tipoevolucao: { id: 1, tipo: 'Fisioterapia' },
    evolucao: null,
    codigoAgendamento: 501,
    profissionalnome: 'Dra. Ana Lima',
    dataform: '29/04/2026',
    hora: '09:00',
    pacientenome: 'João da Silva',
    pacienteid: 1,
  },
  {
    id: 102,
    tipoevolucao: { id: 2, tipo: 'Nutrição' },
    evolucao: null,
    codigoAgendamento: 502,
    profissionalnome: 'Dr. Pedro Alves',
    dataform: '29/04/2026',
    hora: '10:30',
    pacientenome: 'Maria Oliveira',
    pacienteid: 2,
  },
  {
    id: 103,
    tipoevolucao: { id: 3, tipo: 'Psicologia' },
    evolucao: '   ',
    codigoAgendamento: 503,
    profissionalnome: 'Dra. Carla Santos',
    dataform: '28/04/2026',
    hora: '14:00',
    pacientenome: 'Carlos Ferreira',
    pacienteid: 3,
  },
  {
    id: 104,
    tipoevolucao: { id: 1, tipo: 'Fisioterapia' },
    evolucao: null,
    codigoAgendamento: 504,
    profissionalnome: 'Dra. Ana Lima',
    dataform: '28/04/2026',
    hora: '15:30',
    pacientenome: 'Beatriz Costa',
    pacienteid: 4,
  },
  {
    id: 105,
    tipoevolucao: { id: 4, tipo: 'Fonoaudiologia' },
    evolucao: null,
    codigoAgendamento: null,
    profissionalnome: 'Dr. Marcos Rocha',
    dataform: '27/04/2026',
    hora: '08:00',
    pacientenome: 'Lucas Mendes',
    pacienteid: 5,
  },
]

export function useEvolucoesPendentes() {
  const unidade = useUnidadeStore((s) => s.selecionada)
  const [evolucoes, setEvolucoes] = useState<EvolucaoPendente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    // Sem unidade não dispara request; o componente pai mostrará empty state.
    if (!unidade) {
      setEvolucoes([])
      setLoading(false)
      setErro(null)
      return
    }

    if (USE_MOCK) {
      setLoading(true)
      const t = setTimeout(() => {
        setEvolucoes(MOCK_EVOLUCOES)
        setLoading(false)
      }, 600)
      return () => clearTimeout(t)
    }

    setLoading(true)
    evolucaoService
      .getEvolucoesPendentes()
      .then((data) => {
        setEvolucoes(data)
        setErro(null)
      })
      .catch((error) => {
        console.error('[useEvolucoesPendentes] erro:', error?.message)
        setErro('Erro ao carregar evoluções pendentes')
      })
      .finally(() => setLoading(false))
  }, [unidade?.id])

  return { evolucoes, loading, erro }
}
