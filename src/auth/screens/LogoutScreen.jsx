import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../AuthProvider";

export default function LogoutScreen({ navigation }) {
  //TODO: cambiar por AuthProvider
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navegar al stack de auth (Login)
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerrar sesión</Text>
      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
});
