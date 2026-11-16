// services/lookSettings.js: this phone's button style (A · Soft, B · Bold, C · Clean) and hand (right / left) for the
// main action (owner, 16 Nov 2026: "build all three and let users choose"; "user-chosen handedness"). Saved on the phone
// only; default A + right. Same store pattern as services/ownerView.js.
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SKINS, HANDS } from "../utils/buttonSkin";

const KEY = "look:v1";
let look = { skin: "A", hand: "right" };
const subs = new Set();

AsyncStorage.getItem(KEY)
  .then((raw) => {
    const v = raw ? JSON.parse(raw) : null;
    if (!v) return;
    look = { skin: SKINS.includes(v.skin) ? v.skin : "A", hand: HANDS.includes(v.hand) ? v.hand : "right" };
    subs.forEach((f) => f(look));
  })
  .catch(() => {});

export const currentLook = () => look;

export function setLook(change) {
  look = { ...look, ...change };
  AsyncStorage.setItem(KEY, JSON.stringify(look)).catch(() => {});
  subs.forEach((f) => f(look));
}

/** { skin, hand }; re-renders when either changes. */
export function useLook() {
  const [v, setV] = useState(look);
  useEffect(() => {
    subs.add(setV);
    setV(look);
    return () => subs.delete(setV);
  }, []);
  return v;
}
