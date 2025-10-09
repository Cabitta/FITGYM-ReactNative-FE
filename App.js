import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassesScreen from './src/classes/screens/ClassesScreen';
import { LoginScreen } from './src/auth';
import AppNavigator from './src/navigator/AppNavigator';
import { AuthProvider } from './src/auth/AuthProvider';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
