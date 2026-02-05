import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
  Checkout: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: '#0f172a' },
  headerTintColor: '#f8fafc',
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: '#0f172a' },
};

function HeaderMenu() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={headerStyles.row}>
      <TouchableOpacity onPress={() => nav.navigate('Cart')} style={headerStyles.btn}>
        <Text style={headerStyles.btnText}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => nav.navigate('Orders')} style={headerStyles.btn}>
        <Text style={headerStyles.btnText}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => nav.navigate('Settings')} style={headerStyles.btn}>
        <Text style={headerStyles.btnText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  row: { flexDirection: 'row', marginRight: 8, gap: 4 },
  btn: { paddingHorizontal: 10, paddingVertical: 6, justifyContent: 'center' },
  btnText: { color: '#0ea5e9', fontSize: 15, fontWeight: '500' },
});

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{ title: 'Products', headerRight: () => <HeaderMenu /> }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Product' }}
        />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ title: 'Order' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
