import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from './src/config/theme';
import AppNavigator from './src/navigator/AppNavigator';
import { AuthProvider } from './src/auth/AuthProvider';

const Stack = createNativeStackNavigator();

function AppContent(){
const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      
      <SafeAreaProvider>  

        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );

}
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
