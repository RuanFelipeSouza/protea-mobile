import { useState } from 'react'
import { assinaturaService } from '../services/assinaturaService'
import type { EvolucaoDetalhes } from '../types/mobile'

type State = {
  loading: boolean
  erro: string | null
  sucesso: boolean
  cpf: string | null
  certificadoHabilitado: boolean
}

const converterArquivo64 = async (arquivo: string): Promise<string> => {
  try {
    const response = await fetch(arquivo)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
    })
  } catch (err) {
    throw new Error('Erro ao converter arquivo')
  }
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

  const obterFileBase64 = async (evolucao: EvolucaoDetalhes): Promise<string> => {
    if (evolucao.file_data) {
      return evolucao.file_data
    }

    if (evolucao.arquivo) {
      return converterArquivo64(evolucao.arquivo)
    }

    if (evolucao.storage_url) {
      return converterArquivo64(evolucao.storage_url)
    }

    throw new Error('Arquivo para assinar não disponível')
  }

  const assinar = async (senha: string, evolucao: EvolucaoDetalhes) => {
    try {
      setState((prev) => ({ ...prev, loading: true, erro: null, sucesso: false }))

      if (!state.cpf) {
        throw new Error('CPF do certificado não carregado')
      }

      if (!evolucao.document_id) {
        throw new Error('ID do documento não disponível')
      }

      const fileBase64 = await obterFileBase64(evolucao)

      const tokenResp = await assinaturaService.autenticarCertificado(
        senha,
        state.cpf
      )

      const aliasResp = await assinaturaService.buscarCertificadoAlias(
        tokenResp.access_token
      )

      const signResp = await assinaturaService.assinarDocumento(
        tokenResp.access_token,
        aliasResp.certificates[0].alias,
        fileBase64
      )

      const dadosAssinatura = {
        tcn: signResp.tcn,
        documento_fk: evolucao.document_id,
        result: signResp.documents[0].result,
      }

      await assinaturaService.salvarDadosAssinatura(dadosAssinatura)

      setState((prev) => ({
        ...prev,
        loading: false,
        sucesso: true,
        erro: null,
      }))
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
