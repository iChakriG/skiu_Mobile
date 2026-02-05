# Mobile app source

| Folder | Purpose |
|--------|--------|
| **api/** | API client: base URL, `apiRequest()`, and functions for products, cart, orders. Sends `x-user-id` when provided. |
| **context/** | UserContext — holds `userId` for cart/orders; set in Settings. |
| **navigation/** | Stack navigator, screen list, and `RootStackParamList`. |
| **screens/** | UI screens: ProductList, ProductDetail, Cart, Checkout, Orders, OrderDetail, Settings. |
| **types/** | TypeScript types matching backend: Product, Cart, Order, Address. |

Entry: `App.tsx` at repo root wraps `UserProvider` and `RootNavigator`.
