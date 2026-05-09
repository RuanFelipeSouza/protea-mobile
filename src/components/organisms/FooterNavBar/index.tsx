import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { FooterTab } from '../../molecules'
import { theme } from '../../../theme'

type IoniconName = ComponentProps<typeof Ionicons>['name']

const TABS = [
  { name: 'index',      path: '/',             inactive: 'home-outline' as IoniconName,          active: 'home' as IoniconName },
  { name: 'pacientes',  path: '/pacientes',    inactive: 'people-outline' as IoniconName,        active: 'people' as IoniconName },
  { name: 'evolucoes',  path: '/evolucoes',    inactive: 'create-outline' as IoniconName,        active: 'create' as IoniconName },
  { name: 'relatorios', path: '/relatorios',   inactive: 'document-text-outline' as IoniconName, active: 'document-text' as IoniconName },
  { name: 'perfil',     path: '/perfil',       inactive: 'person-outline' as IoniconName,        active: 'person' as IoniconName },
]

export function FooterNavBar() {
  const router = useRouter()
  const pathname = usePathname()
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
      {TABS.map((tab) => {
        const isActive = pathname === tab.path
        return (
          <FooterTab
            key={tab.name}
            icon={isActive ? tab.active : tab.inactive}
            isActive={isActive}
            onPress={() => router.push(tab.path as any)}
          />
        )
      })}
    </View>
  )
}
