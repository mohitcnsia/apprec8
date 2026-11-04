// hooks/useStartupUpdate.js
// One restart is enough for an over-the-air update (owner, 2026-11-04). On start, while the loading screen shows,
// check for a new update; if it downloads in time, reload into it before the kid starts playing.
// Gives up after MAX_WAIT_MS (slow or no network): the app opens as it is, and whatever downloaded is used next start.

import { useEffect, useState } from "react";
import * as Updates from "expo-updates";

const MAX_WAIT_MS = 6000;

export default function useStartupUpdate() {
  // Dev builds / Expo Go have no update channel: nothing to wait for.
  const enabled = !__DEV__ && Updates.isEnabled;
  const [checking, setChecking] = useState(enabled);

  useEffect(() => {
    if (!enabled) return undefined;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setChecking(false);
      }
    };
    const timer = setTimeout(finish, MAX_WAIT_MS);

    (async () => {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (!check.isAvailable) return finish();
        const fetched = await Updates.fetchUpdateAsync();
        // Only reload while the loading screen is still up; later it would interrupt the kid.
        if (fetched.isNew && !done) {
          done = true;
          await Updates.reloadAsync();
          return undefined;
        }
      } catch (e) {
        console.warn("useStartupUpdate: update check failed", e?.message || e);
      }
      finish();
      return undefined;
    })();

    return () => clearTimeout(timer);
  }, [enabled]);

  return { checkingForUpdate: checking };
}
