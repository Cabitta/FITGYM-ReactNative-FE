import React, { useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";

const AuthButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
  ...props
}) => {
  // Combinar la prop `style` entrante con los estilos internos
  const buttonStyle = [
    styles.button,
    variant === "primary" ? styles.primaryButton : styles.secondaryButton,
    (disabled || loading) && styles.disabledButton,
    style, // se aplica al final para permitir ajustes pero sin sobreescribir completamente
  ];

  const textStyle = [
    styles.buttonText,
    variant === "primary" ? styles.primaryText : styles.secondaryText,
    (disabled || loading) && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : "#007AFF"}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    // Mejoras para web
    cursor: Platform.OS === "web" ? "pointer" : "default",
    userSelect: Platform.OS === "web" ? "none" : "auto",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#007AFF",
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default AuthButton;
