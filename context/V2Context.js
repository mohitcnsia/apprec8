import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const V2Context = createContext({
  isV2Enabled: false,
  toggleV2: () => {},
});

export const V2Provider = ({ children }) => {
  const [isV2Enabled, setIsV2Enabled] = useState(false);

  useEffect(() => {
    const loadV2Preference = async () => {
      try {
        const savedPref = await AsyncStorage.getItem("v2Enabled");
        if (savedPref !== null) {
          setIsV2Enabled(savedPref === "true");
        }
      } catch (error) {
        console.error("Failed to load V2 preference", error);
      }
    };
    loadV2Preference();
  }, []);

  const toggleV2 = async (value) => {
    setIsV2Enabled(value);
    try {
      await AsyncStorage.setItem("v2Enabled", value.toString());
    } catch (error) {
      console.error("Failed to save V2 preference", error);
    }
  };

  return (
    <V2Context.Provider value={{ isV2Enabled, toggleV2 }}>
      {children}
    </V2Context.Provider>
  );
};

export const useV2 = () => useContext(V2Context);
