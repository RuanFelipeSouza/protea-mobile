import { useMemo } from 'react'
import { View, Text } from 'react-native'
import { Dropdown, type DropdownOption } from '../../molecules'
import { useUnidades } from '../../../hooks/useUnidades'
import { useUnidadeStore } from '../../../stores/unidadeStore'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type UnidadeSelectorProps = {
  /** Mensagem auxiliar exibida acima do dropdown quando nada está selecionado */
  hintLabel?: string
  /** Permite ocultar o label "Unidade" caso o seletor seja usado em contextos compactos */
  showLabel?: boolean
}

/**
 * Seletor global de Unidade.
 *
 * Lê a lista de unidades do usuário via `useUnidades`, persiste a
 * seleção no `unidadeStore` e exibe uma dica ao lado quando nada
 * está escolhido ("Selecione a unidade").
 *
 * Pode ser usado em qualquer página que precise expor a seleção,
 * mas o ponto de entrada principal é a home da Área Profissional.
 */
export function UnidadeSelector({
  hintLabel = 'Selecione a unidade',
  showLabel = true,
}: UnidadeSelectorProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { unidades, loading, erro } = useUnidades()
  const selecionada = useUnidadeStore((s) => s.selecionada)
  const setSelecionada = useUnidadeStore((s) => s.setSelecionada)

  const options = useMemo<DropdownOption<number>[]>(
    () => unidades.map((u) => ({ label: u.unidade, value: u.id })),
    [unidades],
  )

  function handleChange(id: number) {
    const unidade = unidades.find((u) => u.id === id) ?? null
    setSelecionada(unidade)
  }

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>Unidade</Text>}

      <View style={styles.row}>
        <View style={styles.dropdownWrapper}>
          <Dropdown
            options={options}
            value={selecionada?.id ?? null}
            onChange={handleChange}
            placeholder="Selecione..."
            loading={loading}
            modalTitle="Escolha uma unidade"
            emptyLabel={
              erro
                ? 'Erro ao carregar unidades'
                : 'Nenhuma unidade disponível para o usuário'
            }
          />
        </View>

        {!selecionada && !loading && options.length > 0 && (
          <Text style={styles.hint}>{hintLabel}</Text>
        )}
      </View>

      {erro && <Text style={styles.erro}>Erro ao carregar unidades</Text>}
    </View>
  )
}
