import { useEffect, useState } from 'react';
import { folhaRegistroService } from '../services/folhaRegistroService';
import { folhaRegistroEditorService } from '../services/folhaRegistroEditorService';
import {
  resolverFolhaDoAgendamento,
  type FolhaAgendamentoStatus,
} from '../services/folhaAgendamentoService';
import type { AgendaItem } from '../types/agenda';

type State = {
  status: FolhaAgendamentoStatus;
  chaveEditor: number | null;
  loading: boolean;
};

const SEM_PLANO: State = { status: 'sem_plano', chaveEditor: null, loading: false };

/**
 * Status da folha de registro de um agendamento — mesma sondagem de
 * `useFolhaRegistroDisponibilidade` (getFolhaRegistro + getConfig), com um 3º
 * estado (`concluida`) quando o atendimento já foi assinado.
 */
export function useFolhaAgendamento(item: AgendaItem | null) {
  const [state, setState] = useState<State>(SEM_PLANO);

  useEffect(() => {
    if (!item) {
      setState(SEM_PLANO);
      return;
    }

    const { chaveEditor, status } = resolverFolhaDoAgendamento(item);
    if (status === 'sem_plano' || chaveEditor == null) {
      setState(SEM_PLANO);
      return;
    }

    let ativo = true;
    setState({ status: 'pendente', chaveEditor, loading: true });

    Promise.allSettled([
      folhaRegistroService.getFolhaRegistro(chaveEditor),
      folhaRegistroEditorService.getConfig(chaveEditor, 'criar'),
    ]).then(([folhaRes, configRes]) => {
      if (!ativo) return;

      const temPlano =
        configRes.status === 'fulfilled' && configRes.value.tem_plano_cuidado !== false;
      const folhas = folhaRes.status === 'fulfilled' ? folhaRes.value.folhas ?? [] : [];
      const assinada =
        folhaRes.status === 'fulfilled' && folhaRes.value.atendimento?.assinado === true;

      const resolved: FolhaAgendamentoStatus = !temPlano
        ? 'sem_plano'
        : assinada
          ? 'concluida'
          : folhas.length > 0
            ? 'preenchida'
            : 'pendente';

      setState({ status: resolved, chaveEditor, loading: false });
    });

    return () => {
      ativo = false;
    };
  }, [item?.id]);

  return state;
}
