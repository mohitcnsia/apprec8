// src/config/colors.js

import { Appearance } from "react-native";

// --- Step 1: Define your Brand Colors (as before) ---
// This object holds the actual color values.
const brandColors = {
  primaryDarkMaroon: "#3b0940",
  primaryDarkMaroon900: "#3d1141",
  primaryDarkMaroon800: "#4e1a53",
  primaryMaroon10: "#f5d2f8ff",
  primaryMaroon100: "#85508aff",
  primaryMaroon200: "rgba(70, 64, 71, 1)", // Dark grayish maroon
  primaryLightGray: "#d7d1d3",
  primaryLightYellow: "#f0e3b0",
  primaryBrightYellow: "#dcb51b",
  primaryLightPink: "#f0b0f0",
  primaryOrange: "#f12b15", // Accent
  blackText: "#000000",
  primaryWhite: "#ffffff",
  primaryWhite100: "#d7c8c8",
  primaryPink100: "#f6ebef",
  successGreen: "#6dbb7e",
  errorRed: "#c86c62", // Warning/Error
  // Add any other specific colors your old screens might import directly
};

// --- Step 2: Export the Legacy `Colors` Object (Backward Compatibility) ---
// This allows screens importing `{ Colors }` to keep working temporarily.
// It uses the values defined in brandColors.
// IMPORTANT: Plan to remove this export once all screens are refactored.
export const Colors = {
  ...brandColors, // Spread all brand colors into the legacy export
};

// --- Step 3: Define the New Theme Structure (as before) ---

// Base Common Colors (Semantic names using brand colors)
const commonColors = {
  white: brandColors.primaryWhite,
  black: brandColors.blackText,
  transparent: "transparent",
  success: brandColors.successGreen,
  warning: brandColors.errorRed,
  accent: brandColors.primaryOrange,
};

// Light Theme Definition
// --- UPDATED Light Theme Definition ---
export const lightColors = {
  mode: "light",
  ...commonColors,

  // Backgrounds
  background: brandColors.primaryWhite,
  cardBackground: brandColors.primaryWhite,
  headerBackground: brandColors.primaryWhite,
  tabBarBackground: brandColors.primaryWhite, // Use brandColors
  warningBackground: brandColors.primaryPink100,
  successBackground: brandColors.successGreen + "30",
  disabledBackground: brandColors.primaryLightGray,
  wordBackground: brandColors.primaryDarkMaroon + "15",
  quoteBackground: brandColors.primaryDarkMaroon + "10",
  codeBackground: brandColors.primaryLightGray + "80",

  // Text
  textPrimary: brandColors.blackText,
  textSecondary: brandColors.primaryMaroon200,
  headerTint: brandColors.primaryDarkMaroon, // Use brandColors
  tabBarActiveTint: brandColors.primaryDarkMaroon, // <<< CORRECTED: Use brandColors
  tabBarInactiveTint: brandColors.primaryMaroon200, // <<< CORRECTED: Use brandColors
  buttonText: brandColors.primaryWhite,
  textPrimaryOnGradient: brandColors.blackText,
  textSecondaryOnGradient: brandColors.primaryMaroon200,
  textOnPrimary: brandColors.primaryWhite,
  textOnSuccess: brandColors.primaryWhite,
  textOnSecondary: brandColors.blackText,
  textDisabled: brandColors.primaryMaroon200,
  codeText: brandColors.blackText,
  link: brandColors.primaryDarkMaroon,

  // UI Elements & Borders
  primary: brandColors.primaryDarkMaroon,
  border: brandColors.primaryLightGray,
  placeholder: brandColors.primaryLightGray,
  shadowColor: commonColors.black,
  disabledBorder: brandColors.primaryWhite100,
  rippleOnPrimary: brandColors.primaryDarkMaroon + "99",
  quoteBorder: brandColors.primaryDarkMaroon,

  // Gradients
  gradientStart: brandColors.primaryWhite,
  gradientEnd: brandColors.primaryWhite,

  // Switch
  switchTrackOff: brandColors.primaryLightGray,
  switchTrackOn: brandColors.primaryMaroon100,
  switchThumbOff: brandColors.primaryWhite,
  switchThumbOn: brandColors.primaryWhite,
};

// Dark Theme Definition
export const darkColors = {
  mode: "dark",
  ...commonColors,
  // Backgrounds
  background: commonColors.black,
  cardBackground: "#1C1C1E",
  headerBackground: brandColors.primaryDarkMaroon900,
  warningBackground: brandColors.errorRed + "40",
  statusBarBackground: brandColors.primaryDarkMaroon900,
  disabledBackground: "#333333", // Keep example dark disabled background
  disabledBorder: "#555555", // Keep example dark disabled border
  // Text
  textPrimary: brandColors.primaryWhite,
  textSecondary: brandColors.primaryLightGray,
  textOnPrimary: brandColors.primaryWhite,
  headerTint: brandColors.primaryWhite,
  buttonText: brandColors.primaryWhite,
  textDisabled: brandColors.primaryLightGray,
  // UI Elements & Borders
  primary: brandColors.primaryMaroon100, // Use lighter maroon for primary in dark
  border: "#38383A",
  placeholder: "#38383A",
  shadowColor: commonColors.black,
  // Gradients
  gradientStart: brandColors.primaryDarkMaroon,
  gradientEnd: commonColors.black,
  // Switch
  switchTrackOff: "#3e3e3e",
  switchTrackOn: brandColors.primaryMaroon100,
  switchThumbOff: brandColors.primaryLightGray,
  switchThumbOn: brandColors.primaryWhite,
  // Add any other keys your themed components need
  wordBackground: "#373434",
};
