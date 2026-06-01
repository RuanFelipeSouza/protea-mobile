export type Patient = {
  id: string
  nome: string
  datanascimento: string | null  // DD/MM/YYYY
  avatarUrl?: string
  is_active: boolean
  cpf?: string
  nomeresponsavel?: string
}

export function calcularIdade(datanascimento: string | null | undefined): number | null {
  if (!datanascimento) return null
  const [dia, mes, ano] = datanascimento.split('/')
  if (!dia || !mes || !ano) return null
  const nasc = new Date(Number(ano), Number(mes) - 1, Number(dia))
  if (isNaN(nasc.getTime())) return null
  const hoje = new Date()
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const mesPassou = hoje.getMonth() > nasc.getMonth()
  const mesIgualDiaPassou = hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate()
  if (!mesPassou && !mesIgualDiaPassou) idade--
  return idade
}
