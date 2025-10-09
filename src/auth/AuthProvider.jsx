import React, { createContext, useContext, useEffect, useState } from "react";
import storage from "../utils/storage";
import tokenManager from "../utils/tokenManager";
import authService from "./services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const saved = await storage.getItem("access_token");
        const userData = await storage.getItem("user_data");
        if (mounted && saved) {
          tokenManager.setToken(saved);
          setToken(saved);
          if (userData) setUser(JSON.parse(userData));
        }
      } catch (e) {
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

  const logout = async () => {
    const res = await authService.logout();
    tokenManager.clear();
    setToken(null);
    setUser(null);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
