import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import type { Unidade } from '../types/unidade'

const STORAGE_KEY = 'protea_unidade_selecionada'

interface UnidadeState {
  selecionada: Unidade | null
  hidratado: boolean
  setSelecionada: (unidade: Unidade | null) => void
  hidratar: () => Promise<void>
  limpar: () => void
}

/**
 * Store global da unidade selecionada pelo profissional.
 *
 * Toda página que dependa de dados da unidade (pacientes, evoluções,
 * agenda, relatórios) deve consumir este store e mostrar empty state
 * quando `selecionada` for `null`.
 *
 * A seleção é persistida em SecureStore para sobreviver a reloads.
 * Após o login (e em RootLayout), `hidratar()` deve ser chamado uma
 * única vez para recuperar a última unidade escolhida.
 */
export const useUnidadeStore = create<UnidadeState>((set) => ({
  selecionada: null,
  hidratado: false,

  setSelecionada: (unidade) => {
    set({ selecionada: unidade })
    if (unidade) {
      SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(unidade)).catch((e) =>
        console.warn('[unidadeStore] falha ao persistir:', e?.message),
      )
    } else {
      SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {})
    }
  },

  hidratar: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Unidade
        if (parsed && typeof parsed.id === 'number') {
          set({ selecionada: parsed })
        }
      }
    } catch (e: any) {
      console.warn('[unidadeStore] falha ao hidratar:', e?.message)
    } finally {
      set({ hidratado: true })
    }
  },

  limpar: () => {
    set({ selecionada: null })
    SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {})
  },
}))
