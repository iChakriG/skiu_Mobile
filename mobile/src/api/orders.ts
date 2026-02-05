import { apiRequest } from './client';
import type { Order, Address } from '../types/order';

interface OrdersResponse {
  orders: Order[];
}

interface OrderResponse {
  order: Order;
}

export async function getOrders(userId: string): Promise<Order[]> {
  const data = await apiRequest<OrdersResponse>('/api/orders', {
    method: 'GET',
    userId,
  });
  return data.orders;
}

export async function getOrderById(id: string): Promise<Order> {
  const data = await apiRequest<OrderResponse>(`/api/orders/${id}`);
  return data.order;
}

export async function createOrder(
  userId: string,
  shippingAddress: Address
): Promise<Order> {
  const data = await apiRequest<OrderResponse>('/api/orders', {
    method: 'POST',
    userId,
    body: { shippingAddress },
  });
  return data.order;
}
