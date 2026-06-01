import * as SecureStore from 'expo-secure-store';
import type { UserResponse } from './loginService';

const TOKEN_KEY = 'protea_jwt';
const USUARIO_KEY = 'protea_usuario';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveUsuario(usuario: UserResponse) {
  await SecureStore.setItemAsync(USUARIO_KEY, JSON.stringify(usuario));
}

export async function getUsuario(): Promise<UserResponse | null> {
  const raw = await SecureStore.getItemAsync(USUARIO_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserResponse; } catch { return null; }
}

export async function removeUsuario() {
  await SecureStore.deleteItemAsync(USUARIO_KEY);
}
