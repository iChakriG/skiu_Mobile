import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getOrderById } from '../api/orders';
import type { Order } from '../types/order';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const o = await getOrderById(orderId);
        if (!cancelled) setOrder(o);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load order');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }
  if (error || !order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Order not found'}</Text>
      </View>
    );
  }

  const addr = order.shippingAddress;
  const addressLine = [addr.street, addr.city, addr.state, addr.zipCode, addr.country].join(', ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>{order.id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Items</Text>
        {order.items.map((item) => (
          <View key={item.productId} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>× {item.quantity}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.total}>${order.total.toFixed(2)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Shipping address</Text>
        <Text style={styles.value}>{addressLine}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Placed</Text>
        <Text style={styles.value}>{new Date(order.createdAt).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  error: { color: '#f87171', fontSize: 16 },
  section: { marginBottom: 20 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' },
  value: { color: '#f8fafc', fontSize: 16 },
  status: { color: '#0ea5e9', fontSize: 16, textTransform: 'capitalize' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  itemName: { flex: 1, color: '#f8fafc' },
  itemQty: { color: '#94a3b8', marginRight: 8 },
  itemPrice: { color: '#22c55e', fontWeight: '600' },
  total: { color: '#22c55e', fontSize: 20, fontWeight: '700' },
});
