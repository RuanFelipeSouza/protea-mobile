import type { Patient } from '../types/patient';
import { api, proteaApi } from './apiClient';

type PacienteResponse = {
  id: number;
  nome: string;
  datanascimento?: string;
  imagem_url?: string;
  is_active?: boolean;
  cpf?: string;
  nomeresponsavel?: string;
};

function toPatient(p: PacienteResponse): Patient {
  return {
    id: String(p.id),
    nome: p.nome,
    datanascimento: p.datanascimento ?? null,
    avatarUrl: p.imagem_url,
    is_active: p.is_active ?? true,
    cpf: p.cpf,
    nomeresponsavel: p.nomeresponsavel,
  };
}

export const patientService = {
  /** Busca pacientes por texto livre (busca global, sem filtro de unidade). */
  async buscar(texto: string, signal?: AbortSignal): Promise<Patient[]> {
    const { data } = await api.post<PacienteResponse[]>(
      `api/core/paciente/allPaciente?texto=${encodeURIComponent(texto)}`,
      {},
      { signal },
    );
    return data.map(toPatient);
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
    const { data } = await proteaApi.get<PacienteResponse[]>(`api/mobile/prestador/unidade/${unidadeId}/pacientes`, {
      params: {
        ...(is_active !== undefined && { is_active }),
      },
      signal,
    });
    return data.map(toPatient);
  },

  /**
   * Ativa ou desativa um paciente.
   * Endpoint: POST paciente/togglePacienteStatus
   */
  async toggleStatus(id: number, is_active: boolean): Promise<void> {
    await api.post('api/core/paciente/togglePacienteStatus', { id, is_active });
  },

  /**
   * Remove um paciente permanentemente.
   * Endpoint: POST paciente/removerPaciente?data={id}
   */
  async remover(id: number): Promise<void> {
    await api.post(`api/core/paciente/removerPaciente?data=${id}`, {});
  },
};
