import React, { createContext, useState, useContext } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#007AFF", // Rojo 
    secondary: "#ffcd058d", // Amarillo 
    tertiary: "#1f1e20a4", // Azul 
    background: "#8f909220", // Color base (fallback)
    surface: "#F8F9FA", // Color de superficie claro
  },

};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E63F34', // Rojo
    secondary: '#FFCB05', // Amarillo
    tertiary: '#3B4CCA', // Azul
    background: '#12121283',
    surface: '#8e8d8dd1',
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

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
