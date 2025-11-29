import React, { createContext, useContext, useEffect, useState } from 'react';
import storage from '../utils/storage';
import tokenManager from '../utils/tokenManager';
import authService from './services/authService';
import { authenticateBiometric } from '../utils/biometriaAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const saved = await storage.getItem('access_token');
        const userData = await storage.getItem('user_data');
        if (mounted && saved) {
          tokenManager.setToken(saved);
          setToken(saved);
          if (userData) setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.log('Error initializing auth state:', e);
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res?.success) {
      // authService already persisted tokens; sincronizar estado
      tokenManager.setToken(res.access_token);
      setToken(res.access_token);
      if (res.user) setUser(res.user);
    }
    return res;
  };

  const register = async userData => {
    // userData should contain at least { nombre, email, password }
    const res = await authService.register(userData);
    return res;
  };

  const loginWithBiometric = async () => {
    const res = await authenticateBiometric();
    if (res.success) {
      tokenManager.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
    }

    return res;
  };

  const verifyOtp = async (email, otp) => {
    const res = await authService.verifyOtp(email, otp);
    if (res?.success) {
      try {
        tokenManager.setToken(res.access_token);
      } catch (e) {
        console.log('Error setting token in tokenManager:', e);
        // ignore
      }
      setToken(res.access_token);
      if (res.user) setUser(res.user);
    }
    return res;
  };

  const resendOtp = async email => {
    // Calls authService.resendOtp which uses POST /api/auth/send-otp
    const res = await authService.resendOtp(email);
    return res;
  };

  const logout = async () => {
    const res = await authService.logout();
    tokenManager.clear();
    setToken(null);
    setUser(null);
    return res;
  };

  const editProfile = async (id, user_data) => {
    const res = await authService.editProfile(id, user_data);
    try {
      if (res.success) {
        console.log('Usuario actualizado:', res.user);
        const update = JSON.stringify(res.data);
        setUser(update);
      }
      return res;
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Error updating profile' };
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        editProfile,
        register,
        verifyOtp,
        resendOtp,
        loginWithBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
