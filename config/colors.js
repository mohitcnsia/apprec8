// src/config/colors.js

import { Appearance } from "react-native";

// --- Step 1: Define your Brand Colors ---
const brandColors = {
  primaryDarkMaroon: "#3b0940",
  primaryDarkMaroon900: "#3d1141",
  primaryDarkMaroon800: "#4e1a53",
  primaryMaroon10: "#f5d2f8", // A very light pink/purple
  primaryMaroon100: "#85508a", // A medium maroon/purple
  primaryMaroon200: "rgba(70, 64, 71, 1)", // Dark grayish maroon
  primaryLightGray: "#d7d1d3",
  primaryLightYellow: "#f0e3b0",
  primaryBrightYellow: "#dcb51b",
  primaryLightPink: "#f0b0f0",
  pinkPressed: "#e090d0",
  primaryOrange: "#f12b15", // Accent
  blackText: "#000000",
  primaryWhite: "#ffffff",
  primaryWhite100: "#d7c8c8", // A light, slightly off-white gray
  primaryPink100: "#f6ebef", // A very light pink, good for backgrounds
  successGreen: "#6dbb7e",
  errorRed: "#c86c62", // Warning/Error
};

// --- Step 2: Export the Legacy `Colors` Object (Backward Compatibility) ---
export const Colors = {
  ...brandColors,
};

// --- Step 3: Define the New Theme Structure ---
const commonColors = {
  white: brandColors.primaryWhite,
  black: brandColors.blackText,
  transparent: "transparent",
  success: brandColors.successGreen,
  warning: brandColors.errorRed,
  accent: brandColors.primaryOrange,
};

// Light Theme Definition
export const lightColors = {
  mode: "light",
  ...commonColors,

  // Backgrounds
  background: brandColors.primaryWhite,
  cardBackground: brandColors.primaryPink100,
  headerBackground: brandColors.primaryWhite,
  tabBarBackground: brandColors.primaryWhite,
  warningBackground: brandColors.primaryPink100,
  successBackground: brandColors.successGreen + "30",
  disabledBackground: brandColors.primaryLightGray,
  wordBackground: brandColors.primaryDarkMaroon + "15",
  quoteBackground: brandColors.primaryDarkMaroon + "10",
  codeBackground: brandColors.primaryLightGray + "80",
  inputBackground: brandColors.primaryWhite,
  listItemBackground: brandColors.primaryPink100,
  currentUserListItemBackground: brandColors.primaryMaroon10,
  infoBlockBackground: "rgba(0, 0, 0, 0.7)",

  // Text
  textPrimary: brandColors.blackText,
  textSecondary: brandColors.primaryMaroon200,
  headerTint: brandColors.primaryDarkMaroon,
  tabBarActiveTint: brandColors.primaryDarkMaroon,
  tabBarInactiveTint: brandColors.primaryMaroon200,
  buttonText: brandColors.primaryWhite,
  textPrimaryOnGradient: brandColors.blackText,
  textSecondaryOnGradient: brandColors.primaryMaroon200,
  textOnPrimary: brandColors.primaryWhite,
  textOnSuccess: brandColors.primaryWhite,
  textOnSecondary: brandColors.blackText,
  textDisabled: brandColors.primaryMaroon200,
  codeText: brandColors.blackText,
  link: brandColors.primaryDarkMaroon,
  inputText: brandColors.blackText,

  // UI Elements & Borders
  primary: brandColors.primaryDarkMaroon, // Primary button color for light theme (darker maroon)
  border: brandColors.primaryLightGray,
  borderLight: brandColors.primaryWhite100,
  placeholder: brandColors.primaryLightGray,
  shadowColor: commonColors.black + "33",
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

  // New Keys for LeaderCard and TopThreeDisplay (Podium)
  cardBackgroundPodium: brandColors.primaryWhite,
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  textOnGoldSilverBronze: brandColors.blackText,
  podiumAvatarBorder: brandColors.primaryWhite,
  podiumAreaBackground: commonColors.transparent,
  placeholderCard: brandColors.primaryPink100,

  fabBackground: brandColors.primaryDarkMaroon,
  fabIconColor: brandColors.primaryWhite,
  fabPressedBackground: brandColors.primaryDarkMaroon800,
  fabRippleColor: brandColors.primaryWhite + "77",
};

// Dark Theme Definition
export const darkColors = {
  mode: "dark",
  ...commonColors,
  // Backgrounds
  background: commonColors.black, // Pure black
  cardBackground: "#1C1C1E",
  headerBackground: brandColors.primaryDarkMaroon900,
  warningBackground: brandColors.errorRed + "40",
  successBackground: brandColors.successGreen + "30",
  statusBarBackground: brandColors.primaryDarkMaroon900,

  // --- FINAL CONTRAST BOOST FOR DISABLED BUTTON IN DARK MODE ---
  disabledBackground: brandColors.primaryWhite, // Pure white for disabled button background
  disabledBorder: brandColors.primaryWhite, // White border for consistency
  // --- END FINAL REVISION ---

  inputBackground: "#333333",
  listItemBackground: "#1C1C1E",
  currentUserListItemBackground: "#2A2A3D",
  infoBlockBackground: "rgba(220, 220, 220, 0.15)",

  // Text
  textPrimary: brandColors.primaryWhite,
  textSecondary: brandColors.primaryLightGray,
  textOnPrimary: brandColors.primaryWhite,
  headerTint: brandColors.primaryWhite,
  buttonText: brandColors.primaryWhite,

  // --- FINAL CONTRAST BOOST FOR DISABLED BUTTON TEXT IN DARK MODE ---
  textDisabled: brandColors.blackText, // Pure black text for disabled button
  // --- END FINAL REVISION ---

  inputText: brandColors.primaryWhite,
  textPrimaryOnGradient: brandColors.primaryWhite,
  textSecondaryOnGradient: brandColors.primaryLightGray,

  // UI Elements & Borders
  primary: brandColors.primaryMaroon100, // Primary button color for dark theme (lighter maroon/purple)
  border: "#38383A",
  borderLight: "#4F4F4F",
  placeholder: "#5A5A5A",
  shadowColor: commonColors.black,
  rippleOnPrimary: brandColors.primaryDarkMaroon + "77",

  // Gradients
  gradientStart: brandColors.primaryDarkMaroon,
  gradientEnd: commonColors.black,

  // Switch
  switchTrackOff: "#3e3e3e",
  switchTrackOn: brandColors.primaryMaroon100,
  switchThumbOff: brandColors.primaryLightGray,
  switchThumbOn: brandColors.primaryWhite,
  wordBackground: "#272727",

  // New Keys for LeaderCard and TopThreeDisplay (Podium)
  cardBackgroundPodium: "#202022",
  gold: "#FFC107",
  silver: "#B0BEC5",
  bronze: "#A1887F",
  textOnGoldSilverBronze: brandColors.primaryWhite,
  podiumAvatarBorder: "#38383A",
  podiumAreaBackground: commonColors.transparent,
  placeholderCard: "#2C2C2E",

  fabBackground: brandColors.primaryLightPink,
  fabIconColor: brandColors.primaryDarkMaroon,
  fabPressedBackground: brandColors.pinkPressed,
  fabRippleColor: brandColors.primaryDarkMaroon + "77",
};
