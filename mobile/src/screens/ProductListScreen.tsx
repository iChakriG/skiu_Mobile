import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { getProducts } from '../api/products';
import type { Product } from '../types/product';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getProducts(search ? { search } : undefined);
      setProducts(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSearch = () => load();

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      activeOpacity={0.7}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Text style={styles.thumbText}>No image</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No products found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  searchRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 16,
  },
  searchBtn: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  list: { padding: 12, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumb: {
    width: 100,
    height: 100,
    backgroundColor: '#334155',
  },
  thumbPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  thumbText: { color: '#64748b', fontSize: 12 },
  cardBody: { flex: 1, padding: 12, justifyContent: 'center' },
  name: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  category: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  price: { color: '#22c55e', fontSize: 18, fontWeight: '700', marginTop: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#f87171', fontSize: 16 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 },
});
