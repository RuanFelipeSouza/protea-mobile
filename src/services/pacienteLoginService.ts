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
    '/api/mobile/paciente/auth/login',
    { email, password: senha },
    { headers: AUTH_HEADERS },
  );

  if (!data.token) {
    throw new Error((data as any).mensagem ?? 'E-mail ou senha inválidos');
  }

  return data;
}

export interface SolicitarCodigoResponse {
  sucesso: boolean;
  mensagem: string;
}

/**
 * Etapa 1 do primeiro acesso: envia um código OTP para o e-mail cadastrado.
 * Por segurança o backend sempre responde de forma genérica (não revela se o
 * e-mail existe). Não cria usuário.
 */
export async function pacienteSolicitarCodigo(email: string): Promise<SolicitarCodigoResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return { sucesso: true, mensagem: 'Se o email estiver cadastrado, você receberá um código.' };
  }

  const { data } = await api.post<SolicitarCodigoResponse>(
    '/api/mobile/paciente/auth/solicitar-codigo',
    { email },
    { headers: AUTH_HEADERS },
  );

  return data;
}

/**
 * Etapa 2 do primeiro acesso: valida o código OTP, cria a conta com a senha
 * informada e retorna o JWT pronto para uso.
 */
export async function pacienteConfirmarCodigo(
  email: string,
  codigo: string,
  senha: string,
): Promise<PacienteAuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_LOGIN;
  }

  const { data } = await api.post<PacienteAuthResponse>(
    '/api/mobile/paciente/auth/confirmar-codigo',
    { email, codigo, password: senha },
    { headers: AUTH_HEADERS },
  );

  if (!data.token) {
    throw new Error((data as any).mensagem ?? 'Código inválido ou expirado');
  }

  return data;
}
