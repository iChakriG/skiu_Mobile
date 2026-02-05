import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';
import { useUser } from '../context/UserContext';
import { getBaseUrl } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen(_props: Props) {
  const { userId, setUserId, isAuthenticated } = useUser();
  const [input, setInput] = useState(userId ?? '');

  const handleSave = () => {
    setUserId(input.trim() || null);
  };

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
        <Text style={styles.label}>User ID (for cart & orders)</Text>
        <Text style={styles.hint}>
          The API uses x-user-id header. Enter any ID to act as that user (e.g. demo user).
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. user-demo-123"
          placeholderTextColor="#64748b"
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>{isAuthenticated ? 'Update' : 'Set'} user ID</Text>
        </TouchableOpacity>
        {isAuthenticated && (
          <Text style={styles.success}>Using user: {userId}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '700', marginBottom: 24 },
  section: { marginBottom: 24 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' },
  value: { color: '#0ea5e9', fontSize: 14, fontFamily: 'monospace', marginBottom: 4 },
  hint: { color: '#64748b', fontSize: 12, marginBottom: 8 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 14,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
  success: { color: '#22c55e', fontSize: 12, marginTop: 8 },
});
