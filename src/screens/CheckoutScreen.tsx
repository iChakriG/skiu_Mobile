import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createOrder } from '../api/orders';
import type { Address } from '../types/order';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export function CheckoutScreen({ navigation }: Props) {
  const { userId } = useAuth();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const address: Address = {
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    zipCode: zipCode.trim(),
    country: country.trim(),
  };
  const isValid =
    address.street &&
    address.city &&
    address.state &&
    address.zipCode &&
    address.country;

  const handlePlaceOrder = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please sign in to place an order.');
      return;
    }
    if (!isValid) {
      Alert.alert('Invalid address', 'Please fill all shipping fields.');
      return;
    }
    setSubmitting(true);
    try {
      await createOrder(userId, address);
      Alert.alert('Order placed', 'Thank you for your order.', [
        { text: 'OK', onPress: () => navigation.replace('Orders') },
      ]);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Shipping address</Text>
      <TextInput
        style={styles.input}
        placeholder="Street"
        placeholderTextColor="#64748b"
        value={street}
        onChangeText={setStreet}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#64748b"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="State / Province"
        placeholderTextColor="#64748b"
        value={state}
        onChangeText={setState}
      />
      <TextInput
        style={styles.input}
        placeholder="ZIP / Postal code"
        placeholderTextColor="#64748b"
        value={zipCode}
        onChangeText={setZipCode}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        placeholderTextColor="#64748b"
        value={country}
        onChangeText={setCountry}
      />
      <TouchableOpacity
        style={[styles.submitBtn, (!isValid || submitting) && styles.submitBtnDisabled]}
        onPress={handlePlaceOrder}
        disabled={!isValid || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>Place order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 24 },
  title: { color: '#f8fafc', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 14,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 12,
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
