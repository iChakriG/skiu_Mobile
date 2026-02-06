import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';
import { useAuth } from '../context/AuthContext';
import { getBaseUrl } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { user, loading, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>API base URL</Text>
        <Text style={styles.value}>{getBaseUrl()}</Text>
        <Text style={styles.hint}>
          Set EXPO_PUBLIC_API_URL in .env to change. Restart the app after changing.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Account</Text>
        {isAuthenticated && user ? (
          <>
            <Text style={styles.email}>{user.email}</Text>
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
              <Text style={styles.signOutBtnText}>Sign out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.hint}>Sign in to use cart and orders.</Text>
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.signInBtnText}>Sign in</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '700', marginBottom: 24 },
  section: { marginBottom: 24 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' },
  value: { color: '#0ea5e9', fontSize: 14, fontFamily: 'monospace', marginBottom: 4 },
  hint: { color: '#64748b', fontSize: 12, marginBottom: 12 },
  email: { color: '#f8fafc', fontSize: 16, marginBottom: 12 },
  signOutBtn: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutBtnText: { color: '#f87171', fontWeight: '600' },
  signInBtn: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signInBtnText: { color: '#fff', fontWeight: '600' },
});
