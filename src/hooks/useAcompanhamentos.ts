import { useState, useEffect } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import type { Acompanhamento } from '../types/acompanhamento'

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'

const MOCK_ACOMPANHAMENTOS: Acompanhamento[] = [
  {
    codigo: '6',
    data: '2026-04-10',
    datastr: '10/04/2026',
    hora: '09:00',
    peso: '34.2',
    altura: '115',
    pasistolica: '100',
    padiastolica: '65',
    freqcard: '88',
    freqresp: '18',
    tempcorporal: '36.7',
    saturacao: '98',
    hgt: '',
    circabdominal: '55',
    perimetrocefalico: '52',
    observacoes: 'Paciente colaborativo durante medição.',
    nomeprofissional: 'Dra. Ana Lima',
  },
  {
    codigo: '5',
    data: '2026-03-12',
    datastr: '12/03/2026',
    hora: '10:30',
    peso: '33.8',
    altura: '114',
    pasistolica: '98',
    padiastolica: '62',
    freqcard: '90',
    freqresp: '20',
    tempcorporal: '36.5',
    saturacao: '97',
    hgt: '',
    circabdominal: '54',
    perimetrocefalico: '52',
    observacoes: '',
    nomeprofissional: 'Dr. Pedro Alves',
  },
  {
    codigo: '4',
    data: '2026-02-05',
    datastr: '05/02/2026',
    hora: '08:45',
    peso: '33.1',
    altura: '113',
    pasistolica: '95',
    padiastolica: '60',
    freqcard: '92',
    freqresp: '19',
    tempcorporal: '36.6',
    saturacao: '98',
    hgt: '',
    circabdominal: '53',
    perimetrocefalico: '51',
    observacoes: '',
    nomeprofissional: 'Dra. Ana Lima',
  },
  {
    codigo: '3',
    data: '2026-01-08',
    datastr: '08/01/2026',
    hora: '09:15',
    peso: '32.5',
    altura: '112',
    pasistolica: '94',
    padiastolica: '60',
    freqcard: '94',
    freqresp: '20',
    tempcorporal: '36.4',
    saturacao: '99',
    hgt: '',
    circabdominal: '52',
    perimetrocefalico: '51',
    observacoes: 'Crescimento dentro do esperado.',
    nomeprofissional: 'Dra. Ana Lima',
  },
  {
    codigo: '2',
    data: '2025-11-20',
    datastr: '20/11/2025',
    hora: '11:00',
    peso: '31.9',
    altura: '111',
    pasistolica: '92',
    padiastolica: '58',
    freqcard: '96',
    freqresp: '21',
    tempcorporal: '36.8',
    saturacao: '97',
    hgt: '',
    circabdominal: '51',
    perimetrocefalico: '50',
    observacoes: '',
    nomeprofissional: 'Dr. Pedro Alves',
  },
  {
    codigo: '1',
    data: '2025-09-03',
    datastr: '03/09/2025',
    hora: '08:30',
    peso: '30.4',
    altura: '109',
    pasistolica: '90',
    padiastolica: '55',
    freqcard: '98',
    freqresp: '22',
    tempcorporal: '36.5',
    saturacao: '98',
    hgt: '',
    circabdominal: '50',
    perimetrocefalico: '50',
    observacoes: 'Primeira medição registrada no sistema.',
    nomeprofissional: 'Dra. Ana Lima',
  },
]

export function useAcompanhamentos(pacienteId: string) {
  const [acompanhamentos, setAcompanhamentos] = useState<Acompanhamento[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!pacienteId) return

    if (USE_MOCK) {
      setTimeout(() => {
        setAcompanhamentos(MOCK_ACOMPANHAMENTOS)
        setLoading(false)
      }, 600)
      return
    }

    setLoading(true)
    evolucaoService
      .getAcompanhamentos(pacienteId)
      .then((data) => {
        setAcompanhamentos(data)
        setErro(null)
      })
      .catch((error) => {
        console.error('[useAcompanhamentos] erro:', error?.response?.status, error?.message)
        setErro('Erro ao carregar acompanhamentos')
      })
      .finally(() => setLoading(false))
  }, [pacienteId])

  return { acompanhamentos, loading, erro }
}
