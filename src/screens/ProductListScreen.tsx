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
  useWindowDimensions,
} from 'react-native';
import { getProducts } from '../api/products';
import type { Product } from '../types/product';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/index';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

const CARD_GAP = 12;
const LIST_PAD = 12;

export function ProductListScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - LIST_PAD * 2 - CARD_GAP) / 2;

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
      style={[styles.card, { width: cardWidth }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      activeOpacity={0.7}
    >
      <View style={[styles.thumbWrap, { width: cardWidth, height: cardWidth }]}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Text style={styles.thumbText}>No image</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <Text style={styles.subtitle}>
          {products.length === 0 && !loading && !error
            ? 'No products yet.'
            : `Browse all ${products.length} products.`}
        </Text>
      </View>
    </>
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
          numColumns={2}
          key="grid"
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListHeaderComponent={ListHeader}
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
  list: { padding: LIST_PAD, paddingBottom: 24 },
  row: { gap: CARD_GAP, marginBottom: CARD_GAP },
  header: { marginBottom: 16 },
  title: { color: '#f8fafc', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  thumbWrap: { backgroundColor: '#334155' },
  thumb: {
    width: '100%',
    height: '100%',
    backgroundColor: '#334155',
  },
  thumbPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  thumbText: { color: '#64748b', fontSize: 12 },
  cardBody: { padding: 12 },
  name: { color: '#f8fafc', fontSize: 15, fontWeight: '600' },
  description: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  price: { color: '#22c55e', fontSize: 16, fontWeight: '700', marginTop: 6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#f87171', fontSize: 16 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 },
});
