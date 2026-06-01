import { create } from 'zustand'

interface PacienteAuthState {
  token: string | null
  pacienteId: number | null
  nome: string | null
  nomeresponsavel: string | null
  setAuth: (
    token: string,
    pacienteId: number,
    nome: string,
    nomeresponsavel?: string | null,
  ) => void
  logout: () => void
}

export const usePacienteAuthStore = create<PacienteAuthState>((set) => ({
  token: null,
  pacienteId: null,
  nome: null,
  nomeresponsavel: null,

  setAuth: (token, pacienteId, nome, nomeresponsavel = null) =>
    set({ token, pacienteId, nome, nomeresponsavel }),

  logout: () => set({ token: null, pacienteId: null, nome: null, nomeresponsavel: null }),
}))
