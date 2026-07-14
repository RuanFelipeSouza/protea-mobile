import { useEffect, useState } from 'react'
import { folhaRegistroService } from '../services/folhaRegistroService'
import { folhaRegistroEditorService } from '../services/folhaRegistroEditorService'
import type { FolhaAgendamentoStatus } from '../services/folhaAgendamentoService'

type State = {
  status: FolhaAgendamentoStatus
  loading: boolean
}

const SEM_PLANO: State = { status: 'sem_plano', loading: false }

/**
 * Sonda os dois endpoints de folha de registro para decidir o estado da
 * folha de uma evolução — mesma sondagem de `useFolhaAgendamento`
 * (getFolhaRegistro + getConfig), sem depender de um `AgendaItem`
 * (a evolução já É a chave do editor).
 *
 *  - getConfig        → `tem_plano_cuidado === false` ⇒ 'sem_plano'
 *  - getFolhaRegistro → `atendimento.assinado`        ⇒ 'concluida'
 *                     → `folhas.length > 0`           ⇒ 'preenchida'
 *                     → caso contrário                ⇒ 'pendente'
 */
export function useFolhaRegistroDisponibilidade(evolucaoId: number) {
  const [state, setState] = useState<State>({ status: 'sem_plano', loading: true })

  useEffect(() => {
    let ativo = true

    if (!evolucaoId) {
      setState(SEM_PLANO)
      return
    }

    setState((prev) => ({ ...prev, loading: true }))

    Promise.allSettled([
      folhaRegistroService.getFolhaRegistro(evolucaoId),
      folhaRegistroEditorService.getConfig(evolucaoId, 'criar'),
    ]).then(([folhaRes, configRes]) => {
      if (!ativo) return

      const temPlano =
        configRes.status === 'fulfilled' && configRes.value.tem_plano_cuidado !== false
      const folhas = folhaRes.status === 'fulfilled' ? folhaRes.value.folhas ?? [] : []
      const assinada =
        folhaRes.status === 'fulfilled' && folhaRes.value.atendimento?.assinado === true

      const resolved: FolhaAgendamentoStatus = !temPlano
        ? 'sem_plano'
        : assinada
          ? 'concluida'
          : folhas.length > 0
            ? 'preenchida'
            : 'pendente'

      setState({ status: resolved, loading: false })
    })

    return () => {
      ativo = false
    }
  }, [evolucaoId])

  return state
}
