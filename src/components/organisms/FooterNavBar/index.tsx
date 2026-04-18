import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { FooterTab } from '../../molecules'
import { theme } from '../../../theme'

type IoniconName = ComponentProps<typeof Ionicons>['name']

const ROUTE_ICONS: Record<string, { inactive: IoniconName; active: IoniconName }> = {
  index: { inactive: 'home-outline', active: 'home' },
  pacientes: { inactive: 'people-outline', active: 'people' },
  localizacao: { inactive: 'location-outline', active: 'location' },
  mensagens: { inactive: 'chatbubble-outline', active: 'chatbubble' },
  perfil: { inactive: 'person-outline', active: 'person' },
}

export function FooterNavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.neutral[0],
        borderTopWidth: 1,
        borderTopColor: theme.colors.neutral[20],
        paddingBottom: insets.bottom,
      }}
    >
      {state.routes.map((route, index) => {
        const isActive = state.index === index
        const icons = ROUTE_ICONS[route.name]

        return (
          <FooterTab
            key={route.key}
            icon={isActive ? icons.active : icons.inactive}
            isActive={isActive}
            onPress={() => navigation.navigate(route.name)}
          />
        )
      })}
    </View>
  )
}
