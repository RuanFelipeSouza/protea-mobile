import { useState, useCallback } from 'react'
import { evolucaoService } from '../services/evolucaoService'
import type { PerfilPaciente } from '../types/perfilPaciente'

export function usePerfilPaciente(pacienteId: string) {
  const [perfil, setPerfil] = useState<PerfilPaciente | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [carregado, setCarregado] = useState(false)

  const carregar = useCallback(() => {
    if (carregado || !pacienteId) return
    setCarregado(true)
    setLoading(true)
    evolucaoService
      .getPerfilPaciente(pacienteId)
      .then((data) => {
        setPerfil(data)
        setErro(null)
      })
      .catch((error) => {
        console.error('[usePerfilPaciente] erro:', error?.response?.status, error?.message)
        setErro('Erro ao carregar perfil')
      })
      .finally(() => setLoading(false))
  }, [pacienteId, carregado])

  return { perfil, loading, erro, carregar }
}
