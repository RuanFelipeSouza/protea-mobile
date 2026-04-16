import { create } from 'zustand';

interface AuthState {
  token: string | null;
  usuario: { nome: string; perfil: string } | null;
  setAuth: (token: string, usuario: AuthState['usuario']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  setAuth: (token, usuario) => set({ token, usuario }),
  logout: () => set({ token: null, usuario: null }),
}));
