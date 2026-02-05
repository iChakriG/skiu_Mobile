import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getProductById } from '../api/products';
import { addToCart } from '../api/cart';
import type { Product } from '../types/product';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';
import { useUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { userId } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getProductById(productId);
        if (!cancelled) setProduct(p);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [productId]);

  const handleAddToCart = async () => {
    if (!userId) {
      Alert.alert('Sign in required', 'Set a user ID in the app to add to cart.');
      return;
    }
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(userId, product.id, 1);
      Alert.alert('Added', 'Product added to cart.', [
        { text: 'OK', onPress: () => navigation.navigate('Cart') },
        { text: 'Keep shopping' },
      ]);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }
  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Product not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {product.imageUrl ? (
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>No image</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.stock}>In stock: {product.stock}</Text>
        <TouchableOpacity
          style={[styles.addBtn, adding && styles.addBtnDisabled]}
          onPress={handleAddToCart}
          disabled={adding || product.stock < 1}
        >
          <Text style={styles.addBtnText}>
            {adding ? 'Adding...' : product.stock < 1 ? 'Out of stock' : 'Add to cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  error: { color: '#f87171', fontSize: 16 },
  image: { width: '100%', height: 280, backgroundColor: '#1e293b' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { color: '#64748b' },
  body: { padding: 16 },
  category: { color: '#94a3b8', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  name: { color: '#f8fafc', fontSize: 24, fontWeight: '700', marginTop: 4 },
  price: { color: '#22c55e', fontSize: 22, fontWeight: '700', marginTop: 8 },
  description: { color: '#cbd5e1', fontSize: 16, marginTop: 12, lineHeight: 24 },
  stock: { color: '#94a3b8', fontSize: 14, marginTop: 12 },
  addBtn: {
    marginTop: 24,
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnDisabled: { opacity: 0.6 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
