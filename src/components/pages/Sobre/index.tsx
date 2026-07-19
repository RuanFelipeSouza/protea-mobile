import { useMemo } from 'react'
import { View, Text, Image, ScrollView, StatusBar, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { HeaderBar } from '../../organisms'
import { useSemanticColors } from '../../../theme'

const ICON_LIGHT = require('../../../../assets/images/protea-login-icon.jpeg')
const ICON_DARK = require('../../../../assets/images/protea-login-icon-dark.png')

const VERSION = '1.0.0'

const FEATURES = [
  { icon: 'calendar-outline' as const, title: 'Agenda', desc: 'Visualize e gerencie sua agenda de atendimentos do dia.' },
  { icon: 'people-outline' as const, title: 'Pacientes', desc: 'Acesse a lista de pacientes por unidade com busca rápida.' },
  { icon: 'document-text-outline' as const, title: 'Prontuário', desc: 'Consulte evoluções, acompanhamentos e documentos do paciente.' },
  { icon: 'create-outline' as const, title: 'Evoluções', desc: 'Registre e assine evoluções diretamente pelo app.' },
  { icon: 'alert-circle-outline' as const, title: 'Pendências', desc: 'Acompanhe itens pendentes de atenção na sua unidade.' },
]

export function SobrePage() {
  const router = useRouter()
  const { dark, colors } = useSemanticColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <View style={styles.container}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <HeaderBar title="Sobre o app" showUnidade={false} showBack onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / identidade */}
        <View style={styles.heroCard}>
          <View style={styles.logoBox}>
            <Image source={dark ? ICON_DARK : ICON_LIGHT} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>Protea</Text>
          <Text style={styles.appSub}>Plataforma de Saúde</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v{VERSION}</Text>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que é o Protea?</Text>
          <Text style={styles.cardBody}>
            O Protea é uma plataforma móvel desenvolvida para profissionais de saúde.
            Centraliza informações clínicas, facilita o registro de evoluções e mantém
            a equipe conectada — tudo em tempo real, de qualquer lugar.
          </Text>
        </View>

        {/* Funcionalidades */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Funcionalidades</Text>
          {FEATURES.map((f, i) => (
            <View key={f.title} style={[styles.featureRow, i > 0 && styles.featureRowBorder]}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Rodapé */}
        <Text style={styles.footer}>© 2025 Protea Neurodesenvolvimento — Todos os direitos reservados.</Text>
      </ScrollView>
    </View>
  )
}

const makeStyles = (c: ReturnType<typeof useSemanticColors>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: 16, gap: 14, paddingBottom: 40 },

    heroCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 28,
      alignItems: 'center',
      gap: 6,
    },
    logoBox: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    logoImage: { width: 168, height: 168 * (410 / 1600) },
    appName: { fontSize: 24, fontWeight: '800', color: c.text },
    appSub: { fontSize: 14, color: c.textMuted },
    versionBadge: {
      marginTop: 8,
      backgroundColor: c.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 999,
    },
    versionText: { fontSize: 12, fontWeight: '600', color: c.primary },

    card: {
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 16,
      gap: 10,
    },
    cardTitle: { fontSize: 15, fontWeight: '700', color: c.text },
    cardBody: { fontSize: 14, color: c.textMuted, lineHeight: 21 },

    featureRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      paddingVertical: 10,
    },
    featureRowBorder: { borderTopWidth: 1, borderTopColor: c.divider },
    featureIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureText: { flex: 1 },
    featureTitle: { fontSize: 14, fontWeight: '600', color: c.text },
    featureDesc: { fontSize: 13, color: c.textMuted, marginTop: 2, lineHeight: 18 },

    footer: {
      textAlign: 'center',
      fontSize: 12,
      color: c.textFaint,
      marginTop: 4,
    },
  })
