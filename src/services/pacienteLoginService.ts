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

export type PropositoCodigo = 'primeiro_acesso' | 'recuperar_senha';

/**
 * Envia um código OTP para o e-mail cadastrado — mesmo endpoint serve o
 * primeiro acesso (cria conta) e a recuperação de senha (conta existente),
 * diferenciados pelo campo `proposito`. Por segurança o backend sempre
 * responde de forma genérica (não revela se o e-mail existe).
 */
export async function pacienteSolicitarCodigo(
  email: string,
  proposito: PropositoCodigo = 'primeiro_acesso',
): Promise<SolicitarCodigoResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return { sucesso: true, mensagem: 'Se o email estiver cadastrado, você receberá um código.' };
  }

  const { data } = await api.post<SolicitarCodigoResponse>(
    '/api/mobile/paciente/auth/solicitar-codigo',
    { email, proposito },
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

/**
 * Recuperação de senha: valida o código OTP (proposito=recuperar_senha),
 * troca a senha da conta existente e já devolve o JWT pronto para uso —
 * igual ao confirmar-codigo, não precisa logar de novo depois.
 */
export async function pacienteRedefinirSenha(
  email: string,
  codigo: string,
  senha: string,
): Promise<PacienteAuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_LOGIN;
  }

  const { data } = await api.post<PacienteAuthResponse>(
    '/api/mobile/paciente/auth/redefinir-senha',
    { email, codigo, password: senha },
    { headers: AUTH_HEADERS },
  );

  if (!data.token) {
    throw new Error((data as any).mensagem ?? 'Não foi possível redefinir a senha');
  }

  return data;
}
