# Source (mobile app)

| Folder | Purpose |
|--------|--------|
| **api/** | API client (base URL, `apiRequest`), endpoints for products, cart, orders. Sends `x-user-id` from auth when signed in. |
| **context/** | AuthContext — Supabase auth (sign in/up/out), exposes `userId` for API. |
| **lib/** | Supabase client (AsyncStorage for session). |
| **navigation/** | Stack navigator, screen list, `RootStackParamList`. |
| **screens/** | Screens: ProductList, ProductDetail, Cart, Checkout, Orders, OrderDetail, Login, SignUp, Settings. |
| **types/** | Types: Product, Cart, Order, Address. |

Entry: root `App.tsx` wraps `AuthProvider` and `RootNavigator`.
