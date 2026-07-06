import axios from 'axios'
import { getPatientToken, removePatientToken } from './pacienteAuthService'
import { usePacienteAuthStore } from '../stores/pacienteAuthStore'
import type {
  AgendamentoPaciente,
  EvolucaoPaciente,
  EvolucaoPacienteDetalhe,
  GardenStatusPaciente,
  PerfilPacienteContexto,
} from '../types/pacienteContextTypes'

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'
const PROTEA_KEY = process.env.EXPO_PUBLIC_PROTEA_KEY ?? ''
const PROTEA_HOST = process.env.EXPO_PUBLIC_PROTEA_HOST

function createPacienteApi() {
  const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL ?? '',
    timeout: 25000,
    headers: PROTEA_HOST ? { Host: PROTEA_HOST } : {},
  })

  instance.interceptors.request.use(async (config) => {
    const token = await getPatientToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    config.headers['proteakey'] = PROTEA_KEY
    return config
  })

  instance.interceptors.response.use(
    (r) => r,
    async (error) => {
      if (error.response?.status === 401) {
        await removePatientToken()
        usePacienteAuthStore.getState().logout()
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export const pacienteApi = createPacienteApi()

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_AGENDAMENTOS_FUTUROS: AgendamentoPaciente[] = [
  {
    id: 'a1',
    data: '02/06/2026',
    diaSemana: 'Terça',
    hora: '08:00',
    modalidade: 'Fonoaudiologia',
    profissional: 'Milena Gomes Santos',
    local: 'Protea Vitória · Sala 3',
    status: 'confirmado',
  },
  {
    id: 'a2',
    data: '05/06/2026',
    diaSemana: 'Sexta',
    hora: '09:30',
    modalidade: 'Terapia Ocupacional',
    profissional: 'Rafael Lopes Dias',
    local: 'Protea Vitória · Sala 1',
    status: 'agendado',
  },
  {
    id: 'a3',
    data: '12/06/2026',
    diaSemana: 'Sexta',
    hora: '14:00',
    modalidade: 'Psicologia',
    profissional: 'Carla Menezes',
    local: 'Protea Vitória · Sala 5',
    status: 'agendado',
  },
]

const MOCK_AGENDAMENTOS_PASSADOS: AgendamentoPaciente[] = [
  {
    id: 'p1',
    data: '20/05/2026',
    diaSemana: 'Terça',
    hora: '08:00',
    modalidade: 'Fonoaudiologia',
    profissional: 'Milena Gomes Santos',
    status: 'realizado',
  },
  {
    id: 'p2',
    data: '17/05/2026',
    diaSemana: 'Sábado',
    hora: '09:30',
    modalidade: 'Terapia Ocupacional',
    profissional: 'Rafael Lopes Dias',
    status: 'realizado',
  },
  {
    id: 'p3',
    data: '13/05/2026',
    diaSemana: 'Terça',
    hora: '08:00',
    modalidade: 'Fonoaudiologia',
    profissional: 'Milena Gomes Santos',
    status: 'falta',
  },
]

const MOCK_EVOLUCOES: EvolucaoPaciente[] = [
  {
    id: '405600',
    tipo: 'Atendimento',
    modalidade: 'Fonoaudiologia',
    profissional: 'Milena Gomes Santos',
    data: '20/05/2026',
    hora: '08:00',
  },
  {
    id: '405571',
    tipo: 'Atendimento',
    modalidade: 'Terapia Ocupacional',
    profissional: 'Rafael Lopes Dias',
    data: '17/05/2026',
    hora: '09:30',
  },
  {
    id: '405502',
    tipo: 'Avaliação',
    modalidade: 'Psicologia',
    profissional: 'Carla Menezes',
    data: '12/05/2026',
    hora: '14:00',
  },
  {
    id: '405410',
    tipo: 'Atendimento',
    modalidade: 'Fonoaudiologia',
    profissional: 'Milena Gomes Santos',
    data: '06/05/2026',
    hora: '08:00',
  },
]

const MOCK_DETALHE: EvolucaoPacienteDetalhe = {
  ...MOCK_EVOLUCOES[0],
  objetivo:
    'Estimular a produção dos fonemas /r/ e /l/ em sílabas e palavras, com foco em consciência fonológica e ampliação do vocabulário expressivo.',
  conduta:
    'Realizadas atividades lúdicas de nomeação e jogos de pareamento. Boa adesão e participação ao longo de toda a sessão; manteve atenção sustentada nas tarefas propostas.',
  orientacoes:
    'Praticar as palavras-alvo durante a rotina diária (banho, refeições) por 10 minutos, de forma leve e sem cobrança. Trazer o caderno de atividades na próxima sessão.',
}

const MOCK_PERFIL: PerfilPacienteContexto = {
  id: 217,
  nome: 'ALAN VITOR DE ANDRADE PEREIRA',
  datanascimento: '16/06/2018',
  idade: 7,
  sexo: 'Masculino',
  cpf: '000.000.000-00',
  cns: '-',
  nomeresponsavel: 'ADRIANA DE ANDRADE BELO RAMOS',
  email: 'adriana.ramos@email.com',
  telefone: '(27)99661795',
}

// ─── Service functions ────────────────────────────────────────────────────────
//
// O backend (mobile.paciente) já devolve DTOs prontos para a UI — datas em
// DD/MM/YYYY, status normalizado e a separação futuros/passados. Não há mais
// remapeamento de campos crus aqui; consumimos a resposta diretamente.

export async function getPacienteAgendamentos(): Promise<{
  futuros: AgendamentoPaciente[]
  passados: AgendamentoPaciente[]
}> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    return { futuros: MOCK_AGENDAMENTOS_FUTUROS, passados: MOCK_AGENDAMENTOS_PASSADOS }
  }

  const { data } = await pacienteApi.get<{
    futuros: AgendamentoPaciente[]
    passados: AgendamentoPaciente[]
  }>('/mobile/paciente/meus-atendimentos')

  return {
    futuros: data?.futuros ?? [],
    passados: data?.passados ?? [],
  }
}

export async function getPacienteEvolucoes(): Promise<EvolucaoPaciente[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    return MOCK_EVOLUCOES
  }

  const { data } = await pacienteApi.get<EvolucaoPaciente[]>('/mobile/paciente/minhas-evolucoes')
  return Array.isArray(data) ? data : []
}

export async function getPacienteEvolucaoDetalhe(
  evolucaoId: string | number,
): Promise<EvolucaoPacienteDetalhe> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return { ...MOCK_DETALHE, id: evolucaoId }
  }

  const pacienteId = usePacienteAuthStore.getState().pacienteId
  if (!pacienteId) {
    throw new Error('Sessão do paciente não encontrada')
  }

  const { data } = await pacienteApi.get<EvolucaoPacienteDetalhe>(
    `/mobile/paciente/${pacienteId}/evolucoes/${evolucaoId}`,
  )
  return data
}

export async function getPacienteGarden(): Promise<GardenStatusPaciente | null> {
  try {
    const response = await pacienteApi.get<GardenStatusPaciente>('/mobile/paciente/meu-garden')
    return response.data ?? null
  } catch {
    return null
  }
}

export async function getPacientePerfilContexto(
  pacienteId: number,
): Promise<PerfilPacienteContexto> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return MOCK_PERFIL
  }

  const { data } = await pacienteApi.get<PerfilPacienteContexto>(
    `/mobile/paciente/${pacienteId}/perfil`,
  )
  return data
}
