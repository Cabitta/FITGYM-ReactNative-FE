import axios from 'axios';
import { Platform } from 'react-native';

export const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:9090/api/';
  }
  return Platform.OS === 'ios'
    ? 'http://localhost:9090/api/'
    // : 'http://10.0.2.2:9090/api/';
    : 'http://192.168.0.140:9090/api/';
    // : 'http://192.168.100.7:9090/api/';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
