import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthProvider';
import LoginScreen from '../auth/screens/LoginScreen';
import RegisterScreen from '../auth/screens/RegisterScreen';
import ClassesScreen from '../classes/screens/ClassesScreen';
import ProfileScreen from '../profile/section/ProfileScreen';
import Reservas from '../reservas';
import HistorialAxios from '../historial/HistorialAxios';
import OtpScreen from '../auth/screens/OtpScreen';
import EmailInputScreen from '../auth/screens/EmailInputScreen';
import { useTheme } from '../config/theme';
import QRScanner from '../Qr';
import { Appbar, BottomNavigation } from 'react-native-paper';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Otp" component={OtpScreen} />
    <Stack.Screen name="EmailInput" component={EmailInputScreen} />
  </Stack.Navigator>
);

function AppTab() {
  const { theme } = useTheme();
  const { logout } = useAuth();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          animation: 'shift',
          headerShown: true,
          header: ({ navigation, route, options }) => {
            // Determinar el título según la ruta
            let title = 'FITGYM';
            let showLogoutAction = false;

            if (route.name === 'Classes') title = 'Clases';
            else if (route.name === 'Reservas') title = 'Reservas';
            else if (route.name === 'QRScanner') title = 'QR Scanner';
            else if (route.name === 'Profile') {
              title = 'Perfil';
              showLogoutAction = true;
            } else if (route.name === 'Historial') title = 'Historial';

            return (
              <Appbar.Header mode="center-aligned">
                <Appbar.Content
                  title={title}
                  titleStyle={{ fontWeight: 'bold' }}
                />
                {showLogoutAction && (
                  <Appbar.Action
                    icon="logout"
                    onPress={async () => {
                      await logout();
                    }}
                  />
                )}
              </Appbar.Header>
            );
          },
        })}
        tabBar={props => (
          <BottomNavigation.Bar
            navigationState={props.state}
            safeAreaInsets={props.insets}
            onTabPress={({ route, preventDefault }) => {
              const event = props.navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                props.navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: props.state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) =>
              props.descriptors[route.key].options.tabBarIcon?.({
                focused,
                color,
                size: 24,
              }) || null
            }
            getLabelText={({ route }) => {
              const { options } = props.descriptors[route.key];
              const label =
                typeof options.tabBarLabel === 'string'
                  ? options.tabBarLabel
                  : typeof options.title === 'string'
                    ? options.title
                    : route.name;
              return label;
            }}
          />
        )}
      >
        <Tab.Screen
          name="Classes"
          component={ClassesScreen}
          options={{
            tabBarLabel: 'Clases',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'calendar-month' : 'calendar-month-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Reservas"
          component={Reservas}
          options={{
            tabBarLabel: 'Reservas',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="QRScanner"
          component={QRScanner}
          options={{
            tabBarLabel: 'QR Scanner',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Historial"
          component={HistorialAxios}
          options={{
            tabBarLabel: 'Historial',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="history" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
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
      {token ? <AppTab /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return <InnerNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
