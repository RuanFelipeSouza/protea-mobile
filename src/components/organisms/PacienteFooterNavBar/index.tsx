import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, usePathname } from 'expo-router'
import { FooterTab } from '../../molecules'
import { useTheme } from '../../../theme'
import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'

type IoniconName = ComponentProps<typeof Ionicons>['name']

const TABS = [
  {
    path: '/(paciente)',
    match: ['/(paciente)', '/(paciente)/'],
    label: 'Início',
    inactive: 'home-outline' as IoniconName,
    active: 'home' as IoniconName,
  },
  {
    path: '/(paciente)/agendamentos',
    match: ['/(paciente)/agendamentos'],
    label: 'Agendamentos',
    inactive: 'calendar-outline' as IoniconName,
    active: 'calendar' as IoniconName,
  },
  {
    path: '/(paciente)/evolucoes',
    match: ['/(paciente)/evolucoes'],
    label: 'Evoluções',
    inactive: 'document-text-outline' as IoniconName,
    active: 'document-text' as IoniconName,
  },
  {
    path: '/(paciente)/perfil',
    match: ['/(paciente)/perfil'],
    label: 'Perfil',
    inactive: 'person-outline' as IoniconName,
    active: 'person' as IoniconName,
  },
]

export function PacienteFooterNavBar() {
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
        const isActive =
          pathname === tab.path ||
          tab.match.some((m) => pathname === m) ||
          (tab.path === '/(paciente)' && (pathname === '/' || pathname === ''))
        return (
          <FooterTab
            key={tab.path}
            icon={isActive ? tab.active : tab.inactive}
            label={tab.label}
            isActive={isActive}
            onPress={() => router.push(tab.path as never)}
          />
        )
      })}
    </View>
  )
}
