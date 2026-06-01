import { useMemo, useState } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../../atoms'
import { Dropdown } from '../../molecules'
import { useUnidades } from '../../../hooks/useUnidades'
import { useUnidadeStore } from '../../../stores/unidadeStore'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type HeaderBarProps = {
  title: string
  showBack?: boolean
  onBack?: () => void
  showProfile?: boolean
  onProfile?: () => void
  /** Exibe o slot de seleção de unidade no centro (padrão: true) */
  showUnidade?: boolean
  /** Desabilita o press do slot de unidade e oculta o chevron (padrão: false) */
  lockUnidade?: boolean
}

export function HeaderBar({
  title,
  showBack = false,
  onBack,
  showProfile = true,
  onProfile,
  showUnidade = true,
  lockUnidade = false,
}: HeaderBarProps) {
  const insets = useSafeAreaInsets()
  const { unidades, loading } = useUnidades()
  const selecionada = useUnidadeStore((s) => s.selecionada)
  const setSelecionada = useUnidadeStore((s) => s.setSelecionada)
  const [modalOpen, setModalOpen] = useState(false)

  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  const options = useMemo(
    () => unidades.map((u) => ({ label: u.unidade, value: u.id })),
    [unidades],
  )

  const unidadeLabel = selecionada?.unidade ?? 'Selecione a unidade'
  const hasSelection = !!selecionada

  function handleChange(id: number) {
    const u = unidades.find((x) => x.id === id) ?? null
    setSelecionada(u)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Slot esquerdo — botão de voltar ou espaçador */}
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <Icon name="chevron-back" size={24} color={colors.primary[70]} />
          </Pressable>
        )}
      </View>

      {/* Slot central — eyebrow (page name) + unidade tappable */}
      <Pressable
        style={styles.center}
        onPress={() => showUnidade && !lockUnidade && setModalOpen(true)}
        disabled={!showUnidade || lockUnidade}
        hitSlop={6}
      >
        {showUnidade ? (
          <>
            <Text style={styles.eyebrow} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.unidadeLabel,
                  hasSelection ? styles.unidadeLabelSelected : styles.unidadeLabelEmpty,
                ]}
                numberOfLines={1}
              >
                {unidadeLabel}
              </Text>
              {!lockUnidade && (
                loading ? (
                  <ActivityIndicator size="small" color={colors.primary[60]} />
                ) : (
                  <Icon
                    name="chevron-down"
                    size={16}
                    color={hasSelection ? colors.neutral[70] : colors.neutral[60]}
                  />
                )
              )}
            </View>
          </>
        ) : (
          <Text style={styles.titleStandalone} numberOfLines={1}>
            {title}
          </Text>
        )}
      </Pressable>

      {/* Slot direito — ícone de perfil */}
      <View style={styles.profileSide}>
        {showProfile && (
          <Pressable onPress={onProfile} hitSlop={8}>
            <Icon name="person-circle-outline" size={28} color={colors.primary[70]} />
          </Pressable>
        )}
      </View>

      {/* Modal de seleção de unidade — acionado pelo slot central */}
      {showUnidade && (
        <Dropdown
          options={options}
          value={selecionada?.id ?? null}
          onChange={handleChange}
          loading={loading}
          modalTitle="Escolha uma unidade"
          emptyLabel="Nenhuma unidade disponível para o usuário"
          open={modalOpen}
          onOpenChange={setModalOpen}
          renderTrigger={false}
        />
      )}
    </View>
  )
}
