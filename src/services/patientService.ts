import { api } from './apiClient'
import type { Patient } from '../types/patient'

type PacienteResponse = {
  id: number
  nome: string
  datanasc: string
  imagem_url?: string
  is_active?: boolean
  cpf?: string
  nomemae?: string
  sexo?: { sexo: string }
}

function toPatient(p: PacienteResponse): Patient {
  return {
    id: String(p.id),
    nome: p.nome,
    datanasc: p.datanasc ?? null,
    avatarUrl: p.imagem_url,
    is_active: p.is_active ?? true,
    cpf: p.cpf,
    nomemae: p.nomemae,
    sexo: p.sexo?.sexo,
  }
}

export const patientService = {
  /** Busca pacientes por texto livre (busca global, sem filtro de unidade). */
  async buscar(texto: string, signal?: AbortSignal): Promise<Patient[]> {
    const { data } = await api.post<PacienteResponse[]>(
      `paciente/allPaciente?texto=${encodeURIComponent(texto)}`,
      {},
      { signal },
    )
    return data.map(toPatient)
  },

  /**
   * Retorna pacientes vinculados a uma unidade específica.
   * is_active=true  → só ativos (padrão)
   * is_active=false → só inativos
   * is_active=undefined → todos
   */
  async buscarPorUnidade(
    unidadeId: number,
    is_active?: boolean,
    signal?: AbortSignal,
  ): Promise<Patient[]> {
    const { data } = await api.get<PacienteResponse[]>(`paciente/mobile/pacientes`, {
      params: {
        unidade_id: unidadeId,
        ...(is_active !== undefined && { is_active }),
      },
      signal,
    })
    return data.map(toPatient)
  },

  /**
   * Ativa ou desativa um paciente.
   * Endpoint: POST paciente/togglePacienteStatus
   */
  async toggleStatus(id: number, is_active: boolean): Promise<void> {
    await api.post('paciente/togglePacienteStatus', { id, is_active })
  },

  /**
   * Remove um paciente permanentemente.
   * Endpoint: POST paciente/removerPaciente?data={id}
   */
  async remover(id: number): Promise<void> {
    await api.post(`paciente/removerPaciente?data=${id}`, {})
  },
}
