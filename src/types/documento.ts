export type DocumentoEvolucao = {
  id: number
  ppd_id: number
  data: string
  nome: string
  evolucao_html: string | null
  prestador_id: number
  doc_assinado: string | null
  storage_url: string | null
  assinado_url: string | null
  doc: string | null
  arquivo: string | null
}

export type DocumentoStatus = 'todos' | 'assinados' | 'pendentes'

export function isAssinado(doc: DocumentoEvolucao): boolean {
  return !!doc.doc_assinado && doc.doc_assinado.trim().length > 0
}
