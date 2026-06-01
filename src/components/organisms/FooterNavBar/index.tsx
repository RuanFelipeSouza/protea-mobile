import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { FooterTab } from '../../molecules'
import { useTheme } from '../../../theme'

type IoniconName = ComponentProps<typeof Ionicons>['name']

const TABS = [
  { name: 'index',      path: '/',           label: 'Home',       inactive: 'home-outline' as IoniconName,          active: 'home' as IoniconName },
  { name: 'pacientes',  path: '/pacientes',  label: 'Pacientes',  inactive: 'people-outline' as IoniconName,        active: 'people' as IoniconName },
  { name: 'evolucoes',  path: '/evolucoes',  label: 'Evoluções',  inactive: 'create-outline' as IoniconName,        active: 'create' as IoniconName },
  { name: 'pendencias', path: '/pendencias', label: 'Pendências', inactive: 'alert-circle-outline' as IoniconName,  active: 'alert-circle' as IoniconName },
  { name: 'agenda',     path: '/agenda',     label: 'Agenda',     inactive: 'calendar-outline' as IoniconName,      active: 'calendar' as IoniconName },
  { name: 'perfil',     path: '/perfil',     label: 'Perfil',     inactive: 'person-outline' as IoniconName,        active: 'person' as IoniconName },
]

export function FooterNavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.neutral[0],
        borderTopWidth: 1,
        borderTopColor: colors.neutral[20],
        paddingBottom: insets.bottom,
      }}
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.path
        return (
          <FooterTab
            key={tab.name}
            icon={isActive ? tab.active : tab.inactive}
            label={tab.label}
            isActive={isActive}
            onPress={() => router.push(tab.path as any)}
          />
        )
      })}
    </View>
  )
}
