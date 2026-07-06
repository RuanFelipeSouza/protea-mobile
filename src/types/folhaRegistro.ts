/**
 * Tipos da Folha de Registro (somente leitura no mobile).
 *
 * ⚠️ Este é o formato que a TELA precisa receber — a folha JÁ PREENCHIDA.
 * Ele NÃO é igual ao `FolhaRegistroDados` do web (esse traz só a config para
 * montar uma folha nova: programas/alvos/ajudas). Ver §BACKEND no fim do
 * handoff — depende de um endpoint de leitura novo/ajustado no backend.
 */

/** ✓ acerto = 1 · ½ com ajuda = 0.5 · ✕ erro = 0 · N/A = -1 (ou null). */
export type Resultado = 1 | 0.5 | 0 | -1 | null

export type Tentativa = {
  /** 1..N — ordem cronológica da tentativa dentro da folha. */
  numero: number
  /** Descrição do alvo trabalhado nesta tentativa. Pode ser texto longo. */
  alvo: string | null
  resultado: Resultado
}

export type FolhaRegistro = {
  ordem: number
  /** Rótulo do domínio já resolvido (não o id). */
  dominio: string
  /** Rótulo do programa já resolvido (não o id). */
  programa: string
  /** Rótulo do tipo de ajuda já resolvido (não o id). */
  ajuda: string
  observacao: string | null
  /** Alvos selecionados na folha (rótulos). */
  alvos: string[]
  tentativas: Tentativa[]
}

export type FolhaRegistroAtendimento = {
  id: number
  /** ISO "YYYY-MM-DD". */
  data: string
  hora: string
  categoria: string
  profissional: string
  especialidade: string
  /** Nome do paciente. */
  paciente: string
  /** Se a evolução já foi assinada digitalmente (mostra o selo "Assinado"). */
  assinado?: boolean
}

export type FolhaRegistroView = {
  atendimento: FolhaRegistroAtendimento
  folhas: FolhaRegistro[]
}
