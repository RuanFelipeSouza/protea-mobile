import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'protea_jwt_paciente'
const META_KEY = 'protea_paciente_meta'

export async function savePatientToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function getPatientToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY)
}

export async function removePatientToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export async function savePacienteMeta(id: number, nome: string) {
  await SecureStore.setItemAsync(META_KEY, JSON.stringify({ id, nome }))
}

export async function getPacienteMeta(): Promise<{ id: number; nome: string } | null> {
  const raw = await SecureStore.getItemAsync(META_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as { id: number; nome: string } } catch { return null }
}

export async function removePacienteMeta() {
  await SecureStore.deleteItemAsync(META_KEY)
}
