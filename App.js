// App.js
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { V2Provider } from "./context/V2Context";
import { NavigationContainer } from "@react-navigation/native";
import AppContent from "./AppContent"; // Import the new AppContent component

export default function App() {
  // Wrap the main application content with the ThemeProvider
  return (
    <ThemeProvider>
      <V2Provider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </V2Provider>
    </ThemeProvider>
  );
}
