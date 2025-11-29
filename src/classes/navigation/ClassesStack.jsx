import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassesScreen from '../screens/ClassesScreen';

const Stack = createNativeStackNavigator();

export default function ClassesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#6C63FF' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ title: 'Clases disponibles' }}
      />
    </Stack.Navigator>
  );
}
