import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const getBaseURL = () => {
  // For web, use localhost
  if (Platform.OS === "web") {
    return "http://localhost:9090/api/";
  }

  // Get the IP address from Expo's development server
  // This automatically detects the machine's IP address
  const { expoConfig } = Constants;
  const debuggerHost = expoConfig?.hostUri;

  if (debuggerHost) {
    // Extract just the IP address (remove port if present)
    const host = debuggerHost.split(':')[0];
    return `http://${host}:9090/api/`;
  }

  // Fallback to localhost for iOS simulator
  // For Android emulator, use 10.0.2.2 which maps to host's localhost
  return Platform.OS === "ios"
    ? "http://localhost:9090/api/"
    : "http://10.0.2.2:9090/api/";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
