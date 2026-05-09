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
    '/seguranca/login',
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

  return data as LoginApiResponse
}
