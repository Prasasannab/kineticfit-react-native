import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';
import { spacing, radius, ThemeSpacing, ThemeRadius } from './spacing';
import { typography, ThemeTypography } from './typography';
import { lightShadows, darkShadows, ThemeShadows } from './shadows';
import { appStorage, STORAGE_KEYS } from '@/services/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
  shadows: ThemeShadows;
  isDark: boolean;
  mode: ThemeMode;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  shadows: lightShadows,
  isDark: false,
  mode: 'light',
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
  shadows: darkShadows,
  isDark: true,
  mode: 'dark',
};

export const theme: Theme = lightTheme;

export function getTheme(isDark: boolean, mode: ThemeMode = isDark ? 'dark' : 'light'): Theme {
  return isDark ? { ...darkTheme, mode } : { ...lightTheme, mode };
}

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  // Direct shortcuts matching Theme interface for 100% backwards-compatibility
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
  shadows: ThemeShadows;
}

const defaultContextValue: ThemeContextValue = {
  theme: lightTheme,
  themeMode: 'light',
  isDark: false,
  setThemeMode: () => {},
  toggleTheme: () => {},
  colors: lightTheme.colors,
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: lightTheme.typography,
  shadows: lightTheme.shadows,
};

const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

export interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();

  // Synchronously initialize from MMKV fast storage (<0.05ms)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (initialMode) return initialMode;
    const stored = appStorage.getString(STORAGE_KEYS.THEME_MODE) as ThemeMode | undefined;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'dark'; // Modern energetic dark slate by default
  });

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const currentTheme = useMemo(() => {
    return getTheme(isDark, themeMode);
  }, [isDark, themeMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    appStorage.setString(STORAGE_KEYS.THEME_MODE, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  }, [isDark, setThemeMode]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme: currentTheme,
      themeMode,
      isDark,
      setThemeMode,
      toggleTheme,
      colors: currentTheme.colors,
      spacing: currentTheme.spacing,
      radius: currentTheme.radius,
      typography: currentTheme.typography,
      shadows: currentTheme.shadows,
    }),
    [currentTheme, themeMode, isDark, setThemeMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
}
