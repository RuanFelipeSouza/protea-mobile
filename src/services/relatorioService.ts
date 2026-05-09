import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { api } from './apiClient'
import { getToken } from './authService'

export type RelatorioPayload = {
  paciente_id: number
  data_inicio?: string | null
  data_fim?: string | null
}

export type TaskState = 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'RETRY'

export const relatorioService = {
  async iniciarRelatorio(payload: RelatorioPayload): Promise<string> {
    const { data } = await api.post<{ task_id: string }>('paciente/iniciarExportProntuario', payload)
    return data.task_id
  },

  async verificarStatus(taskId: string): Promise<{ ready: boolean; state: TaskState }> {
    const response = await api.get<any>('paciente/buscarExportProntuario', {
      params: { task_id: taskId },
      validateStatus: (s) => s < 500,
      responseType: 'arraybuffer',
    })

    if (response.status === 200) {
      return { ready: true, state: 'SUCCESS' }
    }

    try {
      const text = new TextDecoder().decode(new Uint8Array(response.data as ArrayBuffer))
      const json = JSON.parse(text)
      return { ready: false, state: (json.status as TaskState) ?? 'PENDING' }
    } catch {
      return { ready: false, state: 'PENDING' }
    }
  },

  async downloadEAbrirPdf(taskId: string, pacienteNome: string): Promise<void> {
    const token = await getToken()
    const baseUrl = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '')
    const url = `${baseUrl}/paciente/buscarExportProntuario?task_id=${encodeURIComponent(taskId)}`
    const nome = pacienteNome.toLowerCase().replace(/\s+/g, '-')
    const localUri = (FileSystem.documentDirectory ?? '') + `prontuario-${nome}.pdf`

    const result = await FileSystem.downloadAsync(url, localUri, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`,
        proteakey: process.env.EXPO_PUBLIC_PROTEA_KEY ?? '',
      },
    })

    if (result.status !== 200) {
      throw new Error('Erro ao baixar o PDF')
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Prontuário de ${pacienteNome}`,
      })
    }
  },
}
