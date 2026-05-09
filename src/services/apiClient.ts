import axios, { type AxiosInstance } from 'axios';
import { getToken, removeToken } from './authService';
import { useAuthStore } from '../stores/authStore';

function createApiInstance(baseURL: string, extraHeaders: Record<string, string> = {}): AxiosInstance {
  const instance = axios.create({ baseURL, timeout: 25000, headers: extraHeaders });

  instance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['proteakey'] = process.env.EXPO_PUBLIC_PROTEA_KEY ?? '';

    const { method, url, params, data } = config;
    console.log(`[API] ► ${method?.toUpperCase()} ${url}`, {
      params: params ?? null,
      data: data ?? null,
    });

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      const count = Array.isArray(response.data) ? `${response.data.length} itens` : 'objeto';
      console.log(`[API] ✓ ${response.status} ${response.config.url} — ${count}`);
      return response;
    },
    async (error) => {
      const status = error.response?.status;
      const url = error.config?.url;
      const message = error.response?.data ?? error.message;

      console.error(`[API] ✗ ${status ?? 'SEM_RESPOSTA'} ${url}`, message);

      if (status === 401) {
        await removeToken();
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const api = createApiInstance(process.env.EXPO_PUBLIC_API_URL ?? '');

const agendaHost = process.env.EXPO_PUBLIC_AGENDA_HOST;
export const agendaApi = createApiInstance(
  process.env.EXPO_PUBLIC_AGENDA_URL ?? process.env.EXPO_PUBLIC_API_URL ?? '',
  agendaHost ? { Host: agendaHost } : {},
);
