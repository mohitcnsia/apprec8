// hooks/useStartupUpdate.js
// Never a second restart for an over-the-air update (owner, 2026-11-09: "closing and reopening twice is a very bad
// experience"). On start, while the loading screen shows:
// - check for an update (up to CHECK_MS); none → open the app;
// - one found → the loader says "Getting the latest Apprec8…" and waits up to DOWNLOAD_MS for it, then reloads into it;
// - still downloading after that → open the app anyway; when the download finishes, `updateReady` turns true and the
//   app shows a "New version ready · Tap to refresh" banner (reloadNow). Nothing ever reloads by itself mid-lesson.

import { useEffect, useState } from "react";
import * as Updates from "expo-updates";

const CHECK_MS = 6000;
const DOWNLOAD_MS = 15000;

export default function useStartupUpdate() {
  // Dev builds / Expo Go have no update channel: nothing to wait for.
  const enabled = !__DEV__ && Updates.isEnabled;
  const [checking, setChecking] = useState(enabled);
  const [downloading, setDownloading] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    let opened = false; // the app is showing (the loader is gone)
    const open = () => {
      if (!opened) {
        opened = true;
        setChecking(false);
      }
    };
    let timer = setTimeout(open, CHECK_MS);

    (async () => {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (!check.isAvailable) return open();
        if (!opened) {
          // Found one in time: give the download longer, and say so on the loader.
          clearTimeout(timer);
          setDownloading(true);
          timer = setTimeout(open, DOWNLOAD_MS);
        }
        const fetched = await Updates.fetchUpdateAsync();
        if (!fetched.isNew) return open();
        if (!opened) {
          opened = true;
          await Updates.reloadAsync(); // still on the loader: switch now
          return undefined;
        }
        setUpdateReady(true); // the app is already open: offer the banner instead
      } catch (e) {
        console.warn("useStartupUpdate: update check failed", e?.message || e);
      }
      open();
      return undefined;
    })();

    return () => clearTimeout(timer);
  }, [enabled]);

  const reloadNow = () => Updates.reloadAsync().catch(() => {});
  return { checkingForUpdate: checking, downloadingUpdate: downloading, updateReady, reloadNow };
}
