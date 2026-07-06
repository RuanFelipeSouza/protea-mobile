import { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Icon } from '../../atoms';
import { Dropdown } from '../Dropdown';
import { useTheme } from '../../../theme';
import { calcFolha, bandTone } from '../../../services/folhaRegistroService';
import { alvoslimiteDoPrograma } from '../../../services/folhaRegistroEditorService';
import type {
  FolhaEditorItem,
  FolhaRegistroConfig,
  TentativaEditor,
} from '../../../types/folhaRegistroEditor';
import type { Resultado } from '../../../types/folhaRegistro';
import { makeStyles } from './styles';

type Colors = ReturnType<typeof useTheme>['colors'];

const RESULTS: Resultado[] = [1, 0.5, 0, -1];

function toneColor(c: Colors, pct: number) {
  const t = bandTone(pct);
  return t === 'ok' ? c.success[60] : t === 'warn' ? c.warning[60] : c.error[60];
}
function resultVisual(c: Colors, r: Resultado) {
  if (r === 1) return { sym: '✓', color: c.success[60], soft: c.primary[10] };
  if (r === 0.5) return { sym: '½', color: c.warning[60], soft: c.warning[10] };
  if (r === 0) return { sym: '✕', color: c.error[60], soft: c.error[10] };
  return { sym: '–', color: c.neutral[50], soft: c.neutral[10] };
}

type Props = {
  folha: FolhaEditorItem;
  config: FolhaRegistroConfig;
  open: boolean;
  canRemove: boolean;
  showBulk: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<FolhaEditorItem>) => void;
  onTentativa: (numero: number, patch: Partial<TentativaEditor>) => void;
};

