// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For persistence
import { lightColors, darkColors } from "../config/colors";

// Create the context with a default value
const ThemeContext = createContext({
  theme: lightColors, // Start with default light theme
  isDark: false,
  isThemeLoaded: false, // Flag to indicate if theme loaded from storage/system
  toggleTheme: () => {},
});

// Create the Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightColors);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false); // Changed name from isLoaded

  useEffect(() => {
    const loadThemePreference = async () => {
      let initialTheme = lightColors; // Default
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
        const systemTheme = Appearance.getColorScheme();
        initialTheme = systemTheme === "dark" ? darkColors : lightColors;
        console.log(
          `🎨 Error loading theme, falling back to system theme: ${systemTheme}`
        );
      } finally {
        setTheme(initialTheme); // Set the loaded/fallback theme
        setIsThemeLoaded(true); // Mark theme as loaded
      }
    };

    loadThemePreference();
  }, []);

  // Update theme based on system changes if no preference is saved (optional)
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem("appTheme").then((savedThemeMode) => {
        if (!savedThemeMode && isThemeLoaded) {
          // Only update if theme loaded and no manual preference saved
          console.log(
            `🎨 System theme changed to: ${colorScheme}, updating app theme.`
          );
          setTheme(colorScheme === "dark" ? darkColors : lightColors);
        }
      });
    });
    return () => subscription.remove();
  }, [isThemeLoaded]); // Rerun listener setup if isThemeLoaded changes

  const toggleTheme = async () => {
    // Prevent toggling if theme isn't fully loaded yet (optional safety)
    if (!isThemeLoaded) return;

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
        theme, // Current theme object (lightColors/darkColors)
        isDark, // Boolean indicating if the theme is dark
        toggleTheme, // Function to toggle the theme
        isThemeLoaded, // <<< ADD THIS LINE: Boolean indicating loading completion
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access to theme context
export const useTheme = () => useContext(ThemeContext);
