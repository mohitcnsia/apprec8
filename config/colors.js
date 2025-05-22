// src/config/colors.js

import { Appearance } from "react-native";

// --- Step 1: Define your Brand Colors (as before) ---
// This object holds the actual color values.
const brandColors = {
  primaryDarkMaroon: "#3b0940",
  primaryDarkMaroon900: "#3d1141",
  primaryDarkMaroon800: "#4e1a53",
  primaryMaroon10: "#f5d2f8ff", // A very light pink/purple
  primaryMaroon100: "#85508aff", // A medium maroon/purple
  primaryMaroon200: "rgba(70, 64, 71, 1)", // Dark grayish maroon
  primaryLightGray: "#d7d1d3",
  primaryLightYellow: "#f0e3b0",
  primaryBrightYellow: "#dcb51b",
  primaryLightPink: "#f0b0f0",
  primaryOrange: "#f12b15", // Accent
  blackText: "#000000",
  primaryWhite: "#ffffff",
  primaryWhite100: "#d7c8c8", // A light, slightly off-white gray
  primaryPink100: "#f6ebef", // A very light pink, good for backgrounds
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
  warning: brandColors.errorRed, // Note: Using 'errorRed' for 'warning'
  accent: brandColors.primaryOrange,
};

// Light Theme Definition
// --- UPDATED Light Theme Definition ---
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
  // NEW KEY: Background for list items (can be same as cardBackground)
  listItemBackground: brandColors.primaryPink100,
  // NEW KEY: Background for the current user's list item
  currentUserListItemBackground: brandColors.primaryMaroon10, // Using a subtle light color
  // NEW KEY: Background for info blocks (e.g., from StatsScreen)
  infoBlockBackground: "rgba(0, 0, 0, 0.7)", // Semi-transparent dark

  // Text
  textPrimary: brandColors.blackText,
  textSecondary: brandColors.primaryMaroon200,
  headerTint: brandColors.primaryDarkMaroon,
  tabBarActiveTint: brandColors.primaryDarkMaroon,
  tabBarInactiveTint: brandColors.primaryMaroon200,
  buttonText: brandColors.primaryWhite,
  // ENSURED/MODIFIED KEY: Text on gradients (consider if black is always best)
  textPrimaryOnGradient: brandColors.blackText, // Kept as per your file
  textSecondaryOnGradient: brandColors.primaryMaroon200,
  textOnPrimary: brandColors.primaryWhite,
  textOnSuccess: brandColors.primaryWhite,
  textOnSecondary: brandColors.blackText,
  textDisabled: brandColors.primaryMaroon200,
  codeText: brandColors.blackText,
  link: brandColors.primaryDarkMaroon,
  inputText: brandColors.blackText,

  // UI Elements & Borders
  primary: brandColors.primaryDarkMaroon,
  border: brandColors.primaryLightGray,
  // NEW KEY: Lighter border variant
  borderLight: brandColors.primaryWhite100, // Using one of your defined light grays
  placeholder: brandColors.primaryLightGray,
  shadowColor: commonColors.black + "33", // Added some transparency for subtle shadow
  disabledBorder: brandColors.primaryWhite100,
  rippleOnPrimary: brandColors.primaryDarkMaroon + "99",
  quoteBorder: brandColors.primaryDarkMaroon,

  // Gradients
  gradientStart: brandColors.primaryWhite, // Consider if this should be more colorful for StatsScreen
  gradientEnd: brandColors.primaryWhite, // Consider if this should be more colorful for StatsScreen

  // Switch
  switchTrackOff: brandColors.primaryLightGray,
  switchTrackOn: brandColors.primaryMaroon100,
  switchThumbOff: brandColors.primaryWhite,
  switchThumbOn: brandColors.primaryWhite,

  // --- NEW Keys for LeaderCard and TopThreeDisplay (Podium) ---
  cardBackgroundPodium: brandColors.primaryWhite, // Can be same as cardBackground or slightly different
  gold: "#FFD700", // Standard gold hex
  silver: "#C0C0C0", // Standard silver hex
  bronze: "#CD7F32", // Standard bronze hex
  textOnGoldSilverBronze: brandColors.blackText, // Text on metallic badges (black for gold, adjust for silver/bronze if needed)
  podiumAvatarBorder: brandColors.primaryWhite, // Border for avatars on podium cards
  podiumAreaBackground: commonColors.transparent, // Background for the entire TopThreeDisplay area
  placeholderCard: brandColors.primaryPink100, // Using a very light color for placeholder
};

// Dark Theme Definition
export const darkColors = {
  mode: "dark",
  ...commonColors,
  // Backgrounds
  background: commonColors.black,
  cardBackground: "#1C1C1E", // A common dark surface color
  headerBackground: brandColors.primaryDarkMaroon900,
  warningBackground: brandColors.errorRed + "40", // Semi-transparent errorRed
  successBackground: brandColors.successGreen + "30",
  statusBarBackground: brandColors.primaryDarkMaroon900,
  disabledBackground: "#333333",
  disabledBorder: "#555555",
  inputBackground: "#333333",
  // NEW KEY: Background for list items
  listItemBackground: "#1C1C1E", // Same as cardBackground
  // NEW KEY: Background for the current user's list item
  currentUserListItemBackground: "#2A2A3D", // A subtle dark blue/purple tint
  // NEW KEY: Background for info blocks (e.g., from StatsScreen)
  infoBlockBackground: "rgba(220, 220, 220, 0.15)", // Semi-transparent light

  // Text
  textPrimary: brandColors.primaryWhite,
  textSecondary: brandColors.primaryLightGray,
  textOnPrimary: brandColors.primaryWhite,
  headerTint: brandColors.primaryWhite,
  buttonText: brandColors.primaryWhite,
  textDisabled: brandColors.primaryLightGray,
  inputText: brandColors.primaryWhite,
  // NEW KEY: Text on gradients for dark theme
  textPrimaryOnGradient: brandColors.primaryWhite,
  textSecondaryOnGradient: brandColors.primaryLightGray,

  // UI Elements & Borders
  primary: brandColors.primaryMaroon100, // Use lighter maroon for primary in dark
  border: "#38383A",
  // NEW KEY: Lighter border variant for dark mode
  borderLight: "#4F4F4F",
  placeholder: "#5A5A5A", // Adjusted placeholder for better visibility on dark
  shadowColor: commonColors.black, // Shadows are often less visible or different in dark mode
  // Gradients
  gradientStart: brandColors.primaryDarkMaroon, // Kept as per your file
  gradientEnd: commonColors.black, // Kept as per your file
  // Switch
  switchTrackOff: "#3e3e3e",
  switchTrackOn: brandColors.primaryMaroon100,
  switchThumbOff: brandColors.primaryLightGray,
  switchThumbOn: brandColors.primaryWhite,
  // Add any other keys your themed components need
  wordBackground: "#272727", // Adjusted for better dark theme integration

  // --- NEW Keys for LeaderCard and TopThreeDisplay (Podium) ---
  cardBackgroundPodium: "#202022", // Slightly different dark for podium cards
  gold: "#FFC107", // Gold, possibly slightly desaturated for dark mode
  silver: "#B0BEC5", // Silver, can be a bit lighter for contrast
  bronze: "#A1887F", // Bronze for dark mode
  textOnGoldSilverBronze: brandColors.primaryWhite, // White text on dark metallic badges
  podiumAvatarBorder: "#38383A", // Using dark border color
  podiumAreaBackground: commonColors.transparent,
  placeholderCard: "#2C2C2E", // Dark placeholder
};
