import React, { createContext, useState, useContext, useEffect } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import storage from '../utils/storage';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Bases
    background: '#EBEDF0',
    surface: '#F8F9FA',
    subtext: '#708090',
    // Acciones
    primary: '#3399FF',
    secondary: '#BB86FC',
    tertiary: '#3399FF',
    disabled: '#E0E0E0',
    // Estados
    success: '#00CC99',
    warning: '#FFC700',
    danger: '#FF3B30',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Bases
    background: '#1B2228',
    surface: '#26323B',
    subtext: '#A0A0A0',
    // Acciones
    primary: '#3399FF',
    secondary: '#BB86FC',
    tertiary: '#A0A0A0',
    disabled: '#4A4A4A',
    // Estados
    success: '#00CC99',
    warning: '#FFC700',
    danger: '#FF3B30',
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await storage.getPreference('theme_preference');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error cargando tema:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await storage.setPreference(
        'theme_preference',
        newTheme ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Error guardando tema:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Mientras carga, retornar el tema por defecto sin mostrar nada
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
