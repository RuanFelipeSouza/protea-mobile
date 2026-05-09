import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HeaderBar } from '../../src/components/organisms';
import { removeToken } from '../../src/services/authService';
import { useAuthStore } from '../../src/stores/authStore';
import { theme } from '../../src/theme';

export default function PerfilScreen() {
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await removeToken();
    logout();
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="Perfil" showUnidade={false} />
      <View style={{ flex: 1, backgroundColor: theme.colors.neutral[10], padding: 24 }}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.error[100],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
