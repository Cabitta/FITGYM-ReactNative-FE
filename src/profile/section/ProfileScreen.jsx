// src/profile/section/ProfileScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, StyleSheet, Modal } from "react-native";
import UserInfoCard from "../componentes/UserInfoCard";
import User from "../modelo/User";
import api from "../../config/axios";
import storage from "../../utils/storage";
import LogoutScreen from "../../auth/screens/LogoutScreen"; // ✅ sigue importado

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const datosStorage = await storage.getItem("user_data");
        if (datosStorage) {
          const parsedData = JSON.parse(datosStorage);
          const id = parsedData.id;
          const { data: userData } = await api.get(`/users/${id}`);
          setUser(new User(userData));
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>

      <UserInfoCard user={user} />

      <View style={styles.buttonContainer}>
        <Button
          title="Volver"
          onPress={() => navigation.goBack()}
          color="#007bff"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cerrar sesión"
          color="#dc3545"
          onPress={() => setShowLogout(true)} // ✅ abre modal
        />
      </View>

      {/* ✅ Modal con LogoutScreen (no afecta AppNavigation) */}
      <Modal visible={showLogout} animationType="fade" transparent={false}>
        <LogoutScreen navigation={navigation} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: "60%",
  },
});
