import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { getCart } from '../api/cart';
import type { Cart, CartItem } from '../types/cart';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';
import { useUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { userId } = useUser();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setCart(null);
      setLoading(false);
      setError('Set user ID to view cart');
      return;
    }
    setError(null);
    try {
      const c = await getCart(userId);
      setCart(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load cart');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (!userId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Set a user ID in the app to view your cart.</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (error && !cart) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Your cart is empty.</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.primaryBtnText}>Browse products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.row}>
      <Text style={styles.rowProductId}>{item.productId}</Text>
      <Text style={styles.rowQty}>× {item.quantity}</Text>
      <Text style={styles.rowPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.productId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${cart.total.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.primaryBtnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  list: { padding: 16, paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  message: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  error: { color: '#f87171', fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowProductId: { flex: 1, color: '#f8fafc', fontSize: 14 },
  rowQty: { color: '#94a3b8', marginRight: 12 },
  rowPrice: { color: '#22c55e', fontWeight: '600' },
  footer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#334155' },
  total: { color: '#f8fafc', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  primaryBtn: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
