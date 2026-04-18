import { View, Text, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../../atoms'
import { theme } from '../../../theme'
import { styles } from './styles'

type HeaderBarProps = {
  title: string
  showBack?: boolean
  onBack?: () => void
  showProfile?: boolean
  onProfile?: () => void
}

export function HeaderBar({
  title,
  showBack = false,
  onBack,
  showProfile = true,
  onProfile,
}: HeaderBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <Icon name="chevron-back" size={24} color={theme.colors.neutral[0]} />
          </Pressable>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.profileSide}>
        {showProfile && (
          <Pressable onPress={onProfile} hitSlop={8}>
            <Icon name="person-circle-outline" size={28} color={theme.colors.neutral[0]} />
          </Pressable>
        )}
      </View>
    </View>
  )
}
