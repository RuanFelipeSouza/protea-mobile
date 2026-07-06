import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '../../atoms';
import { useTheme } from '../../../theme';
import { FolhaEditorCard } from '../../molecules/FolhaEditorCard';
import { calcGeral, bandTone } from '../../../services/folhaRegistroService';
import {
  folhaRegistroEditorService,
  novaFolha,
  montarDoRegistro,
  buildPayload,
  validarFolhas,
} from '../../../services/folhaRegistroEditorService';
import {
  carregarRascunho, limparRascunho, useAutoSaveRascunho,
} from '../../../hooks/useFolhaRegistroDraft';
import type {
  FolhaEditorItem, FolhaRegistroConfig, TentativaEditor,
} from '../../../types/folhaRegistroEditor';
import type { FolhaRegistro } from '../../../types/folhaRegistro';
import { makeStyles } from './styles';

type Colors = ReturnType<typeof useTheme>['colors'];

function formatData(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function toneColor(c: Colors, pct: number) {
  const t = bandTone(pct);
  return t === 'ok' ? c.success[60] : t === 'warn' ? c.warning[60] : c.error[60];
}

type Props = {
  evolucaoId: number;
  modo: 'criar' | 'editar';
};

export function FolhaRegistroEditor({ evolucaoId, modo }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const router = useRouter();

  const [config, setConfig] = useState<FolhaRegistroConfig | null>(null);
  const [folhas, setFolhas] = useState<FolhaEditorItem[]>([]);
  const [aberta, setAberta] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [rascunhoSalvo, setRascunhoSalvo] = useState(false);

  // carregar config + estado inicial (rascunho > registros do backend > vazio)
  useEffect(() => {
    let vivo = true;
    setLoading(true);
    setErro(null);
    folhaRegistroEditorService
      .getConfig(evolucaoId, modo)
      .then(async (cfg) => {
        if (!vivo) return;
        setConfig(cfg);
        const rascunho = await carregarRascunho(evolucaoId, modo);
        if (!vivo) return;
        if (rascunho) {
          setFolhas(rascunho);
        } else if (modo === 'editar' && cfg.registros?.length) {
          setFolhas(montarDoRegistro(cfg.registros));
        } else {
          setFolhas([novaFolha(1)]);
        }
      })
      .catch((e) => vivo && setErro(e?.message ?? 'Falha ao carregar a folha de registro.'))
      .finally(() => vivo && setLoading(false));
    return () => { vivo = false; };
  }, [evolucaoId, modo]);

  const onRascunhoSalvo = useCallback(() => setRascunhoSalvo(true), []);
  useAutoSaveRascunho(evolucaoId, modo, folhas, onRascunhoSalvo);

  // updates imutáveis
  const setFolha = (uid: string, patch: Partial<FolhaEditorItem>) =>
    setFolhas((fs) => fs.map((f) => (f.uid === uid ? { ...f, ...patch } : f)));
  const setTentativa = (uid: string, numero: number, patch: Partial<TentativaEditor>) =>
    setFolhas((fs) => fs.map((f) =>
      f.uid === uid
        ? { ...f, tentativas: f.tentativas.map((t) => (t.numero === numero ? { ...t, ...patch } : t)) }
        : f));
  const addFolha = () =>
    setFolhas((fs) => {
      const next = [...fs, novaFolha(fs.length + 1)];
      setAberta(next.length - 1);
      return next;
    });
  const removeFolha = (uid: string) =>
    setFolhas((fs) => {
      const next = fs.filter((f) => f.uid !== uid).map((f, i) => ({ ...f, ordem: i + 1 }));
      setAberta((a) => Math.min(a, next.length - 1));
      return next;
    });

  const onSalvar = async () => {
    if (!config) return;
    const erroValidacao = validarFolhas(folhas);
    if (erroValidacao) {
      const idx = folhas.findIndex((f) => f.ordem === erroValidacao.ordem);
      if (idx >= 0) setAberta(idx);
      Alert.alert(`Folha ${erroValidacao.ordem}`, erroValidacao.motivo);
      return;
    }
    try {
      setSalvando(true);
      await folhaRegistroEditorService.salvar(buildPayload(evolucaoId, folhas, config));
      await limparRascunho(evolucaoId, modo);
      Alert.alert(
        'Folha de registro salva',
        'Os registros foram gravados na evolução. A assinatura digital é feita em uma etapa separada.',
        [{ text: 'Concluir', onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert('Erro ao salvar', e?.message ?? 'Não foi possível gravar a folha de registro.');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary[70]} />
      </View>
    );
  }
  if (erro || !config) {
    return (
      <View style={styles.center}>
        <Icon name="alert-circle-outline" size={28} color={colors.neutral[40]} />
        <Text style={styles.erroText}>{erro ?? 'Não foi possível montar a folha de registro.'}</Text>
      </View>
    );
  }

  const at = config.atendimento;
  // calcGeral espera FolhaRegistro[]; aqui só usamos as tentativas, então adaptamos.
  const geral = calcGeral(folhas.map((f) => ({ tentativas: f.tentativas } as unknown as FolhaRegistro)));
  const geralCor = toneColor(colors, geral.pct);
  const geralVazio = geral.validas === 0;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cartão da sessão (read-only) */}
        <View style={styles.card}>
          <Text style={styles.paciente} numberOfLines={2}>{at.paciente}</Text>
          <Text style={styles.especialidade}>{at.especialidade}</Text>
          <View style={styles.sessGrid}>
            <SessField icon="calendar-outline" label="DATA" value={`${formatData(at.data)} · ${at.hora}`} colors={colors} styles={styles} />
            <SessField icon="clipboard-outline" label="CATEGORIA" value={at.categoria} colors={colors} styles={styles} />
            <SessField icon="person-outline" label="PROFISSIONAL" value={at.profissional} colors={colors} styles={styles} />
            <SessField icon="document-text-outline" label="EVOLUÇÃO" value={`#${at.id}`} colors={colors} styles={styles} />
          </View>
        </View>

        {/* Desempenho geral (ao vivo) */}
        <View style={styles.card}>
          <View style={styles.geralHead}>
            <Icon name="stats-chart-outline" size={16} color={colors.primary[70]} />
            <Text style={styles.geralTitle}>Desempenho geral</Text>
            <Text style={[styles.geralPct, { color: geralVazio ? colors.neutral[40] : geralCor }]}>{geral.pct}%</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${geral.pct}%`, backgroundColor: geralCor }]} />
          </View>
          <Text style={styles.geralSub}>
            {geralVazio ? 'Preencha as tentativas para calcular' : `Média ponderada · ${geral.validas} tentativas válidas`}
          </Text>
        </View>

        {/* Folhas */}
        <View style={{ gap: 10 }}>
          {folhas.map((f, i) => (
            <FolhaEditorCard
              key={f.uid}
              folha={f}
              config={config}
              open={aberta === i}
              canRemove={folhas.length > 1}
              showBulk
              onToggle={() => setAberta(aberta === i ? -1 : i)}
              onRemove={() => removeFolha(f.uid)}
              onChange={(patch) => setFolha(f.uid, patch)}
              onTentativa={(numero, patch) => setTentativa(f.uid, numero, patch)}
            />
          ))}
        </View>

        <Pressable style={styles.addBtn} onPress={addFolha}>
          <Icon name="add" size={18} color={colors.primary[90]} />
          <Text style={styles.addText}>Adicionar folha</Text>
        </Pressable>
      </ScrollView>

      {/* Rodapé fixo */}
      <View style={styles.footer}>
        <Pressable style={styles.cancelBtn} onPress={() => router.back()} disabled={salvando}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
        <Pressable style={[styles.saveBtn, salvando && { opacity: 0.7 }]} onPress={onSalvar} disabled={salvando}>
          {salvando
            ? <ActivityIndicator color={colors.neutral[0]} />
            : <><Icon name="save-outline" size={18} color={colors.neutral[0]} /><Text style={styles.saveText}>Salvar</Text></>}
        </Pressable>
      </View>
    </View>
  );
}

function SessField({ icon, label, value, colors, styles }: any) {
  return (
    <View style={styles.sessField}>
      <View style={styles.sessIcon}>
        <Icon name={icon} size={15} color={colors.primary[70]} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.sessLabel}>{label}</Text>
        <Text style={styles.sessValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}
