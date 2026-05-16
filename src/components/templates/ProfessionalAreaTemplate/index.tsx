import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ScrollView } from 'react-native';
import { ActionGrid, TodayAgendaSection } from '../../organisms';
import { styles } from './styles';

type ActionItem = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
};

type ProfessionalAreaTemplateProps = {
  actions: ActionItem[];
};

export function ProfessionalAreaTemplate({ actions }: ProfessionalAreaTemplateProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ActionGrid items={actions} />
      <TodayAgendaSection />
      {/* <AlertsSection alerts={alerts} onVerTodos={onVerTodos} /> */}
    </ScrollView>
  );
}
