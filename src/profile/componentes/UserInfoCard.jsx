import React from "react";
import { View, Text, Image } from "react-native";

const UserInfoCard = ({ user }) => {
  // Validar que user exista y tenga las propiedades esperadas
  if (!user) {
    return (
      <View className="items-center bg-white p-6 rounded-2xl shadow-md mx-5">
        <Text className="text-base text-gray-500">Usuario no disponible</Text>
      </View>
    );
  }

  // Verificar si foto es un string Base64 válido
  const isValidBase64 = (str) => {
    if (typeof str !== "string" || str === "") return false;
    // Verifica que el string sea un Base64 válido (sin prefijo data:image)
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
  };

  return (
    <View className="items-center bg-white p-6 rounded-2xl shadow-md mx-5">
      {user.foto && isValidBase64(user.foto) ? (
        <Image
          source={{ uri: `data:image/png;base64,${user.foto}` }}
          className="w-32 h-32 rounded-full mb-3"
          onError={(e) => console.log("Error al cargar la imagen:", e.nativeEvent.error)}
        />
      ) : (
        <View className="w-32 h-32 rounded-full bg-gray-300 justify-center items-center mb-3">
          <Text className="text-5xl text-white">
            {user.nombre?.[0]?.toUpperCase() || "?"}
          </Text>
        </View>
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