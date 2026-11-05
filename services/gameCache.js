// services/gameCache.js
// Cost guard (2026-11-05): game word lists change rarely (only when an admin seeds them), so each phone keeps a copy
// for a week (utils/cachePolicy.isFreshByAge) instead of reading every document on every open.
// The Vocab game alone was ~480 reads per open. The admin's copy lasts only 2 minutes, so newly seeded words show quickly.
// Offline or on a network error, an older copy is used so kids can keep playing.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFreshByAge } from "../utils/cachePolicy";

export async function cachedGameData(key, fetcher, { maxAgeMs } = {}) {
  let entry = null;
  try {
    const raw = await AsyncStorage.getItem(key);
    entry = raw ? JSON.parse(raw) : null;
  } catch {
    entry = null;
  }
  if (isFreshByAge(entry, maxAgeMs ? { maxAgeMs } : {})) return entry.data;
  try {
    const data = await fetcher();
    AsyncStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data })).catch((e) =>
      console.warn("gameCache: could not save", key, e?.message)
    );
    return data;
  } catch (e) {
    if (entry?.data) {
      console.warn("gameCache: network failed, using older copy for", key);
      return entry.data;
    }
    throw e;
  }
}
