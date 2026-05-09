export type Patient = {
  id: string
  nome: string
  datanasc: string | null  // YYYY-MM-DD (formato Django)
  avatarUrl?: string
  is_active: boolean
  cpf?: string
  nomemae?: string
  sexo?: string
}

export function calcularIdade(datanasc: string | null | undefined): number | null {
  if (!datanasc) return null
  const nasc = new Date(datanasc)
  if (isNaN(nasc.getTime())) return null
  const hoje = new Date()
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const mesPassou = hoje.getMonth() > nasc.getMonth()
  const mesIgualDiaPassou = hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate()
  if (!mesPassou && !mesIgualDiaPassou) idade--
  return idade
}
