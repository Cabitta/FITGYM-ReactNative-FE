import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  View as RNView,
} from "react-native";
import {
  Text,
  Button,
  useTheme as usePaperTheme,
  HelperText,
  Card,
} from "react-native-paper";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../AuthProvider";
import { useTheme } from "../../config/theme";

const OtpScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const paperTheme = usePaperTheme();

  const { email: routeEmail } = route.params || {};
  const [email, setEmail] = useState(routeEmail || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { verifyOtp, resendOtp } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Por favor ingresa un código");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(email.trim(), otp.trim());
      if (!res.success) {
        Alert.alert("Error", "Código inválido");
      }
    } catch (e) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleSendCodePress = () => {
    navigation.navigate("EmailInput");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Card
            elevation={2}
            style={{
              padding: 16,
              marginHorizontal: 16,
              borderRadius: 16,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Card.Content>
              {/* Título */}
              <Text
                variant="headlineMedium"
                style={{
                  textAlign: "center",
                  marginBottom: 32,
                  fontWeight: "bold",
                }}
              >
                Ingresa tu código
              </Text>

              {/* Descripción */}
              <Text
                variant="bodyLarge"
                style={{
                  textAlign: "center",
                  marginBottom: 32,
                }}
              >
                Te enviamos un código a {email || "tu email"}. Ingresa el código
                para habilitar tu cuenta.
              </Text>

              <RNView
                style={{ alignItems: "center", marginTop: 8, marginBottom: 12 }}
              >
                <CodeField
                  value={otp}
                  onChangeText={(val) => setOtp(val)}
                  cellCount={6}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({ index, symbol, isFocused }) => (
                    <RNView
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      style={[
                        styles.cell,
                        isFocused && styles.cellFocused,
                        {
                          backgroundColor: theme.colors.surface,
                          borderColor: theme.colors.outline,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cellText,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </RNView>
                  )}
                />
              </RNView>

              {/* Botón enviar código */}
              <Button
                mode="contained"
                onPress={handleVerify}
                loading={loading}
                disabled={loading}
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16, fontWeight: "600" }}
                style={{ borderRadius: 12, marginTop: 32 }}
                buttonColor={theme.colors.primary}
              >
                {loading ? "Verificando.." : "Verificar"}
              </Button>

              {/* Ir a Iniciar Sesión */}
              <Button
                mode="text"
                onPress={handleLoginPress}
                compact
                style={{ marginTop: 32 }}
                labelStyle={{
                  color: theme.colors.primary,
                  fontWeight: "600",
                }}
              >
                ¿Ya tienes una cuenta?
              </Button>

              {/* Ir a Verificar Código */}
              <Button
                mode="text"
                onPress={handleSendCodePress}
                compact
                style={{ marginTop: 16 }}
                labelStyle={{
                  color: theme.colors.primary,
                  fontWeight: "600",
                }}
              >
                ¿No recibiste un código?
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  label: { fontSize: 14, color: "#444", marginTop: 12 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  boxInput: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    fontSize: 20,
    marginHorizontal: 4,
  },
  codeFieldRoot: { marginTop: 8 },
  cell: {
    width: 48,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginHorizontal: 6,
  },
  cellFocused: {
    borderColor: "#6200ee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  cellText: { fontSize: 20, textAlign: "center" },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { marginTop: 16, alignItems: "center" },
  secondaryText: { color: "#007bff" },
});

export default OtpScreen;
