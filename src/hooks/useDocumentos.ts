import { useState, useEffect } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import type { DocumentoEvolucao } from '../types/documento'

export function useDocumentos(pacienteId: string) {
  const [documentos, setDocumentos] = useState<DocumentoEvolucao[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!pacienteId) return
    setLoading(true)
    evolucaoService
      .getDocumentos(pacienteId)
      .then((data) => {
        setDocumentos(data)
        setErro(null)
      })
      .catch((error) => {
        console.error('[useDocumentos] erro:', error?.response?.status, error?.message)
        setErro('Erro ao carregar documentos')
      })
      .finally(() => setLoading(false))
  }, [pacienteId])

  return { documentos, loading, erro }
}
