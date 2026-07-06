import { useEffect, useState } from 'react'
import { folhaRegistroService } from '../services/folhaRegistroService'
import { folhaRegistroEditorService } from '../services/folhaRegistroEditorService'

type State = {
  /** Existe folha de registro já preenchida (folhas.length > 0). Controla "Visualizar". */
  temFolhas: boolean
  /** Evolução tem plano de cuidado (config respondeu 200, não 404). Controla "Preencher". */
  podePreencher: boolean
  loading: boolean
}

/**
 * Sonda os dois endpoints de folha de registro para decidir quais botões mostrar
 * na tela de detalhes da evolução — sem precisar de novos campos no backend:
 *
 *  - getFolhaRegistro → `folhas` vazio ⇒ não há folha para visualizar.
 *  - getConfig        → `tem_plano_cuidado === false` ⇒ não dá para preencher
 *                       (o backend responde 200 com config vazia nesse caso).
 */
export function useFolhaRegistroDisponibilidade(evolucaoId: number) {
  const [state, setState] = useState<State>({
    temFolhas: false,
    podePreencher: false,
    loading: true,
  })

  useEffect(() => {
    let ativo = true

    if (!evolucaoId) {
      setState({ temFolhas: false, podePreencher: false, loading: false })
      return
    }

    setState((prev) => ({ ...prev, loading: true }))

    Promise.allSettled([
      folhaRegistroService.getFolhaRegistro(evolucaoId),
      folhaRegistroEditorService.getConfig(evolucaoId, 'criar'),
    ]).then(([folhaRes, configRes]) => {
      if (!ativo) return

      const temFolhas =
        folhaRes.status === 'fulfilled' &&
        (folhaRes.value.folhas?.length ?? 0) > 0

      // 200 com tem_plano_cuidado !== false ⇒ pode preencher.
      // Qualquer falha de rede também esconde o botão.
      const podePreencher =
        configRes.status === 'fulfilled' &&
        configRes.value.tem_plano_cuidado !== false

      setState({ temFolhas, podePreencher, loading: false })
    })

    return () => {
      ativo = false
    }
  }, [evolucaoId])

  return state
}
