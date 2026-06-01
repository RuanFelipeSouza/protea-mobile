import { useMemo, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { HeaderBar } from '../../organisms'
import { EvolucaoTab } from './tabs/EvolucaoTab'
import { PerfilTab } from './tabs/PerfilTab'
import { useEvolucoes } from '../../../hooks/useEvolucoes'
import { useTheme } from '../../../theme'
import type { darkColors } from '../../../theme/dark'
import type { colors as lightColors } from '../../../theme/colors'

type Colors = typeof lightColors | typeof darkColors
type AbaId = 'evolucoes' | 'perfil'

type ProntuarioPageProps = {
  pacienteId: string
  pacienteNome: string
}

type TabBarProps = {
  ativa: AbaId
  onChange: (aba: AbaId) => void
  evoCount: number
  styles: ReturnType<typeof makeStyles>
  colors: Colors
}

function TabBar({ ativa, onChange, evoCount, styles, colors }: TabBarProps) {
  const abas: { id: AbaId; label: string; badge?: number }[] = [
    { id: 'evolucoes', label: 'Evoluções', badge: evoCount },
    { id: 'perfil', label: 'Perfil' },
  ]

  return (
    <View style={styles.tabBar}>
      {abas.map((aba) => {
        const ativa_ = ativa === aba.id
        return (
          <Pressable
            key={aba.id}
            style={styles.tabBtn}
            onPress={() => onChange(aba.id)}
          >
            <View style={styles.tabBtnInner}>
              <Text style={[styles.tabLabel, ativa_ && styles.tabLabelAtiva]}>
                {aba.label}
              </Text>
              {aba.badge != null && aba.badge > 0 && (
                <View style={[styles.badge, ativa_ && styles.badgeAtiva]}>
                  <Text style={[styles.badgeText, ativa_ && styles.badgeTextAtiva]}>
                    {aba.badge}
                  </Text>
                </View>
              )}
            </View>
            <View style={[styles.tabIndicator, ativa_ && styles.tabIndicatorAtivo]} />
          </Pressable>
        )
      })}
    </View>
  )
}

export function ProntuarioPage({ pacienteId, pacienteNome }: ProntuarioPageProps) {
  const router = useRouter()
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const [abaAtiva, setAbaAtiva] = useState<AbaId>('evolucoes')
  const [perfilVisitado, setPerfilVisitado] = useState(false)

  const { evolucoes, loading: evoLoading, erro: evoErro } = useEvolucoes(pacienteId)

  function handleChangeAba(aba: AbaId) {
    setAbaAtiva(aba)
    if (aba === 'perfil') setPerfilVisitado(true)
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title={pacienteNome}
        showBack
        onBack={() => router.back()}
        showProfile={false}
        lockUnidade
      />

      <TabBar
        ativa={abaAtiva}
        onChange={handleChangeAba}
        evoCount={evolucoes.length}
        styles={styles}
        colors={colors}
      />

      <View style={styles.content}>
        <View style={[styles.tabPane, abaAtiva !== 'evolucoes' && styles.tabPaneHidden]}>
          <EvolucaoTab
            pacienteId={pacienteId}
            evolucoes={evolucoes}
            loading={evoLoading}
            erro={evoErro}
          />
        </View>

        {perfilVisitado && (
          <View style={[styles.tabPane, abaAtiva !== 'perfil' && styles.tabPaneHidden]}>
            <PerfilTab pacienteId={pacienteId} />
          </View>
        )}
      </View>
    </View>
  )
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.neutral[10],
    },
    // Tab bar
    tabBar: {
      flexDirection: 'row',
      backgroundColor: c.neutral[0],
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    tabBtn: {
      flex: 1,
      paddingTop: 14,
    },
    tabBtnInner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingBottom: 13,
    },
    tabLabel: {
      fontSize: 14.5,
      fontWeight: '500',
      color: c.neutral[60],
    },
    tabLabelAtiva: {
      fontWeight: '700',
      color: c.primary[70],
    },
    badge: {
      backgroundColor: c.neutral[20],
      borderRadius: 999,
      paddingHorizontal: 7,
      paddingVertical: 1,
    },
    badgeAtiva: {
      backgroundColor: c.primary[10],
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: c.neutral[50],
    },
    badgeTextAtiva: {
      color: c.primary[70],
    },
    tabIndicator: {
      height: 2.5,
      borderRadius: 3,
      backgroundColor: 'transparent',
    },
    tabIndicatorAtivo: {
      backgroundColor: c.primary[70],
    },
    // Content
    content: {
      flex: 1,
    },
    tabPane: {
      flex: 1,
    },
    tabPaneHidden: {
      display: 'none',
    },
  })
}
