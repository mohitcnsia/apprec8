// services/guideActive.js: the guide step being done right now (shown by the GuideStrip on every screen).
// In memory only: closing the app ends the strip; the guide itself remembers progress from real data.
import { useEffect, useState } from "react";

let active = null; // { guideId, stepId, n, total, hint }
const listeners = new Set();

export const getActiveGuide = () => active;
export function setActiveGuide(next) {
  active = next;
  listeners.forEach((fn) => fn(active));
}
export function useActiveGuide() {
  const [value, setValue] = useState(active);
  useEffect(() => {
    listeners.add(setValue);
    return () => listeners.delete(setValue);
  }, []);
  return value;
}
