import { create } from 'zustand'
import type { UserResponse } from '../services/loginService'
import { useUnidadeStore } from './unidadeStore'

interface AuthState {
  token: string | null
  usuario: UserResponse | null
  setAuth: (token: string, usuario: UserResponse | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  setAuth: (token, usuario) => set({ token, usuario }),
  logout: () => {
    useUnidadeStore.getState().limpar()
    set({ token: null, usuario: null })
  },
}))
