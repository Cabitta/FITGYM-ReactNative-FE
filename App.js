import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassesScreen from './src/classes/screens/ClassesScreen';
import { LoginScreen } from './src/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Classes" 
          component={ClassesScreen}
          options={{ title: 'Clases' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
