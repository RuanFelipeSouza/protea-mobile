import { Stack, useRouter, useSegments } from 'expo-router';
import * as ExpoSplash from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from '../src/components/pages';
import { api, HOST_PUBLICO } from '../src/services/apiClient';
import { getToken, removeToken, getUsuario, removeUsuario } from '../src/services/authService';
import { getPatientToken, removePatientToken, getPacienteMeta, removePacienteMeta } from '../src/services/pacienteAuthService';
import { pacienteApi } from '../src/services/pacienteDataService';
import { useAuthStore } from '../src/stores/authStore';
import { usePacienteAuthStore } from '../src/stores/pacienteAuthStore';
import { useUnidadeStore } from '../src/stores/unidadeStore';
import { useThemeStore } from '../src/stores/themeStore';

ExpoSplash.preventAutoHideAsync().catch(() => {});

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

type ValidationResult = 'valid' | 'invalid' | 'offline';

/**
 * Valida o token profissional contra o backend chamando o endpoint de unidades.
 * - 200: token aceito → 'valid'
 * - 401/403: token rejeitado (interceptor já limpa) → 'invalid'
 * - Erro de rede/timeout: assume válido para permitir uso offline → 'offline'
 */
async function validateProToken(userId: number): Promise<ValidationResult> {
  try {
    await api.get('unidade/unidadesPrest', {
      params: { user: userId },
      headers: HOST_PUBLICO,
      timeout: 5000,
    });
    return 'valid';
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 401 || status === 403) return 'invalid';
    return 'offline';
  }
}

/**
 * Valida o token de paciente contra o backend chamando o endpoint de perfil.
 */
async function validatePacToken(pacienteId: number): Promise<ValidationResult> {
  try {
    await pacienteApi.get(`/mobile/paciente/${pacienteId}/perfil`, { timeout: 5000 });
    return 'valid';
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 401 || status === 403) return 'invalid';
    return 'offline';
  }
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const pacienteToken = usePacienteAuthStore((s) => s.token);
  const setPacienteAuth = usePacienteAuthStore((s) => s.setAuth);
  const isDark = useThemeStore((s) => s.dark);
  const [authReady, setAuthReady] = useState(false);

  // Bootstrap: valida tokens persistidos contra o backend antes de hidratar a sessão.
  // Tokens que o backend rejeita (401/403) são removidos pelos interceptors automaticamente.
  // Erros de rede (sem internet) → confia no JWT local para não bloquear uso offline.
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      // ── PROFISSIONAL ─────────────────────────────────────────
      const storedPro = await getToken();
      let hasValidPro = false;

      if (storedPro && !isTokenExpired(storedPro)) {
        const usuario = await getUsuario();
        if (usuario?.id) {
          const status = await validateProToken(usuario.id);
          if (status === 'valid' || status === 'offline') {
            if (!cancelled) setAuth(storedPro, usuario);
            hasValidPro = true;
          }
          // 'invalid' → interceptor já limpou o token via 401
        } else {
          // Sem metadado do usuário: não há como validar — limpa por segurança
          await removeToken();
        }
      } else if (storedPro) {
        // JWT expirado localmente
        await removeToken();
        await removeUsuario();
      }

      // ── PACIENTE ─────────────────────────────────────────────
      if (hasValidPro) {
        await removePatientToken();
        await removePacienteMeta();
      } else {
        const storedPac = await getPatientToken();
        if (storedPac && !isTokenExpired(storedPac)) {
          const meta = await getPacienteMeta();
          if (meta?.id) {
            const status = await validatePacToken(meta.id);
            if (status === 'valid' || status === 'offline') {
              if (!cancelled) setPacienteAuth(storedPac, meta.id, meta.nome, null);
            }
          } else {
            await removePatientToken();
          }
        } else if (storedPac) {
          await removePatientToken();
          await removePacienteMeta();
        }
      }

      await useUnidadeStore.getState().hidratar();
      await useThemeStore.getState().hidratar();

      if (!cancelled) setAuthReady(true);
    }
    bootstrap();
    ExpoSplash.hideAsync().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [setAuth, setPacienteAuth]);

  // Guard de navegação: roda assim que auth está hidratado E em qualquer mudança de auth ou rota.
  // O <Stack> já está montado nesse ponto, então router.replace funciona sem race condition.
  useEffect(() => {
    if (!authReady) return;

    const root = segments[0] as string | undefined;
    const inLogin = root === 'login';
    const inCriarSenha = root === 'paciente-criar-senha';
    const inPaciente = root === '(paciente)';

    // Criar senha é rota livre
    if (inCriarSenha) return;

    if (token) {
      // Profissional autenticado: NÃO pode estar em login nem em (paciente)
      if (inLogin || inPaciente) {
        router.replace('/(tabs)');
      }
      return;
    }

    if (pacienteToken) {
      // Paciente autenticado: só pode estar em (paciente)
      if (!inPaciente) {
        router.replace('/(paciente)' as never);
      }
      return;
    }

    // Sem autenticação: força login
    if (!inLogin) {
      router.replace('/login' as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, token, pacienteToken, segments.join('/')]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack screenOptions={{ headerShown: false }} />
      {!authReady && (
        <View style={StyleSheet.absoluteFillObject}>
          <SplashScreen />
        </View>
      )}
    </View>
  );
}
