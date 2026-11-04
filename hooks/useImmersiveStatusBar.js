// hooks/useImmersiveStatusBar.js
// Hides the phone's top status bar (time, signal, battery) while a kid is in a quest: map, Learn page, quiz, reading
// (owner, 2026-11-04 and 2026-11-05: "distracting, makes the UI look bad"). Same idea as the Space quest navigator.
// A shared counter: going from one quest screen to the next (map → quiz) never flashes the bar back, because the old
// screen's "show" waits a moment and only happens when no quest screen is focused any more.

import { useCallback } from "react";
import { StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

let focused = 0;
let showTimer = null;

export default function useImmersiveStatusBar() {
  useFocusEffect(
    useCallback(() => {
      focused += 1;
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      StatusBar.setHidden(true, "fade");
      return () => {
        focused = Math.max(0, focused - 1);
        if (showTimer) clearTimeout(showTimer);
        showTimer = setTimeout(() => {
          showTimer = null;
          if (focused === 0) StatusBar.setHidden(false, "fade");
        }, 250);
      };
    }, [])
  );
}
