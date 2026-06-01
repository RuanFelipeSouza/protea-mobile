import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

const STORAGE_KEY = 'protea_theme_dark'

interface ThemeState {
  dark: boolean
  hidratado: boolean
  setDark: (dark: boolean) => void
  toggle: () => void
  hidratar: () => Promise<void>
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  dark: false,
  hidratado: false,

  setDark: (dark) => {
    set({ dark })
    SecureStore.setItemAsync(STORAGE_KEY, dark ? '1' : '0').catch((e) =>
      console.warn('[themeStore] falha ao persistir:', e?.message),
    )
  },

  toggle: () => get().setDark(!get().dark),

  hidratar: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY)
      if (raw === '1') set({ dark: true })
    } catch (e: any) {
      console.warn('[themeStore] falha ao hidratar:', e?.message)
    } finally {
      set({ hidratado: true })
    }
  },
}))
