import React from "react";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";

const UserInfoCard = ({ user }) => {
  if (!user) {
    return (
      <View className="items-center bg-white p-6 rounded-2xl shadow-md mx-5">
        <Text variant="displayMedium">Usuario no disponible</Text>
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
            <Text variant="displayMedium">
              {user.nombre?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
          {console.log("🟡 Imagen Base64 no encontrada, mostrando inicial")}
        </>
      )}

      <Text variant="displayMedium">
        {user.nombre || "Sin nombre"}
      </Text>
      <Text variant="titleMedium">
        {user.email || "Sin email"}
      </Text>
    </View>
  );
};

export default UserInfoCard;
