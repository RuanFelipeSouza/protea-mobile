import { useState } from 'react'
import { assinaturaService } from '../services/assinaturaService'

type State = {
  loading: boolean
  erro: string | null
  sucesso: boolean
  cpf: string | null
  certificadoHabilitado: boolean
}

export function useAssinaturaCertificada() {
  const [state, setState] = useState<State>({
    loading: false,
    erro: null,
    sucesso: false,
    cpf: null,
    certificadoHabilitado: false,
  })

  const carregarCertificado = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, erro: null }))
      const info = await assinaturaService.getCertificadoInfo()
      setState((prev) => ({
        ...prev,
        cpf: info.cpf,
        certificadoHabilitado: info.habilitar,
        loading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        erro: 'Falha ao carregar dados do certificado',
        loading: false,
      }))
    }
  }

  const assinar = async (senha: string, evolucaoId: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, erro: null, sucesso: false }))

      const resp = await assinaturaService.assinarEvolucao(senha, evolucaoId)

      if (resp.success) {
        setState((prev) => ({
          ...prev,
          loading: false,
          sucesso: true,
          erro: null,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          sucesso: false,
          erro: resp.erro,
        }))
      }
    } catch (err) {
      const mensagem =
        err instanceof Error ? err.message : 'Erro ao assinar documento'
      setState((prev) => ({
        ...prev,
        loading: false,
        erro: mensagem,
        sucesso: false,
      }))
    }
  }

  const resetar = () => {
    setState((prev) => ({
      ...prev,
      sucesso: false,
      erro: null,
    }))
  }

  return {
    ...state,
    assinar,
    carregarCertificado,
    resetar,
  }
}
