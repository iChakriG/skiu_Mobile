import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import { RootNavigator } from './src/navigation/index';

export default function App() {
  return (
    <UserProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </UserProvider>
  );
}
