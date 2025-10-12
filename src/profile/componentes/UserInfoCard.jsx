import React from "react";
import { View, Text, Image } from "react-native";

const UserInfoCard = ({ user }) => {
  if (!user) {
    return (
      <View className="items-center bg-white p-6 rounded-2xl shadow-md mx-5">
        <Text className="text-base text-gray-500">Usuario no disponible</Text>
      </View>
    );
  }

  const cleanBase64 = user.foto?.replace(/\s/g, ""); // limpia saltos y espacios

  const imageUri = cleanBase64
    ? cleanBase64.startsWith("data:image")
      ? cleanBase64
      : `data:image/png;base64,${cleanBase64}`
    : null;

  return (
    <View className="items-center bg-white p-6 rounded-2xl shadow-md mx-5">
      {imageUri ? (
        <>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 128, height: 128, borderRadius: 64, marginBottom: 12 }}
            onError={(e) =>
              console.log("❌ Error al cargar la imagen:", e.nativeEvent.error)
            }
          />
          {console.log("✅ Cargando imagen desde Base64")}
        </>
      ) : (
        <>
          <View className="w-32 h-32 rounded-full bg-gray-300 justify-center items-center mb-3">
            <Text className="text-5xl text-white">
              {user.nombre?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
          {console.log("🟡 Imagen Base64 no encontrada, mostrando inicial")}
        </>
      )}

      <Text className="text-2xl font-semibold text-gray-800">
        {user.nombre || "Sin nombre"}
      </Text>
      <Text className="text-base text-gray-500 mt-1">
        {user.email || "Sin email"}
      </Text>
    </View>
  );
};

export default UserInfoCard;
