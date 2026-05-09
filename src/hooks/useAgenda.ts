import { useEffect, useState } from 'react';
import { agendaService } from '../services/agendaService';
import { useUnidadeStore } from '../stores/unidadeStore';
import type { AgendaItem } from '../types/agenda';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const MOCK_AGENDA: AgendaItem[] = [
  {
    id: 1,
    data: '2026-04-29',
    hora: '09:00',
    categoria: 'Fisioterapia',
    profissional: 'Dra. Ana Lima',
    especialidade: 'Fisioterapia',
    nome: 'João da Silva',
    telefone: '',
    email: '',
    status: 'Agendado',
    sala: 'Sala 1',
    cor: '#4CAF50',
    unidade: 1,
    substituicao: false,
    id_agendamento_plano_cuidado: null,
    planodecuidadofk_id: null,
  },
  {
    id: 2,
    data: '2026-04-29',
    hora: '10:00',
    categoria: 'Nutrição',
    profissional: 'Dr. Pedro Alves',
    especialidade: 'Nutrição',
    nome: 'Maria Oliveira',
    telefone: '',
    email: '',
    status: 'Atendido',
    sala: 'Sala 2',
    cor: '#2196F3',
    unidade: 1,
    substituicao: false,
    id_agendamento_plano_cuidado: null,
    planodecuidadofk_id: null,
  },
  {
    id: 3,
    data: '2026-04-29',
    hora: '11:30',
    categoria: 'Psicologia',
    profissional: 'Dra. Carla Santos',
    especialidade: 'Psicologia',
    nome: 'Carlos Ferreira',
    telefone: '',
    email: '',
    status: 'Falta',
    sala: 'Sala 3',
    cor: '#9C27B0',
    unidade: 1,
    substituicao: false,
    id_agendamento_plano_cuidado: null,
    planodecuidadofk_id: null,
  },
  {
    id: 4,
    data: '2026-04-29',
    hora: '14:00',
    categoria: 'Fisioterapia',
    profissional: 'Dra. Ana Lima',
    especialidade: 'Fisioterapia',
    nome: 'Beatriz Costa',
    telefone: '',
    email: '',
    status: 'Agendado',
    sala: 'Sala 1',
    cor: '#4CAF50',
    unidade: 1,
    substituicao: false,
    id_agendamento_plano_cuidado: null,
    planodecuidadofk_id: null,
  },
  {
    id: 5,
    data: '2026-04-29',
    hora: '15:30',
    categoria: 'Fonoaudiologia',
    profissional: 'Dr. Marcos Rocha',
    especialidade: 'Fonoaudiologia',
    nome: 'Lucas Mendes',
    telefone: '',
    email: '',
    status: 'Atendido',
    sala: 'Sala 4',
    cor: '#FF5722',
    unidade: 1,
    substituicao: false,
    id_agendamento_plano_cuidado: null,
    planodecuidadofk_id: null,
  },
  {
    id: 6,
    data: '2026-04-29',
    hora: '16:00',
    categoria: 'Fisioterapia',
    profissional: 'Dra. Ana Lima',
    especialidade: 'Fisioterapia',
    nome: 'Julia Pereira',
    telefone: '',
    email: '',
    status: 'Agendado',
    sala: 'Sala 1',
    cor: '#4CAF50',
    unidade: 1,
    substituicao: false,
    id_agendamento_plano_cuidado: null,
    planodecuidadofk_id: null,
  },
];

export function useAgenda(date: string) {
  const unidade = useUnidadeStore((s) => s.selecionada);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Sem unidade não dispara request; UnidadeRequired bloqueia o render.
    if (!unidade) {
      setAgenda([]);
      setLoading(false);
      setErro(null);
      return;
    }

    setLoading(true);
    setErro(null);

    if (USE_MOCK) {
      const t = setTimeout(() => {
        setAgenda(MOCK_AGENDA.filter((a) => a.data === date));
        setLoading(false);
      }, 400);
      return () => clearTimeout(t);
    }

    agendaService
      .getAgenda({ unidade: unidade.id, data: date })
      .then((data) => {
        setAgenda(data);
        setErro(null);
      })
      .catch((e) => {
        console.error('[useAgenda] getAgenda erro:', e?.message);
        setErro('Erro ao carregar agenda');
      })
      .finally(() => setLoading(false));
  }, [date, unidade?.id]);

  return { agenda, loading, erro };
}
