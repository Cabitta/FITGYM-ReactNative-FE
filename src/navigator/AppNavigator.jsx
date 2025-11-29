import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../auth/AuthProvider";
import LoginScreen from "../auth/screens/LoginScreen";
import RegisterScreen from "../auth/screens/RegisterScreen";
import ClassDetail from "../classes/screens/ClassDetail";
import ClassesScreen from "../classes/screens/ClassesScreen";
import ProfileScreen from "../profile/section/ProfileScreen";
import Reservas from "../reservas";
import Historial from "../historial/Historial";
import HistorialAxios from "../historial/HistorialAxios";
import OtpScreen from "../auth/screens/OtpScreen";
import EmailInputScreen from "../auth/screens/EmailInputScreen";
import { useTheme } from "../config/theme";
import QRScanner from "../Qr";
import { Appbar, BottomNavigation } from "react-native-paper";
import { useState } from "react";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Otp" component={OtpScreen} />
    <Stack.Screen name="EmailInput" component={EmailInputScreen} />
  </Stack.Navigator>
);

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={AppTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClassDetail"
        component={ClassDetail}
        options={{ title: "Detalle de Clase" }}
      />
    </Stack.Navigator>
  );
}

function AppTab() {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'classes', title: 'Clases', focusedIcon: 'calendar-month', unfocusedIcon: 'calendar-month-outline' },
    { key: 'reservas', title: 'Reservas', focusedIcon: 'calendar-check' },
    { key: 'qrscanner', title: 'QR Scanner', focusedIcon: 'qrcode-scan' },
    { key: 'profile', title: 'Perfil', focusedIcon: 'account' },
    { key: 'historial', title: 'Historial', focusedIcon: 'history' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    classes: ClassesScreen,
    reservas: Reservas,
    qrscanner: QRScanner,
    profile: ProfileScreen,
    historial: HistorialAxios,
  });

  // Determinar el título según el índice actual
  const getTitle = () => {
    switch (index) {
      case 0: return "Clases";
      case 1: return "Reservas";
      case 2: return "QR Scanner";
      case 3: return "Perfil";
      case 4: return "Historial";
      default: return "FITGYM";
    }
  };

  const showLogoutAction = index === 3; // Mostrar logout solo en Profile

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title={getTitle()} titleStyle={{ fontWeight: 'bold' }} />
        {showLogoutAction && (
          <Appbar.Action 
            icon="logout" 
            onPress={async () => {
              await logout();
            }} 
          />
        )}
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </View>
  );
}

function InnerNavigator() {
  const { loading, token } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return <InnerNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
