import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import LoginScreen from "../auth/screens/LoginScreen";
import RegisterScreen from "../auth/screens/RegisterScreen";
import ClassesScreen from "../classes/screens/ClassesScreen";
import authService from "../auth/services/authService";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

function AppTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Classes" component={ClassesScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (mounted) setAuthenticated(!!isAuth);
      } catch (e) {
        if (mounted) setAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {authenticated ? <AppTab /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
