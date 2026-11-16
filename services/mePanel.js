// services/mePanel.js: open/close the Me side panel (components/me/MePanel.js) from anywhere (your face on Home).
import { useEffect, useState } from "react";

let open = false;
const subs = new Set();
const set = (v) => {
  open = v;
  subs.forEach((f) => f(v));
};
export const openMePanel = () => set(true);
export const closeMePanel = () => set(false);
export function useMePanel() {
  const [v, setV] = useState(open);
  useEffect(() => {
    subs.add(setV);
    return () => subs.delete(setV);
  }, []);
  return v;
}
