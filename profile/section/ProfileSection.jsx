// src/screens/ProfileScreen.jsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import UserInfoCard from "../componentes/UserInfoCard";
import User from "../modelo/User";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // 🔧 Simulación — luego se reemplaza por una llamada al backend
      const mockUser = new User({
        id: "001",
        nombre: "María López",
        email: "maria.lopez@example.com",
        foto: "", // Podés poner una cadena base64 real acá
      });

      setTimeout(() => setUser(mockUser), 1000);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-gray-50">
      <UserInfoCard user={user} />
    </View>
  );
};

export default ProfileScreen;
