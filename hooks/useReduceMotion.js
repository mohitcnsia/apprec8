// hooks/useReduceMotion.js
// true when the phone asks for less motion (Android: Settings → Accessibility → "Remove animations",
// which also sets animator_duration_scale = 0). Looping animations stop then: kinder for kids who are
// sensitive to motion, and Android's UI test tools (uiautomator) can only read a screen that goes still.

import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export default function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((v) => alive && setReduce(!!v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", (v) => setReduce(!!v));
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);
  return reduce;
}
