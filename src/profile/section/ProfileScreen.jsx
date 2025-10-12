// src/screens/ProfileScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, StyleSheet } from "react-native";
import UserInfoCard from "../componentes/UserInfoCard";
import User from "../modelo/User";
import api from "../../config/axios";
import storage from "../../utils/storage";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 🔹 Primero intento recuperar desde storage
        const datosStorage = await storage.getItem("user_data");
        if (datosStorage) {
         const parsedData = JSON.parse(datosStorage);
      
          const id = parsedData.id; // Ahora id tendrá el valor correcto
          console.log("ID de usuario:", id);
          const { data: userData } = await api.get(`/users/${id}`);
          console.log("Datos de usuario cargados desde api:", userData);

          setUser(new User(userData));
          
        }
        console.log("Datos de usuario cargados desde storage:", datosStorage);
       


        //setTimeout(() => setUser(mockUser), 1000);
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
