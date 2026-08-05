export interface ContagemAtendimentos {
  atendidos: number;
  agendados: number;
  faltas: number;
  cancelados: number;
}

export interface EspecialidadeResumo extends ContagemAtendimentos {
  especialidadeId: number;
  nome: string;
}

export interface ResumoAtendimentosPlano {
  planoCuidadoId: number;
  geral: ContagemAtendimentos;
  porEspecialidade: EspecialidadeResumo[];
  progressoTemporal: {
    dataInicio: string | null;
    dataPrevistaFim: string | null;
    percentualDecorrido: number | null;
  } | null;
}

export function totalAtendimentos(c: ContagemAtendimentos): number {
  return c.atendidos + c.agendados + c.faltas + c.cancelados;
}

export function percentualRealizado(c: ContagemAtendimentos): number {
  const total = totalAtendimentos(c);
  return total > 0 ? (c.atendidos / total) * 100 : 0;
}
