import React, { createContext, useState, useContext } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

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
    sucess: '#00CC99',
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
    sucess: '#00CC99',
    warning: '#FFC700',
    danger: '#FF3B30',
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
