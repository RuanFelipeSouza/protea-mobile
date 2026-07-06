import type { FolhaRegistroAtendimento, Resultado } from './folhaRegistro';

export const TENTATIVAS_POR_FOLHA = 10;

export type Option = { id: number; descricao: string };
export type AlvoOption = { id: number; programa_id: number; descricao: string };
export type ProgramaOption = {
  id: number;
  descricao: string;
  dominio_id: number;
  alvoslimite: number;
};

/** Registro JÁ GRAVADO, com ids (só no modo edição). Reidrata o editor. */
export type RegistroSalvo = {
  ordem: number;
  dominio_id: number;
  programa_id: number;
  ajuda_id: number;
  observacao: string | null;
  /** CSV dos alvos selecionados (mesmo formato do web). */
  alvo: string;
  alvoslimite: number;
  tentativas: { numero: number; alvo: string | null; resultado: Resultado }[];
};

export type FolhaRegistroConfig = {
  /** false ⇒ evolução sem plano de cuidado (config vem vazia, não dá p/ preencher). */
  tem_plano_cuidado?: boolean;
  atendimento: FolhaRegistroAtendimento;
  dominios: Option[];
  programas: ProgramaOption[];
  alvos: AlvoOption[];
  ajudas: Option[];
  /** Presente apenas no modo edição. */
  registros?: RegistroSalvo[];
};

export type TentativaEditor = {
  numero: number;
  alvo: string | null;
  resultado: Resultado;
};

export type FolhaEditorItem = {
  uid: string;
  ordem: number;
  dominioId: number | null;
  programaId: number | null;
  ajudaId: number | null;
  observacao: string;
  /** Descrições dos alvos selecionados na folha. */
  alvosSelecionados: string[];
  tentativas: TentativaEditor[];
};

export type SalvarFolhaRegistroPayload = {
  evolucao_id: number;
  registros: {
    ordem: number;
    dominio_id: number;
    programa_id: number;
    ajuda_id: number;
    observacao: string;
    alvo: string;
    alvoslimite: number;
    tentativas: { numero: number; resultado: number | null; alvo: string | null }[];
  }[];
};
