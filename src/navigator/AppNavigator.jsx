import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import LoginScreen from "../auth/screens/LoginScreen";
import RegisterScreen from "../auth/screens/RegisterScreen";
import ClassesScreen from "../classes/screens/ClassesScreen";
import LogoutScreen from "../auth/screens/LogoutScreen";
import { useAuth } from "../auth/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

function AppTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Classes") {
            return (
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={size}
                color={color}
              />
            );
          }
          if (route.name === "Logout") {
            return (
              <MaterialCommunityIcons name="logout" size={size} color={color} />
            );
          }
          return null;
        },
      })}
    >
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ tabBarLabel: "Clases" }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ tabBarLabel: "Cerrar sesión" }}
      />
    </Tab.Navigator>
  );
}

function InnerNavigator() {
  const { loading, token } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppTab /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return <InnerNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
