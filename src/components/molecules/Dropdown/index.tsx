import { useMemo, useState } from 'react'
import { View, Text, Pressable, Modal, FlatList, ActivityIndicator } from 'react-native'
import { Icon } from '../../atoms'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

export type DropdownOption<T = string | number> = {
  label: string
  value: T
}

type DropdownProps<T extends string | number> = {
  options: DropdownOption<T>[]
  value: T | null
  onChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  emptyLabel?: string
  /** Texto opcional exibido no header do modal */
  modalTitle?: string
  /**
   * Controlled open state. When provided, the component operates in
   * controlled mode — it will not manage `open` internally.
   */
  open?: boolean
  /** Called whenever the component wants to close (or open) the modal. */
  onOpenChange?: (open: boolean) => void
  /**
   * When `false`, the trigger `<Pressable>` field is not rendered —
   * only the modal is. Useful when an external element (e.g. HeaderBar)
   * serves as the trigger. Defaults to `true`.
   */
  renderTrigger?: boolean
}

/**
 * Componente reutilizável de dropdown / picker.
 *
 * Em vez de depender de uma lib externa, usa o Modal nativo do RN para
 * exibir a lista de opções, garantindo consistência visual em iOS,
 * Android e Web.
 *
 * Suporta modo controlado via `open` + `onOpenChange`, e pode omitir o
 * trigger padrão via `renderTrigger={false}` para uso com triggers externos.
 */
export function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  loading = false,
  emptyLabel = 'Nenhuma opção disponível',
  modalTitle,
  open: controlledOpen,
  onOpenChange,
  renderTrigger = true,
}: DropdownProps<T>) {
  const [internalOpen, setInternalOpen] = useState(false)

  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  // Use controlled state when `open` prop is provided; otherwise internal.
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const selected = options.find((o) => o.value === value) ?? null
  const isDisabled = disabled || loading

  function handleSelect(option: DropdownOption<T>) {
    onChange(option.value)
    setOpen(false)
  }

  return (
    <>
      {renderTrigger && (
        <Pressable
          style={[styles.field, isDisabled && styles.fieldDisabled]}
          onPress={() => !isDisabled && setOpen(true)}
          disabled={isDisabled}
        >
          <Text
            style={[styles.value, !selected && styles.placeholder]}
            numberOfLines={1}
          >
            {selected?.label ?? placeholder}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary[60]} />
          ) : (
            <Icon name="chevron-down" size={18} color={colors.neutral[60]} />
          )}
        </Pressable>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {modalTitle && (
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{modalTitle}</Text>
              </View>
            )}

            {options.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{emptyLabel}</Text>
              </View>
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => {
                  const isActive = item.value === value
                  return (
                    <Pressable
                      style={[styles.option, isActive && styles.optionActive]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.optionLabel,
                          isActive && styles.optionLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isActive && (
                        <Icon
                          name="checkmark"
                          size={18}
                          color={colors.primary[70]}
                        />
                      )}
                    </Pressable>
                  )
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}
