import type { PacienteAuthResponse } from '../types/pacienteContextTypes';
import { api, HOST_PROTEA } from './apiClient';

const PROTEA_KEY = process.env.EXPO_PUBLIC_PROTEA_KEY ?? '';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const MOCK_LOGIN: PacienteAuthResponse = {
  token: 'mock-jwt-paciente-dev',
  paciente_id: 217,
  nome: 'ALAN VITOR DE ANDRADE PEREIRA',
  primeiro_acesso: false,
};

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  proteakey: PROTEA_KEY,
  ...HOST_PROTEA,
};

export async function pacienteLoginRequest(
  email: string,
  senha: string,
): Promise<PacienteAuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_LOGIN;
  }

  const { data } = await api.post<PacienteAuthResponse>(
    '/mobile/paciente/auth/login',
    { email, password: senha },
    { headers: AUTH_HEADERS },
  );

  if (!data.token) {
    throw new Error((data as any).mensagem ?? 'E-mail ou senha inválidos');
  }

  return data;
}

/** Verifica se o e-mail existe no cadastro. Não cria usuário. */
export async function pacienteVerificarEmail(email: string): Promise<PacienteAuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return { ...MOCK_LOGIN, token: '', primeiro_acesso: true };
  }

  const { data } = await api.post<PacienteAuthResponse>(
    '/mobile/paciente/auth/primeiro-acesso',
    { email },
    { headers: AUTH_HEADERS },
  );

  return data;
}

/** Cria a senha e retorna JWT pronto para uso. */
export async function pacienteDefinirSenha(
  email: string,
  senha: string,
): Promise<PacienteAuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_LOGIN;
  }

  const { data } = await api.post<PacienteAuthResponse>(
    '/mobile/paciente/auth/definir-senha',
    { email, senha, confirmar_senha: senha },
    { headers: AUTH_HEADERS },
  );

  if (!data.token) {
    throw new Error((data as any).mensagem ?? 'Não foi possível criar a senha');
  }

  return data;
}
