// services/persona.js: the owner's "View as" choice, kept on this phone (utils/persona.js has the rules).
// Only the owner's account uses it; for anyone else the persona is always "owner" (= no change).
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APPREC8_TEAM_REVIEWER_UID } from "../config/appConfig";
import { authInstance } from "../config/firebaseConfig";
import { OWNER, cleanPersona, applyPersona } from "../utils/persona";

const KEY = "ownerPersona:v1";
let current = OWNER;
const subs = new Set();
const isOwnerAccount = () => !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID;

AsyncStorage.getItem(KEY)
  .then((v) => {
    if (!v) return;
    current = cleanPersona(JSON.parse(v));
    subs.forEach((f) => f(current));
  })
  .catch(() => {});

/** The persona in force on this phone (always the owner for other accounts). */
export const currentPersona = () => (isOwnerAccount() ? current : OWNER);
export const personaIsOwner = () => currentPersona().role === "owner";

export function setPersona(p) {
  current = cleanPersona(p);
  AsyncStorage.setItem(KEY, JSON.stringify(current)).catch(() => {});
  subs.forEach((f) => f(current));
}

/** Calls f(persona) on every change; returns unsubscribe. */
export function onPersonaChange(f) {
  subs.add(f);
  return () => subs.delete(f);
}

/** The user doc as the current persona has it. */
export const withPersona = (data) => (isOwnerAccount() ? applyPersona(data, current) : data);

/** Re-renders when the persona changes. */
export function usePersona() {
  const [p, setP] = useState(currentPersona());
  useEffect(() => {
    const off = onPersonaChange(() => setP(currentPersona()));
    setP(currentPersona());
    return off;
  }, []);
  return p;
}
