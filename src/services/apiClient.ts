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
      const raw = error.response?.data;
      const isHtml = typeof raw === 'string' && raw.trimStart().startsWith('<');
      const message = isHtml
        ? `[resposta HTML — provavelmente ${status === 404 ? 'rota não existe no backend' : 'erro Django'}]`
        : (raw ?? error.message);

      console.error(`[API] ✗ ${status ?? 'SEM_RESPOSTA'} ${url}`, message);
      console.error('[API] DEBUG:', JSON.stringify({
        code: error.code,
        message: error.message,
        baseURL: error.config?.baseURL,
        fullUrl: (error.config?.baseURL ?? '') + (error.config?.url ?? ''),
        method: error.config?.method,
        headers: error.config?.headers,
        timeout: error.config?.timeout,
        hasResponse: !!error.response,
      }));

      if (status === 401) {
        await removeToken();
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

function hostFromUrl(url: string | undefined): string {
  if (!url) return '';
  const match = /^https?:\/\/([^/:]+)/.exec(url);
  return match?.[1] ?? '';
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
const apiHost = hostFromUrl(apiUrl);

export const api = createApiInstance(apiUrl);

const agendaHost = process.env.EXPO_PUBLIC_AGENDA_HOST;
export const agendaApi = createApiInstance(
  process.env.EXPO_PUBLIC_AGENDA_URL ?? apiUrl,
  agendaHost ? { Host: agendaHost } : {},
);

export const proteaApi = createApiInstance(
  apiUrl,
  apiHost ? { Host: apiHost } : {},
);

export const HOST_PROTEA = apiHost ? { Host: apiHost } : {};
export const HOST_PUBLICO = process.env.EXPO_PUBLIC_PUBLICO_HOST
  ? { Host: process.env.EXPO_PUBLIC_PUBLICO_HOST }
  : {};
