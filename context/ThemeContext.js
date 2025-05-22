// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Make sure this path is correct for your project structure
import { lightColors, darkColors } from "../config/colors";

const ThemeContext = createContext({
  theme: lightColors,
  isDark: false,
  isThemeLoaded: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightColors); // Start with lightColors as default
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      let initialTheme = lightColors; // Default before loading
      try {
        const savedThemeMode = await AsyncStorage.getItem("appTheme");
        if (savedThemeMode) {
          initialTheme = savedThemeMode === "dark" ? darkColors : lightColors;
          console.log(`🎨 Theme loaded from storage: ${savedThemeMode}`);
        } else {
          const systemTheme = Appearance.getColorScheme();
          initialTheme = systemTheme === "dark" ? darkColors : lightColors;
          console.log(`🎨 No saved theme, using system theme: ${systemTheme}`);
        }
      } catch (error) {
        console.error("❌ Failed to load theme from storage", error);
        const systemTheme = Appearance.getColorScheme(); // Fallback to system theme on error
        initialTheme = systemTheme === "dark" ? darkColors : lightColors;
        console.log(
          `🎨 Error loading theme, falling back to system theme: ${systemTheme}`
        );
      } finally {
        setTheme(initialTheme); // Set the determined theme
        setIsThemeLoaded(true); // Mark theme as loaded
      }
    };

    loadThemePreference();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update from system if theme is loaded AND no manual preference is saved
      if (isThemeLoaded) {
        AsyncStorage.getItem("appTheme").then((savedThemeMode) => {
          if (!savedThemeMode) {
            // No manual preference set by user
            console.log(
              `🎨 System theme changed to: ${colorScheme}, updating app theme.`
            );
            setTheme(colorScheme === "dark" ? darkColors : lightColors);
          }
        });
      }
    });
    return () => subscription.remove();
  }, [isThemeLoaded]); // Rerun if isThemeLoaded changes

  const toggleTheme = async () => {
    if (!isThemeLoaded) return; // Safety check

    const newTheme = theme.mode === "light" ? darkColors : lightColors;
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("appTheme", newTheme.mode);
      console.log(`🎨 Theme preference saved: ${newTheme.mode}`);
    } catch (error) {
      console.error("❌ Failed to save theme preference", error);
    }
  };

  const isDark = theme.mode === "dark";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        isThemeLoaded, // Expose this for consumers if needed
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
