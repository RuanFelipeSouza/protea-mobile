import { api } from './apiClient'

const PROTEA_KEY = process.env.EXPO_PUBLIC_PROTEA_KEY ?? ''
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'

export interface UserResponse {
  id: number
  is_superuser: boolean
  is_staff: boolean
  username: string
  first_name: string
  last_name: string
  password_reset: string | null
  prestador_id: number | null
  permissoes: string[] | null
}

export interface LoginApiResponse {
  token: string
  user: UserResponse
}

const MOCK_RESPONSE: LoginApiResponse = {
  token: 'mock-jwt-token-protea-dev',
  user: {
    id: 1,
    is_superuser: false,
    is_staff: true,
    username: 'profissional.teste',
    first_name: 'Ana',
    last_name: 'Silva',
    permissoes: [],
  },
}

export async function loginRequest(usuario: string, senha: string): Promise<LoginApiResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800))
    return MOCK_RESPONSE
  }

  const { data } = await api.post<LoginApiResponse & { mensagem?: string }>(
    '/api/core/seguranca/login',
    { username: usuario, password: senha },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        proteakey: PROTEA_KEY,
      },
    },
  )

  if (!data.token) {
    throw new Error(data.mensagem ?? 'Usuário ou senha inválidos')
  }

  console.log('[loginService] user recebido:', JSON.stringify(data.user, null, 2))

  return data as LoginApiResponse
}

export interface SolicitarCodigoResponse {
  sucesso: boolean
  mensagem: string
}

export interface ProfAuthResponse {
  token: string
  user: UserResponse | null
  mensagem?: string | null
}

const MOCK_SOLICITAR_CODIGO: SolicitarCodigoResponse = {
  sucesso: true,
  mensagem: 'Se o e-mail estiver cadastrado, você receberá um código.',
}

/**
 * Recuperação de senha do profissional — envia código OTP para o e-mail
 * cadastrado no usuário.
 *
 * ⚠️ Endpoint ainda não existe no backend (só o fluxo de paciente/responsável
 * foi implementado até agora). Contrato espelha o do paciente por consistência
 * — integrar assim que o backend disponibilizar.
 */
export async function profSolicitarCodigo(email: string): Promise<SolicitarCodigoResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500))
    return MOCK_SOLICITAR_CODIGO
  }

  const { data } = await api.post<SolicitarCodigoResponse>(
    '/api/core/seguranca/auth/solicitar-codigo',
    { email, proposito: 'recuperar_senha' },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        proteakey: PROTEA_KEY,
      },
    },
  )

  return data
}

/**
 * Recuperação de senha do profissional — valida o código OTP, troca a senha
 * e já devolve token + usuário prontos pra uso (não precisa logar de novo).
 *
 * ⚠️ Endpoint ainda não existe no backend — ver nota acima.
 */
export async function profRedefinirSenha(
  email: string,
  codigo: string,
  senha: string,
): Promise<ProfAuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800))
    return { token: MOCK_RESPONSE.token, user: MOCK_RESPONSE.user, mensagem: null }
  }

  const { data } = await api.post<ProfAuthResponse>(
    '/api/core/seguranca/auth/redefinir-senha',
    { email, codigo, password: senha },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        proteakey: PROTEA_KEY,
      },
    },
  )

  if (!data.token) {
    throw new Error(data.mensagem ?? 'Não foi possível redefinir a senha')
  }

  return data
}
