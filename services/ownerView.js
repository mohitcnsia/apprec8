// services/ownerView.js: the owner's "Owner extras" switch (owner 2026-11-06: "View as"). Off = the owner's phone shows
// what other grown-ups see: no old quizzes, no Fun extras, no unlock-all / tester mode, no admin-only guides or Kids
// view. Me → ADMIN (with this switch) and Decisions stay, so the owner can switch back. For a child's view: Play as a
// test child profile. Only changes what this phone shows; nothing is saved to anyone.

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTesterUser } from "../config/appConfig";
import { personaIsOwner, onPersonaChange } from "./persona";

const KEY = "ownerExtras:v1";
// Owner, 11 Nov: starts OFF (old content kept coming back after a reinstall); on only after switching it on in Me.
let extrasOn = false;
const subs = new Set();

AsyncStorage.getItem(KEY)
  .then((v) => {
    if (v === "on" && !extrasOn) {
      extrasOn = true;
      subs.forEach((f) => f(true));
    }
  })
  .catch(() => {});

// Viewing as a kid, parent or teacher (services/persona.js) turns the extras off too.
export const ownerExtrasOn = () => extrasOn && personaIsOwner();

export function setOwnerExtras(on) {
  extrasOn = !!on;
  AsyncStorage.setItem(KEY, extrasOn ? "on" : "off").catch(() => {});
  subs.forEach((f) => f(extrasOn));
}

/** Re-renders when the switch changes. */
export function useOwnerExtras() {
  const [on, setOn] = useState(ownerExtrasOn());
  useEffect(() => {
    const update = () => setOn(ownerExtrasOn());
    subs.add(update);
    const offPersona = onPersonaChange(update);
    update();
    return () => {
      subs.delete(update);
      offPersona();
    };
  }, []);
  return on;
}

/** Tester mode (unlock-all, drafts) for what the screen SHOWS: off while the owner views as everyone else. */
export const isTesterView = (user) => isTesterUser(user) && ownerExtrasOn();
