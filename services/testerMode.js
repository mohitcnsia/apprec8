// services/testerMode.js
// In-memory tester settings for English Quest (Spec A). Not saved anywhere, so they
// are off again after the app restarts, and they never touch a kid's saved progress.
import { useSyncExternalStore } from "react";

let state = { unlockAll: false, shortQuizzes: false };
const listeners = new Set();

export const getTesterMode = () => state;

export function setTesterMode(patch) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** React hook: current tester settings (re-renders when they change). */
export const useTesterMode = () => useSyncExternalStore(subscribe, getTesterMode, getTesterMode);
