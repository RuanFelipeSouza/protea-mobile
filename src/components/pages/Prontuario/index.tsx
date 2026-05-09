import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { HeaderBar } from '../../organisms'
import { EvolucaoTab } from './tabs/EvolucaoTab'
import { AcompanhamentoTab } from './tabs/AcompanhamentoTab'
import { DocumentosTab } from './tabs/DocumentosTab'
import { theme } from '../../../theme'

const TABS = [
  { key: 'evolucoes', label: 'Evoluções' },
  { key: 'acompanhamento', label: 'Acompanhamento' },
  { key: 'documentos', label: 'Documentos' },
] as const

type TabKey = (typeof TABS)[number]['key']

type ProntuarioPageProps = {
  pacienteId: string
  pacienteNome: string
}

export function ProntuarioPage({ pacienteId, pacienteNome }: ProntuarioPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('evolucoes')

  return (
    <View style={styles.container}>
      <HeaderBar
        title={pacienteNome}
        showBack
        onBack={() => router.back()}
        showProfile={false}
        lockUnidade
      />

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {activeTab === 'evolucoes' && <EvolucaoTab pacienteId={pacienteId} />}
        {activeTab === 'acompanhamento' && <AcompanhamentoTab pacienteId={pacienteId} />}
        {activeTab === 'documentos' && <DocumentosTab pacienteId={pacienteId} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[10],
  },
  tabBar: {
    backgroundColor: theme.colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[20],
  },
  tabBarContent: {
    paddingHorizontal: 16,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary[70],
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.neutral[50],
  },
  tabLabelActive: {
    color: theme.colors.primary[70],
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
})
