import React ,{ useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../AuthProvider";

export default function LogoutScreen({ navigation }) {
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      navigation.replace("Login");  // 👈 redirige al login después del logout
    };
    doLogout();
  }, []);

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
