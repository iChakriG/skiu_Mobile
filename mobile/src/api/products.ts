import { apiRequest } from './client';
import type { Product, ProductFilters } from '../types/product';

interface ProductsResponse {
  products: Product[];
}

interface ProductResponse {
  product: Product;
}

export async function getProducts(
  filters?: ProductFilters
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice));
  if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
  if (filters?.search) params.set('search', filters.search);
  const qs = params.toString();
  const path = `/api/products${qs ? `?${qs}` : ''}`;
  const data = await apiRequest<ProductsResponse>(path);
  return data.products;
}

export async function getProductById(id: string): Promise<Product> {
  const data = await apiRequest<ProductResponse>(`/api/products/${id}`);
  return data.product;
}
