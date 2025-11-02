import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useAuth } from "../AuthProvider";

export default function LogoutScreen({ navigation }) {
  const { logout } = useAuth();

  useEffect(() => {
   
    const doLogout = async () => {
      try {
        await logout(); // esto elimina el token
      } catch (error) {
        Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
        console.error("Logout error:", error);
      }
    };
    doLogout();
  }, [logout]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#dc3545" />
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
