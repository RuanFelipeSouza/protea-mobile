import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LineChart } from 'react-native-chart-kit'
import { useAcompanhamentos } from '../../../../hooks/useAcompanhamentos'
import { theme } from '../../../../theme'
import type { Acompanhamento } from '../../../../types/acompanhamento'

type AcompanhamentoTabProps = {
  pacienteId: string
}

type Medida = { label: string; valor: string; unidade: string }

const SCREEN_WIDTH = Dimensions.get('window').width

function buildMedidas(a: Acompanhamento): Medida[] {
  const items: Medida[] = [
    { label: 'Peso', valor: a.peso ?? '—', unidade: 'kg' },
    { label: 'Altura', valor: a.altura ?? '—', unidade: 'cm' },
    { label: 'PA Sistólica', valor: a.pasistolica ?? '—', unidade: 'mmHg' },
    { label: 'PA Diastólica', valor: a.padiastolica ?? '—', unidade: 'mmHg' },
    { label: 'Freq. Cardíaca', valor: a.freqcard ?? '—', unidade: 'bpm' },
    { label: 'Freq. Resp.', valor: a.freqresp ?? '—', unidade: 'rpm' },
    { label: 'Temperatura', valor: a.tempcorporal ?? '—', unidade: '°C' },
    { label: 'Saturação', valor: a.saturacao ?? '—', unidade: '%' },
    { label: 'HGT', valor: a.hgt ?? '—', unidade: 'mg/dL' },
    { label: 'Circ. Abdominal', valor: a.circabdominal ?? '—', unidade: 'cm' },
    { label: 'Perím. Cefálico', valor: a.perimetrocefalico ?? '—', unidade: 'cm' },
  ]
  return items.filter((m) => m.valor !== '—')
}

function formatDateLabel(dateStr: string): string {
  const parts = (dateStr ?? '').split('/')
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : dateStr
}

function PesoChart({ acompanhamentos }: { acompanhamentos: Acompanhamento[] }) {
  const dadosPeso = acompanhamentos
    .filter((a) => a.peso != null && !isNaN(parseFloat(a.peso!)))
    .slice(-6)

  if (dadosPeso.length < 2) return null

  const labels = dadosPeso.map((a) => formatDateLabel(a.datastr ?? a.data ?? ''))
  const values = dadosPeso.map((a) => parseFloat(a.peso!))

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Evolução do Peso (kg)</Text>
      <LineChart
        data={{ labels, datasets: [{ data: values }] }}
        width={SCREEN_WIDTH - 64}
        height={160}
        bezier
        fromZero={false}
        chartConfig={{
          backgroundColor: theme.colors.neutral[0],
          backgroundGradientFrom: theme.colors.neutral[0],
          backgroundGradientTo: theme.colors.neutral[0],
          decimalPlaces: 1,
          color: () => theme.colors.primary[70],
          labelColor: () => theme.colors.neutral[50],
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.primary[80],
          },
          propsForBackgroundLines: {
            stroke: theme.colors.neutral[20],
          },
        }}
        style={styles.chart}
      />
    </View>
  )
}

function UltimasMedidas({ acomp }: { acomp: Acompanhamento }) {
  const medidas = buildMedidas(acomp)

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Última medição</Text>
        <Text style={styles.cardDate}>{acomp.datastr ?? acomp.data}</Text>
      </View>
      {acomp.nomeprofissional && (
        <View style={styles.profRow}>
          <Ionicons name="person-outline" size={13} color={theme.colors.neutral[50]} />
          <Text style={styles.profText}>{acomp.nomeprofissional}</Text>
        </View>
      )}
      <View style={styles.medidaGrid}>
        {medidas.map((m) => (
          <View key={m.label} style={styles.medidaItem}>
            <Text style={styles.medidaLabel}>{m.label}</Text>
            <Text style={styles.medidaValor}>
              {m.valor} <Text style={styles.medidaUnidade}>{m.unidade}</Text>
            </Text>
          </View>
        ))}
      </View>
      {acomp.observacoes ? (
        <View style={styles.obsBox}>
          <Text style={styles.obsLabel}>Observações</Text>
          <Text style={styles.obsText}>{acomp.observacoes}</Text>
        </View>
      ) : null}
    </View>
  )
}

function HistoricoItem({ acomp }: { acomp: Acompanhamento }) {
  return (
    <View style={styles.historicoCard}>
      <Text style={styles.historicoDate}>{acomp.datastr ?? acomp.data}</Text>
      <View style={styles.historicoRow}>
        {acomp.peso ? <Text style={styles.historicoChip}>{acomp.peso} kg</Text> : null}
        {acomp.altura ? <Text style={styles.historicoChip}>{acomp.altura} cm</Text> : null}
        {acomp.saturacao ? <Text style={styles.historicoChip}>Sat {acomp.saturacao}%</Text> : null}
        {acomp.tempcorporal ? <Text style={styles.historicoChip}>{acomp.tempcorporal}°C</Text> : null}
      </View>
    </View>
  )
}

export function AcompanhamentoTab({ pacienteId }: AcompanhamentoTabProps) {
  const { acompanhamentos, loading, erro } = useAcompanhamentos(pacienteId)

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary[70]} />
      </View>
    )
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={40} color={theme.colors.error[60]} />
        <Text style={styles.erroText}>{erro}</Text>
      </View>
    )
  }

  if (acompanhamentos.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="pulse-outline" size={48} color={theme.colors.neutral[30]} />
        <Text style={styles.emptyText}>Nenhum acompanhamento registrado</Text>
      </View>
    )
  }

  const [ultimo, ...historico] = acompanhamentos

  return (
    <FlatList
      data={historico}
      keyExtractor={(_, i) => String(i)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <>
          <PesoChart acompanhamentos={acompanhamentos} />
          <UltimasMedidas acomp={ultimo} />
          {historico.length > 0 && (
            <Text style={styles.historicoTitulo}>Histórico</Text>
          )}
        </>
      }
      renderItem={({ item }) => <HistoricoItem acomp={item} />}
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  erroText: { fontSize: 14, color: theme.colors.error[60] },
  emptyText: { fontSize: 14, color: theme.colors.neutral[50] },
  list: {
    padding: 16,
    gap: 12,
  },
  chartCard: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.neutral[60],
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 8,
  },
  card: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.neutral[90],
  },
  cardDate: {
    fontSize: 12,
    color: theme.colors.neutral[50],
  },
  profRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profText: {
    fontSize: 13,
    color: theme.colors.neutral[60],
  },
  medidaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  medidaItem: {
    width: '47%',
    backgroundColor: theme.colors.neutral[10],
    borderRadius: 8,
    padding: 10,
  },
  medidaLabel: {
    fontSize: 11,
    color: theme.colors.neutral[50],
    marginBottom: 4,
  },
  medidaValor: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.neutral[90],
  },
  medidaUnidade: {
    fontSize: 11,
    fontWeight: '400',
    color: theme.colors.neutral[50],
  },
  obsBox: {
    backgroundColor: theme.colors.neutral[10],
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  obsLabel: {
    fontSize: 11,
    color: theme.colors.neutral[50],
  },
  obsText: {
    fontSize: 13,
    color: theme.colors.neutral[80],
  },
  historicoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.neutral[60],
    marginTop: 8,
    marginBottom: 4,
  },
  historicoCard: {
    backgroundColor: theme.colors.neutral[0],
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.neutral[20],
  },
  historicoDate: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.neutral[70],
  },
  historicoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  historicoChip: {
    backgroundColor: theme.colors.primary[10],
    color: theme.colors.primary[80],
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
})
