import { View, Text, Pressable } from 'react-native'
import type { ComponentProps, ReactNode } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'

type EmptyStateProps = {
  iconName?: ComponentProps<typeof Ionicons>['name']
  title: string
  message?: string
  /** Botão opcional, usado para CTAs como "Selecionar unidade" */
  actionLabel?: string
  onActionPress?: () => void
  /** Conteúdo extra opcional renderizado abaixo da mensagem */
  children?: ReactNode
}

/**
 * Estado vazio reutilizável.
 *
 * Pensado para os cenários em que não há dados a listar:
 *  - sem unidade selecionada (caso atual deste delivery)
 *  - lista vazia / busca sem resultado
 *  - sem permissão para visualizar
 */
export function EmptyState({
  iconName = 'information-circle-outline',
  title,
  message,
  actionLabel,
  onActionPress,
  children,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Icon name={iconName} size={48} color={theme.colors.neutral[40]} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {children}
      {actionLabel && onActionPress && (
        <Pressable style={styles.action} onPress={onActionPress}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  )
}
