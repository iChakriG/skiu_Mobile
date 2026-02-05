import { apiRequest } from './client';
import type { Cart } from '../types/cart';

interface CartResponse {
  cart: Cart | null;
}

export async function getCart(userId: string): Promise<Cart | null> {
  const data = await apiRequest<CartResponse>('/api/cart', {
    method: 'GET',
    userId,
  });
  return data.cart;
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  const data = await apiRequest<CartResponse>('/api/cart', {
    method: 'POST',
    userId,
    body: { productId, quantity },
  });
  if (!data.cart) throw new Error('Failed to add to cart');
  return data.cart;
}
