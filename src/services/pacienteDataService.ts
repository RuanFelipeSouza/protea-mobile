import axios from 'axios'
import { getPatientToken, removePatientToken } from './pacienteAuthService'
import { usePacienteAuthStore } from '../stores/pacienteAuthStore'
import type {
  AgendamentoStatus,
  AgendamentoPaciente,
  EvolucaoPaciente,
  EvolucaoPacienteDetalhe,
  PerfilPacienteContexto,
} from '../types/pacienteContextTypes'

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'
const PROTEA_KEY = process.env.EXPO_PUBLIC_PROTEA_KEY ?? ''
const PROTEA_HOST = process.env.EXPO_PUBLIC_PROTEA_HOST

function createPacienteApi() {
  const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL ?? '',
    timeout: 25000,
    headers: { Host: PROTEA_HOST ?? 'localhost' },
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

// ─── Date helpers ─────────────────────────────────────────────────────────────

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function isoToDMY(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function diaSemanaOf(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return DIAS[new Date(y, m - 1, d).getDay()] ?? ''
}

function mapStatus(s: string | null | undefined): AgendamentoStatus {
  const slug = (s ?? '').toLowerCase()
  if (slug.includes('realizado') || slug.includes('atendido')) return 'realizado'
  if (slug.includes('falta') || slug.includes('ausente')) return 'falta'
  if (slug.includes('confirmado')) return 'confirmado'
  return 'agendado'
}

function mapAgendamento(raw: any): AgendamentoPaciente {
  const today = new Date()
  const dataISO: string = raw.data ?? ''
  const [y, m, d] = dataISO.split('-').map(Number)
  const isPassado = dataISO ? new Date(y, m - 1, d) < today : false
  return {
    id: raw.id,
    data: dataISO ? isoToDMY(dataISO) : '',
    diaSemana: dataISO ? diaSemanaOf(dataISO) : '',
    hora: raw.hora ?? '',
    modalidade: raw.modalidade ?? raw['especialidade__especialidade'] ?? '',
    profissional: raw['profissional__nome'] ?? '',
    local: raw['unidadeId__unidade'] ?? null,
    status: mapStatus(raw['status__status']),
    _isPassado: isPassado,
  } as any
}

function toArray(data: unknown): any[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.results)) return d.results
    if (Array.isArray(d.atendimentos)) return d.atendimentos
    if (Array.isArray(d.evolucoes)) return d.evolucoes
  }
  return []
}

function mapEvolucao(raw: any): EvolucaoPaciente {
  return {
    id: raw.id,
    tipo: raw['tipoevolucao__tipo'] ?? 'Atendimento',
    modalidade: raw['unidade__unidade'] ?? '',
    profissional: raw['profissional__nome'] ?? '',
    data: raw.data ? isoToDMY(raw.data) : '',
    hora: raw.hora ?? '',
  }
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function getPacienteAgendamentos(): Promise<{
  futuros: AgendamentoPaciente[]
  passados: AgendamentoPaciente[]
}> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    return { futuros: MOCK_AGENDAMENTOS_FUTUROS, passados: MOCK_AGENDAMENTOS_PASSADOS }
  }

  const { data } = await pacienteApi.get('/mobile/paciente/meus-atendimentos')
  const mapped = toArray(data).map(mapAgendamento)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const futuros = mapped.filter((a) => {
    const [d, m, y] = (a.data as string).split('/').map(Number)
    return new Date(y, m - 1, d) >= today
  })
  const passados = mapped.filter((a) => {
    const [d, m, y] = (a.data as string).split('/').map(Number)
    return new Date(y, m - 1, d) < today
  })
  return { futuros, passados }
}

export async function getPacienteEvolucoes(): Promise<EvolucaoPaciente[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    return MOCK_EVOLUCOES
  }

  const { data } = await pacienteApi.get('/mobile/paciente/minhas-evolucoes')
  return toArray(data).map(mapEvolucao)
}

export async function getPacienteEvolucaoDetalhe(
  evolucaoId: string | number,
): Promise<EvolucaoPacienteDetalhe> {
  // backend endpoint not yet implemented — always uses mock
  await new Promise((r) => setTimeout(r, 400))
  return { ...MOCK_DETALHE, id: evolucaoId }
}

export async function getPacientePerfilContexto(
  pacienteId: number,
): Promise<PerfilPacienteContexto> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return MOCK_PERFIL
  }

  const { data } = await pacienteApi.get(`/mobile/paciente/${pacienteId}/perfil`)
  return data
}
