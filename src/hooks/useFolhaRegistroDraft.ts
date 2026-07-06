/**
 * Rascunho automático da folha de registro (escrita).
 *
 * Persiste o estado de edição em `expo-secure-store` (mesmo mecanismo já usado
 * por authStore / unidadeStore) para sobreviver a reloads e troca de app durante
 * o atendimento. Salva com debounce; limpa ao gravar com sucesso.
 */
import { useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import type { FolhaEditorItem } from '../types/folhaRegistroEditor';

const key = (evolucaoId: number, modo: string) => `fr_draft_${modo}_${evolucaoId}`;

export async function carregarRascunho(
  evolucaoId: number,
  modo: string,
): Promise<FolhaEditorItem[] | null> {
  try {
    const raw = await SecureStore.getItemAsync(key(evolucaoId, modo));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

export async function limparRascunho(evolucaoId: number, modo: string) {
  try {
    await SecureStore.deleteItemAsync(key(evolucaoId, modo));
  } catch {
    /* noop */
  }
}

/** Salva `folhas` com debounce sempre que mudam (ignora a 1ª renderização). */
export function useAutoSaveRascunho(
  evolucaoId: number,
  modo: string,
  folhas: FolhaEditorItem[],
  onSaved?: () => void,
) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => {
      SecureStore.setItemAsync(key(evolucaoId, modo), JSON.stringify(folhas))
        .then(() => onSaved?.())
        .catch(() => {});
    }, 400);
    return () => clearTimeout(id);
  }, [evolucaoId, modo, folhas, onSaved]);
}
