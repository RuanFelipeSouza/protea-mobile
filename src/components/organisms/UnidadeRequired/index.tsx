import type { ReactNode } from 'react'
import { useRouter } from 'expo-router'
import { EmptyState } from '../../molecules'
import { useUnidadeStore } from '../../../stores/unidadeStore'

type UnidadeRequiredProps = {
  /** Conteúdo a ser exibido somente quando houver unidade selecionada */
  children: ReactNode
  /** Mensagem específica do contexto, exibida abaixo do título */
  contextMessage?: string
}

/**
 * Wrapper que bloqueia a renderização do conteúdo da página quando o
 * usuário ainda não escolheu uma unidade. Substitui o conteúdo por um
 * empty state convidando-o a voltar para a home e selecionar.
 *
 * Uso:
 *   <UnidadeRequired contextMessage="Você verá os pacientes da unidade ativa.">
 *     <PatientsTemplate ... />
 *   </UnidadeRequired>
 */
export function UnidadeRequired({ children, contextMessage }: UnidadeRequiredProps) {
  const router = useRouter()
  const selecionada = useUnidadeStore((s) => s.selecionada)

  if (!selecionada) {
    return (
      <EmptyState
        iconName="business-outline"
        title="Selecione uma unidade"
        message={
          contextMessage ??
          'Volte para a home e escolha a unidade no seletor para visualizar os dados.'
        }
        actionLabel="Selecionar unidade"
        onActionPress={() => router.replace('/(tabs)')}
      />
    )
  }

  return <>{children}</>
}
