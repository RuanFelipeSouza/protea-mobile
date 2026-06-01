import { useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePacientes } from '../../../hooks/usePacientes';
import type { TaskState } from '../../../services/relatorioService';
import { relatorioService } from '../../../services/relatorioService';
import { useTheme } from '../../../theme';
import type { darkColors } from '../../../theme/dark'
import type { colors as lightColors } from '../../../theme/colors'
import type { Patient } from '../../../types/patient';
import { HeaderBar, UnidadeRequired } from '../../organisms';

type Colors = typeof lightColors | typeof darkColors

function maskData(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

type GeracaoState = 'idle' | 'gerando' | 'pronto' | 'erro';

export function RelatoriosPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Patient | null>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [geracaoState, setGeracaoState] = useState<GeracaoState>('idle');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskState, setTaskState] = useState<TaskState>('PENDING');
  const [erroMsg, setErroMsg] = useState('');

  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tentativasRef = useRef(0);

  const { pacientes, loading: loadingBusca } = usePacientes(pacienteSelecionado ? '' : searchQuery);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, []);

  function handleSelecionarPaciente(patient: Patient) {
    setPacienteSelecionado(patient);
    setSearchQuery('');
  }

  function handleLimparPaciente() {
    setPacienteSelecionado(null);
    setGeracaoState('idle');
    setTaskId(null);
    tentativasRef.current = 0;
  }

  async function handleGerar() {
    if (!pacienteSelecionado) return;

    setGeracaoState('gerando');
    setErroMsg('');
    tentativasRef.current = 0;

    if (USE_MOCK) {
      setTimeout(() => {
        setGeracaoState('pronto');
        setTaskId('mock-task-id');
      }, 3000);
      return;
    }

    try {
      const id = await relatorioService.iniciarRelatorio({
        paciente_id: Number(pacienteSelecionado.id),
        data_inicio: dataInicio || null,
        data_fim: dataFim || null,
      });
      setTaskId(id);
      pollingRef.current = setTimeout(() => poll(id), 10000);
    } catch (e: any) {
      console.error('[RelatoriosPage] erro ao iniciar:', e?.message);
      setGeracaoState('erro');
      setErroMsg('Erro ao iniciar geração do relatório');
    }
  }

  async function poll(id: string) {
    tentativasRef.current += 1;
    if (tentativasRef.current > 30) {
      setGeracaoState('erro');
      setErroMsg('Tempo de espera excedido. Tente novamente.');
      return;
    }

    try {
      const { ready, state } = await relatorioService.verificarStatus(id);
      setTaskState(state);

      if (state === 'FAILURE') {
        setGeracaoState('erro');
        setErroMsg('Falha ao gerar o relatório');
        return;
      }

      if (ready) {
        setGeracaoState('pronto');
        return;
      }

      pollingRef.current = setTimeout(() => poll(id), 5000);
    } catch {
      pollingRef.current = setTimeout(() => poll(id), 5000);
    }
  }

  async function handleAbrirPdf() {
    if (!taskId || !pacienteSelecionado) return;

    if (USE_MOCK) {
      setErroMsg('PDF disponível apenas com backend configurado (modo demonstração)');
      return;
    }

    try {
      await relatorioService.downloadEAbrirPdf(taskId, pacienteSelecionado.nome);
    } catch (e: any) {
      console.error('[RelatoriosPage] erro ao abrir PDF:', e?.message);
      setErroMsg('Erro ao abrir o PDF. Tente novamente.');
    }
  }

  const podeBuscar = !pacienteSelecionado && searchQuery.length >= 2;
  const podeGerar = !!pacienteSelecionado && geracaoState === 'idle';

  return (
    <View style={styles.container}>
      <HeaderBar title="Relatórios" showBack onBack={() => router.back()} showProfile={false} />

      <UnidadeRequired contextMessage="Selecione a unidade na home para gerar relatórios.">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>Paciente</Text>

          {!pacienteSelecionado ? (
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={16} color={colors.neutral[50]} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar paciente..."
                  placeholderTextColor={colors.neutral[50]}
                />
                {loadingBusca && (
                  <ActivityIndicator size="small" color={colors.primary[60]} />
                )}
              </View>

              {podeBuscar && pacientes.length > 0 && (
                <View style={styles.sugestoes}>
                  {pacientes.slice(0, 6).map((p) => (
                    <Pressable
                      key={p.id}
                      style={styles.sugestaoItem}
                      onPress={() => handleSelecionarPaciente(p)}
                    >
                      <Text style={styles.sugestaoNome}>{p.nome}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {podeBuscar && !loadingBusca && pacientes.length === 0 && (
                <Text style={styles.hintText}>Nenhum paciente encontrado</Text>
              )}

              {!podeBuscar && searchQuery.length > 0 && searchQuery.length < 2 && (
                <Text style={styles.hintText}>Digite ao menos 2 letras para buscar</Text>
              )}
            </>
          ) : (
            <View style={styles.pacienteBadge}>
              <Ionicons name="person" size={16} color={colors.primary[70]} />
              <Text style={styles.pacienteBadgeNome}>{pacienteSelecionado.nome}</Text>
              <Pressable onPress={handleLimparPaciente} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.neutral[50]} />
              </Pressable>
            </View>
          )}

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Período (opcional)</Text>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>De</Text>
              <TextInput
                style={styles.dateInput}
                value={dataInicio}
                onChangeText={(v) => setDataInicio(maskData(v))}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colors.neutral[40]}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>Até</Text>
              <TextInput
                style={styles.dateInput}
                value={dataFim}
                onChangeText={(v) => setDataFim(maskData(v))}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colors.neutral[40]}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          <Pressable
            style={[styles.gerarBtn, !podeGerar && styles.gerarBtnDisabled]}
            onPress={handleGerar}
            disabled={!podeGerar}
          >
            <Ionicons name="document-text-outline" size={18} color={colors.neutral[0]} />
            <Text style={styles.gerarBtnText}>Gerar Relatório</Text>
          </Pressable>

          {geracaoState === 'gerando' && (
            <View style={styles.statusBox}>
              <ActivityIndicator size="small" color={colors.primary[70]} />
              <View style={styles.statusTextBlock}>
                <Text style={styles.statusTitle}>Gerando PDF...</Text>
                <Text style={styles.statusSub}>
                  {taskState === 'PENDING' && 'Aguardando na fila'}
                  {taskState === 'STARTED' && 'Processando'}
                  {taskState === 'RETRY' && 'Tentando novamente'}
                  {taskState === 'SUCCESS' && 'Finalizando'}
                </Text>
                <Text style={styles.statusHint}>Isso pode levar alguns instantes</Text>
              </View>
            </View>
          )}

          {geracaoState === 'pronto' && (
            <View style={styles.statusBox}>
              <Ionicons name="checkmark-circle" size={28} color={colors.success[60]} />
              <View style={styles.statusTextBlock}>
                <Text style={styles.statusTitle}>PDF pronto!</Text>
                {USE_MOCK && (
                  <Text style={styles.statusSub}>
                    Modo demonstração — backend necessário para abrir
                  </Text>
                )}
              </View>
              <Pressable style={styles.abrirBtn} onPress={handleAbrirPdf}>
                <Text style={styles.abrirBtnText}>Abrir PDF</Text>
              </Pressable>
            </View>
          )}

          {geracaoState === 'erro' && (
            <View style={styles.statusBox}>
              <Ionicons name="alert-circle" size={28} color={colors.error[40]} />
              <View style={styles.statusTextBlock}>
                <Text style={[styles.statusTitle, { color: colors.error[40] }]}>Erro</Text>
                <Text style={styles.statusSub}>{erroMsg}</Text>
              </View>
              <Pressable
                style={styles.abrirBtn}
                onPress={() => {
                  setGeracaoState('idle');
                  setErroMsg('');
                  setTaskId(null);
                  tentativasRef.current = 0;
                }}
              >
                <Text style={styles.abrirBtnText}>Tentar novamente</Text>
              </Pressable>
            </View>
          )}

          {erroMsg !== '' && geracaoState === 'pronto' && (
            <Text style={styles.erroInline}>{erroMsg}</Text>
          )}
        </ScrollView>
      </UnidadeRequired>
    </View>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.neutral[10],
    },
    scroll: {
      padding: 16,
      gap: 8,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: c.neutral[60],
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.neutral[0],
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: c.neutral[90],
    },
    sugestoes: {
      backgroundColor: c.neutral[0],
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.neutral[20],
      overflow: 'hidden',
      marginTop: 4,
    },
    sugestaoItem: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.neutral[20],
    },
    sugestaoNome: {
      fontSize: 14,
      color: c.neutral[90],
    },
    hintText: {
      fontSize: 13,
      color: c.neutral[50],
      marginTop: 4,
      marginLeft: 4,
    },
    pacienteBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.primary[10],
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      borderWidth: 1,
      borderColor: c.primary[30],
    },
    pacienteBadgeNome: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: c.primary[90],
    },
    dateRow: {
      flexDirection: 'row',
      gap: 10,
    },
    dateField: {
      flex: 1,
      gap: 4,
    },
    dateLabel: {
      fontSize: 12,
      color: c.neutral[60],
    },
    dateInput: {
      backgroundColor: c.neutral[0],
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 9,
      fontSize: 14,
      color: c.neutral[90],
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    gerarBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.primary[70],
      borderRadius: 10,
      paddingVertical: 14,
      marginTop: 8,
    },
    gerarBtnDisabled: {
      backgroundColor: c.neutral[30],
    },
    gerarBtnText: {
      color: c.neutral[0],
      fontSize: 15,
      fontWeight: '600',
    },
    statusBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.neutral[0],
      borderRadius: 10,
      padding: 14,
      gap: 12,
      marginTop: 16,
      borderWidth: 1,
      borderColor: c.neutral[20],
    },
    statusTextBlock: {
      flex: 1,
      gap: 2,
    },
    statusTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: c.neutral[90],
    },
    statusSub: {
      fontSize: 12,
      color: c.neutral[60],
    },
    statusHint: {
      fontSize: 11,
      color: c.neutral[50],
      marginTop: 2,
    },
    abrirBtn: {
      backgroundColor: c.primary[70],
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    abrirBtnText: {
      color: c.neutral[0],
      fontSize: 13,
      fontWeight: '600',
    },
    erroInline: {
      fontSize: 12,
      color: c.error[40],
      marginTop: 4,
    },
  });
}