export function FolhaEditorCard({
  folha, config, open, canRemove, showBulk,
  onToggle, onRemove, onChange, onTentativa,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const dominio = config.dominios.find((d) => d.id === folha.dominioId) ?? null;
  const programa = config.programas.find((p) => p.id === folha.programaId) ?? null;
  const ajuda = config.ajudas.find((a) => a.id === folha.ajudaId) ?? null;

  const programasDoDominio = config.programas.filter((p) => p.dominio_id === folha.dominioId);
  const alvosDoPrograma = config.alvos.filter((a) => a.programa_id === folha.programaId);
  const limite = alvoslimiteDoPrograma(config, folha.programaId);

  const resumo = useMemo(() => calcFolha(folha.tentativas), [folha.tentativas]);
  const temValida = resumo.validas > 0;
  const cor = toneColor(colors, resumo.pct);

  // domínio → reseta programa, alvos e os alvos das tentativas
  const onDominio = (id: number) =>
    onChange({ dominioId: id, programaId: null, alvosSelecionados: [],
      tentativas: folha.tentativas.map((t) => ({ ...t, alvo: null })) });
  // programa → reseta alvos e os alvos das tentativas
  const onPrograma = (id: number) =>
    onChange({ programaId: id, alvosSelecionados: [],
      tentativas: folha.tentativas.map((t) => ({ ...t, alvo: null })) });

  const toggleAlvo = (desc: string) => {
    const has = folha.alvosSelecionados.includes(desc);
    if (!has && limite > 0 && folha.alvosSelecionados.length >= limite) return;
    const next = has
      ? folha.alvosSelecionados.filter((x) => x !== desc)
      : [...folha.alvosSelecionados, desc];
    const patch: Partial<FolhaEditorItem> = { alvosSelecionados: next };
    if (has) patch.tentativas = folha.tentativas.map((t) => (t.alvo === desc ? { ...t, alvo: null } : t));
    onChange(patch);
  };

  const allOk = () => onChange({ tentativas: folha.tentativas.map((t) => ({ ...t, resultado: 1 })) });
  const clearAll = () => onChange({ tentativas: folha.tentativas.map((t) => ({ ...t, resultado: -1 })) });

  const atingiuLimite = limite > 0 && folha.alvosSelecionados.length >= limite;

  return (
    <View style={[styles.card, open && styles.cardOpen]}>
      {/* header */}
      <Pressable style={styles.header} onPress={onToggle} android_ripple={{ color: colors.neutral[10] }}>
        <View style={[styles.ordemChip, programa && styles.ordemChipOn]}>
          <Text style={[styles.ordemText, programa && styles.ordemTextOn]}>{folha.ordem}</Text>
        </View>
        <View style={styles.headerTexts}>
          <Text style={[styles.programa, !programa && styles.programaEmpty]} numberOfLines={1}>
            {programa ? programa.descricao : `Folha ${folha.ordem}`}
          </Text>
          <Text style={styles.dominio} numberOfLines={1}>
            {dominio ? dominio.descricao : 'Toque para preencher'}
          </Text>
        </View>
        {temValida && <Text style={[styles.pct, { color: cor }]}>{resumo.pct}%</Text>}
        {canRemove && (
          <Pressable hitSlop={8} style={styles.trash} onPress={onRemove}>
            <Icon name="trash-outline" size={17} color={colors.error[60]} />
          </Pressable>
        )}
        <Icon name="chevron-down" size={18} color={colors.neutral[50]}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
      </Pressable>
      <View style={styles.barWrap}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${temValida ? resumo.pct : 0}%`, backgroundColor: cor }]} />
        </View>
      </View>

      {open && (
        <View style={styles.body}>
          {/* domínio / programa / ajuda */}
          <Field label="Domínio" icon="git-branch-outline" required={!folha.dominioId} colors={colors} styles={styles}>
            <Dropdown options={config.dominios.map((d) => ({ label: d.descricao, value: d.id }))}
              value={folha.dominioId} onChange={(v) => onDominio(v as number)}
              placeholder="Selecione o domínio" modalTitle="Domínio" />
          </Field>
          <Field label="Programa" icon="list-outline" required={!folha.programaId} colors={colors} styles={styles}>
            <Dropdown options={programasDoDominio.map((p) => ({ label: p.descricao, value: p.id }))}
              value={folha.programaId} onChange={(v) => onPrograma(v as number)}
              disabled={!folha.dominioId}
              placeholder={folha.dominioId ? 'Selecione o programa' : 'Selecione o domínio primeiro'}
              modalTitle="Programa" />
          </Field>
          <Field label="Ajuda" icon="hand-left-outline" required={!folha.ajudaId} colors={colors} styles={styles}>
            <Dropdown options={config.ajudas.map((a) => ({ label: a.descricao, value: a.id }))}
              value={folha.ajudaId} onChange={(v) => onChange({ ajudaId: v as number })}
              placeholder="Selecione o tipo de ajuda" modalTitle="Ajuda" />
          </Field>

          {/* alvos */}
          <View>
            <SectionLabel icon="locate-outline" colors={colors} styles={styles}>Alvos trabalhados</SectionLabel>
            {!programa ? (
              <View style={styles.hintBox}>
                <Text style={styles.hintText}>Selecione um programa para escolher os alvos.</Text>
              </View>
            ) : (
              <>
                <View style={styles.alvoMeta}>
                  <Text style={styles.alvoMetaText}>
                    {limite === 0 ? 'Selecione quantos alvos desejar' : `Selecione até ${limite} alvos`}
                  </Text>
                  <View style={[styles.alvoBadge, atingiuLimite && styles.alvoBadgeOk]}>
                    <Text style={[styles.alvoBadgeText, atingiuLimite && styles.alvoBadgeTextOk]}>
                      {limite === 0 ? `${folha.alvosSelecionados.length} selec.` : `${folha.alvosSelecionados.length}/${limite}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.chipsWrap}>
                  {alvosDoPrograma.map((a) => {
                    const sel = folha.alvosSelecionados.includes(a.descricao);
                    const dis = !sel && atingiuLimite;
                    return (
                      <Pressable key={a.id} disabled={dis} onPress={() => toggleAlvo(a.descricao)}
                        style={[styles.alvoChip, sel && styles.alvoChipOn, dis && styles.alvoChipDisabled]}>
                        <Icon name={sel ? 'checkmark' : 'locate-outline'} size={14}
                          color={sel ? colors.neutral[0] : colors.primary[70]} />
                        <Text style={[styles.alvoChipText, sel && styles.alvoChipTextOn]}>{a.descricao}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </View>

          {/* tentativas (LISTA) */}
          <View>
            <SectionLabel icon="apps-outline" colors={colors} styles={styles}
              right={`${folha.tentativas.length} tentativas`}>Registro das tentativas</SectionLabel>
            {showBulk && (
              <View style={styles.bulkRow}>
                <Pressable style={[styles.bulkBtn, styles.bulkOk]} onPress={allOk}>
                  <Icon name="flash-outline" size={15} color={colors.success[60]} />
                  <Text style={[styles.bulkText, { color: colors.success[60] }]}>Tudo acerto</Text>
                </Pressable>
                <Pressable style={[styles.bulkBtn, styles.bulkClear]} onPress={clearAll}>
                  <Icon name="backspace-outline" size={15} color={colors.neutral[70]} />
                  <Text style={[styles.bulkText, { color: colors.neutral[70] }]}>Limpar</Text>
                </Pressable>
              </View>
            )}
            <View style={{ gap: 8 }}>
              {folha.tentativas.map((t) => (
                <TentativaRow key={t.numero} t={t} alvos={folha.alvosSelecionados}
                  onSetResultado={(r) => onTentativa(t.numero, { resultado: r })}
                  onSetAlvo={(a) => onTentativa(t.numero, { alvo: a })}
                  colors={colors} styles={styles} />
              ))}
            </View>
          </View>

          {/* observações */}
          <View>
            <SectionLabel icon="chatbubble-ellipses-outline" colors={colors} styles={styles}>Observações</SectionLabel>
            <TextInput value={folha.observacao} onChangeText={(v) => onChange({ observacao: v.slice(0, 200) })}
              multiline placeholder="Observações da sessão…" placeholderTextColor={colors.neutral[40]}
              style={styles.obsInput} />
            <Text style={styles.obsCount}>{folha.observacao.length}/200</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ── Linha de tentativa (LISTA) ───────────────────────────────────────────────
function TentativaRow({
  t, alvos, onSetResultado, onSetAlvo, colors, styles,
}: {
  t: TentativaEditor; alvos: string[];
  onSetResultado: (r: Resultado) => void; onSetAlvo: (a: string) => void;
  colors: Colors; styles: ReturnType<typeof makeStyles>;
}) {
  const [alvoOpen, setAlvoOpen] = useState(false);
  const done = t.resultado !== -1 && t.resultado != null;
  const dv = resultVisual(colors, t.resultado);
  return (
    <View style={[styles.row, done && { backgroundColor: dv.soft }]}>
      <View style={styles.rowTop}>
        <View style={[styles.rowNum, done && { backgroundColor: dv.color }]}>
          <Text style={[styles.rowNumText, done && { color: colors.neutral[0] }]}>{t.numero}</Text>
        </View>
        <Pressable disabled={alvos.length === 0} onPress={() => setAlvoOpen(true)}
          style={[styles.alvoPill, t.alvo && styles.alvoPillOn]}>
          <Icon name="locate-outline" size={12} color={colors.primary[70]} />
          <Text style={[styles.alvoPillText, t.alvo && styles.alvoPillTextOn]} numberOfLines={1}>
            {t.alvo ?? (alvos.length ? 'Definir alvo' : 'Sem alvos')}
          </Text>
          {alvos.length > 0 && <Icon name="chevron-down" size={12} color={colors.neutral[50]} />}
        </Pressable>
        <Dropdown renderTrigger={false} open={alvoOpen} onOpenChange={setAlvoOpen}
          options={alvos.map((a) => ({ label: a, value: a }))} value={t.alvo}
          onChange={(v) => onSetAlvo(v as string)} modalTitle="Alvo da tentativa" />
      </View>
      <View style={styles.resultRow}>
        {RESULTS.map((r) => {
          const v = resultVisual(colors, r);
          const active = t.resultado === r;
          return (
            <Pressable key={String(r)} onPress={() => onSetResultado(r)}
              style={[styles.resultBtn, { borderColor: active ? v.color : colors.neutral[20],
                backgroundColor: active ? v.color : colors.neutral[0] }]}>
              <Text style={[styles.resultSym, { color: active ? colors.neutral[0] : v.color }]}>{v.sym}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ── Auxiliares de layout ─────────────────────────────────────────────────────
function Field({ label, icon, required, children, colors, styles }: any) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHead}>
        <Icon name={icon} size={15} color={colors.primary[70]} />
        <Text style={styles.fieldLabel}>{label}</Text>
        {required && <Text style={styles.req}>*</Text>}
      </View>
      {children}
    </View>
  );
}
function SectionLabel({ icon, children, right, colors, styles }: any) {
  return (
    <View style={styles.sectionLabel}>
      <Icon name={icon} size={13} color={colors.primary[70]} />
      <Text style={styles.sectionLabelText}>{children}</Text>
      {right && <Text style={styles.sectionLabelRight}>{right}</Text>}
    </View>
  );
}
