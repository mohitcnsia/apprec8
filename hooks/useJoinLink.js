// hooks/useJoinLink.js: a parent taps the class link on WhatsApp → the page opens apprec8://join/<token> → this hook
// keeps the token (on the phone, so it survives sign-in, first run and an update restart) and opens the join screen
// as soon as someone is signed in and past first run. Sign-up without codes, stage 1 (2026-11-11).
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseJoinLink } from "../utils/joinLink";
import { navRef } from "../navigation/navRef";

const KEY = "pendingJoinLink.v1";
const KEEP_MS = 24 * 3600 * 1000; // a link tapped yesterday and never finished is forgotten

async function remember(url, setToken) {
  const token = parseJoinLink(url);
  if (!token) return;
  setToken(token);
  await AsyncStorage.setItem(KEY, JSON.stringify({ token, at: Date.now() })).catch(() => {});
}

/** ready = signed in, past first run, the main screens showing. */
export default function useJoinLink(ready) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((v) => {
        const saved = v ? JSON.parse(v) : null;
        if (alive && saved?.token && Date.now() - saved.at < KEEP_MS) setToken(saved.token);
      })
      .catch(() => {});
    Linking.getInitialURL().then((url) => url && remember(url, setToken)).catch(() => {});
    const sub = Linking.addEventListener("url", ({ url }) => remember(url, setToken));
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (!ready || !token) return undefined;
    let tries = 0;
    let timer = null;
    const open = () => {
      if (navRef.isReady()) {
        navRef.navigate("Profile", { screen: "JoinByLink", initial: false, params: { token } });
        setToken(null);
        AsyncStorage.removeItem(KEY).catch(() => {});
      } else if (tries++ < 20) {
        timer = setTimeout(open, 250);
      }
    };
    timer = setTimeout(open, 300);
    return () => clearTimeout(timer);
  }, [ready, token]);
}
