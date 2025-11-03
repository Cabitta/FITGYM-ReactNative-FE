import React, { createContext, useState, useContext } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#11111091", // Rojo Pokémon
    secondary: "#ffcd058d", // Amarillo Pokémon
    tertiary: "#1f1e20a4", // Azul Pokémon
    background: "#8f909220", // Color base (fallback)
    surface: "#eff2eeff",
  },

};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E63F34', // Rojo Pokémon
    secondary: '#FFCB05', // Amarillo Pokémon
    tertiary: '#3B4CCA', // Azul Pokémon
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
