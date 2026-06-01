import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../../theme';
import type { Patient } from '../../../types/patient';
import { calcularIdade } from '../../../types/patient';
import { Icon } from '../../atoms';
import { makeStyles } from './styles';

type PatientCardProps = {
  patient: Patient;
  onPress: () => void;
};

export function PatientCard({ patient, onPress }: PatientCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const isAtivo = patient.is_active;
  const idade = calcularIdade(patient.datanascimento);

  const linhaData = patient.datanascimento
    ? idade !== null
      ? `${patient.datanascimento} · ${idade} anos`
      : patient.datanascimento
    : null;

  const linhaCpf = patient.cpf ? `CPF: ${patient.cpf}` : null;
  const linhaResponsavel = patient.nomeresponsavel
    ? `Responsável: ${patient.nomeresponsavel}`
    : null;

  const semDados = !linhaData && !linhaCpf && !linhaResponsavel;

  return (
    <Pressable style={[styles.container, !isAtivo && styles.containerInativo]} onPress={onPress}>
      <View style={[styles.avatar, !isAtivo && styles.avatarInativo]}>
        <Text style={[styles.avatarInitial, !isAtivo && styles.avatarInitialInativo]}>
          {patient.nome.charAt(0)}
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nomeRow}>
          <Text style={styles.nome} numberOfLines={1}>
            {patient.nome}
          </Text>
          {!isAtivo && (
            <View style={styles.badgeInativo}>
              <Text style={styles.badgeInativoText}>Inativo</Text>
            </View>
          )}
        </View>
        {linhaResponsavel ? (
          <Text style={styles.meta} numberOfLines={1}>
            {linhaResponsavel}
          </Text>
        ) : null}
        {semDados ? (
          <Text style={styles.meta} numberOfLines={1}>
            Sem dados cadastrais
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={onPress} hitSlop={6}>
          <Icon name="id-card-outline" size={40} color={colors.primary[70]} />
        </Pressable>
      </View>
    </Pressable>
  );
}
