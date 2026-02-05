# API client

- **client.ts** — `getBaseUrl()`, `apiRequest()`. Uses `EXPO_PUBLIC_API_URL`; optional `userId` for `x-user-id` header.
- **products.ts** — getProducts(filters?), getProductById(id)
- **cart.ts** — getCart(userId), addToCart(userId, productId, quantity)
- **orders.ts** — getOrders(userId), getOrderById(id), createOrder(userId, shippingAddress)

All return typed data; errors throw with message from API.
