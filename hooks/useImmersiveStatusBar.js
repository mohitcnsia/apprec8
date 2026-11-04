// hooks/useImmersiveStatusBar.js
// Hides the phone's top status bar while a kid reads or plays (owner, 2026-11-04: "too much information, not clean").
// Same approach as the Space quest (navigation/QuestNavigator.js). Shown again when the screen loses focus.

import { useCallback } from "react";
import { StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function useImmersiveStatusBar() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true, "fade");
      return () => StatusBar.setHidden(false, "fade");
    }, [])
  );
}
