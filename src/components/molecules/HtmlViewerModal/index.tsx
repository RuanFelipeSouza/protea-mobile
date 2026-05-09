import { View, Text, Pressable, Modal, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../../theme'

type HtmlViewerModalProps = {
  visible: boolean
  onClose: () => void
  title: string
  subtitle?: string
  html: string | null
  emptyMessage?: string
}

function wrapHtml(content: string): string {
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
    body { font-family: -apple-system, sans-serif; font-size: 15px; color: #212121; padding: 16px; line-height: 1.6; }
    p { margin: 0 0 12px; } ul, ol { padding-left: 20px; }
  </style></head><body>${content}</body></html>`
}

export function HtmlViewerModal({
  visible,
  onClose,
  title,
  subtitle,
  html,
  emptyMessage = 'Conteúdo não disponível',
}: HtmlViewerModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={theme.colors.neutral[80]} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        {html ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: wrapHtml(html) }}
            style={{ flex: 1 }}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[0],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[20],
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.neutral[90],
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.neutral[50],
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.neutral[50],
  },
})
