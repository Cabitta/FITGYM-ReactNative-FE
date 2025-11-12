import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  View,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Surface,
  useTheme as usePaperTheme,
  HelperText,
  Card,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../AuthProvider";
import { useTheme } from "../../config/theme";

const EmailInputScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const paperTheme = usePaperTheme();

  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { resendOtp } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSendCode = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const r = await resendOtp(formData.email.trim());
      if (r.success) {
        navigation.navigate("Otp");
      } else {
        Alert.alert("Error", r.error || "No se pudo reenviar el código");
      }
    } catch (e) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Surface
            style={{
              paddingHorizontal: 24,
              paddingVertical: 32,
              backgroundColor: theme.colors.surface,
            }}
          >
            {/* Título */}
            <Text
              variant="headlineMedium"
              style={{
                textAlign: "center",
                marginBottom: 32,
                fontWeight: "bold",
              }}
            >
              Enviar código
            </Text>

            {/* Body */}
            <Text
              variant="bodyLarge"
              style={{
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Te vamos a enviar un código al mail que ingreses. El mail
              ingresado tiene que estar registrado.
            </Text>

            {/* Email */}
            <View
              style={{
                marginBottom: 24,
              }}
            >
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(v) => handleInputChange("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
                mode="outlined"
                error={!!errors.email}
                theme={{ roundness: 12 }}
                style={{ backgroundColor: theme.colors.surface }}
                outlineColor={
                  errors.email ? theme.colors.error : theme.colors.outline
                }
                activeOutlineColor={theme.colors.primary}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            </View>

            {/* Botón enviar código */}
            <Button
              mode="contained"
              onPress={handleSendCode}
              loading={loading}
              disabled={loading}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 16, fontWeight: "600" }}
              style={{ borderRadius: 12 }}
              buttonColor={theme.colors.primary}
            >
              {loading ? "Enviando código..." : "Enviar código"}
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmailInputScreen;
