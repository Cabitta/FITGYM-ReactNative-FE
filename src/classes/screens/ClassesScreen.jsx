import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import AuthButton from "../../auth/components/AuthButton";
import authService from "../../auth/services/authService";

const ClassesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Confirmar", "¿Deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí",
        onPress: async () => {
          setLoading(true);
          try {
            await authService.logout();
            // eslint-disable-next-line no-console
            console.log("[ClassesScreen] Usuario deslogueado");
            navigation.navigate("Login");
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error("[ClassesScreen] Error al cerrar sesión:", error);
            Alert.alert("Error", "No se pudo cerrar la sesión");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Clases</Text>
        <Text style={styles.subtitle}>
          ¡Bienvenido! Has iniciado sesión correctamente.
        </Text>

        <AuthButton
          title="Cerrar sesión"
          onPress={handleLogout}
          variant="secondary"
          loading={loading}
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});
