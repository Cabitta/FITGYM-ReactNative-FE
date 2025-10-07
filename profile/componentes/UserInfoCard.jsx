
import React from "react";
import { View, Text, Image } from "react-native";

const UserInfoCard = ({ user }) => {
  return (
    <View className="items-center bg-white p-6 rounded-2xl shadow-md mx-5">
      {user.foto ? (
        <Image
          source={{ uri: `data:image/png;base64,${user.foto}` }}
          className="w-32 h-32 rounded-full mb-3"
        />
      ) : (
        <View className="w-32 h-32 rounded-full bg-gray-300 justify-center items-center mb-3">
          <Text className="text-5xl text-white">
            {user.nombre?.[0]?.toUpperCase() || "?"}
          </Text>
        </View>
      )}

      <Text className="text-2xl font-semibold text-gray-800">
        {user.nombre}
      </Text>
      <Text className="text-base text-gray-500 mt-1">{user.email}</Text>
    </View>
  );
};

export default UserInfoCard;
