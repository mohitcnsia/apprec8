// components/common/TimeUpOverlay.js
// When a child's play time (chosen in "Play as", mockup N1) is over: a friendly full-screen pause from Chamak.
// Only the parent's app PIN closes it (switches the phone back to the parent and unpins it). Android back does nothing.

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import Mascot from "../quiz/Mascot";
import { sessionStatus } from "../../utils/playSession";
import { getSession, onSessionChange } from "../../services/playSession";
import { backToParent } from "../../services/familyApi";

export default function TimeUpOverlay({ uid }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const [session, setSession] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    getSession().then((s) => alive && setSession(s));
    const off = onSessionChange((s) => setSession(s));
    const t = setInterval(() => setNow(Date.now()), 20000);
    return () => {
      alive = false;
      off();
      clearInterval(t);
    };
  }, []);

  const { timeUp } = sessionStatus(session, { uid, now });
  if (!timeUp) return null;

  const unlock = async () => {
    setBusy(true);
    setError(null);
    try {
      await backToParent(pin);
      setPin("");
    } catch (e) {
      setError(e?.message || "That PIN didn't work.");
    }
    setBusy(false);
  };

  return (
    <Modal visible transparent={false} animationType="fade" onRequestClose={() => {}} statusBarTranslucent>
      <View style={styles.screen}>
        <View style={styles.top}>
          <Mascot size={110} />
          <Text style={styles.title}>Great work, {session.childName}! ⭐</Text>
          <Text style={styles.body}>Time is up for today. Give the phone back to Mummy or Papa.</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.label}>PARENT: ENTER YOUR APP PIN</Text>
          <TextInput
            value={pin}
            onChangeText={(v) => setPin(v.replace(/\D/g, "").slice(0, 4))}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            accessibilityLabel="Parent PIN"
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={unlock} disabled={pin.length !== 4 || busy} accessibilityRole="button" style={[styles.button, (pin.length !== 4 || busy) && { opacity: 0.6 }]}>
            {busy ? <ActivityIndicator color={P.onPrimary} /> : <Text style={styles.buttonText}>SWITCH TO PARENT</Text>}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg, justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 80, paddingBottom: 32 },
    top: { alignItems: "center", gap: 14 },
    title: { fontSize: 28, lineHeight: 34, fontFamily: "nunitoBold", color: P.text, textAlign: "center" },
    body: { fontSize: 18, lineHeight: 26, fontFamily: "nunitoBold", color: P.textSoft, textAlign: "center" },
    bottom: { gap: 10 },
    label: { fontSize: 13, letterSpacing: 1.2, fontFamily: "nunitoBold", color: P.label, textAlign: "center" },
    input: { height: 60, borderRadius: 16, borderWidth: 2, borderColor: P.border, backgroundColor: P.card, color: P.text, fontSize: 28, letterSpacing: 12, textAlign: "center", fontFamily: "nunitoBold" },
    error: { fontSize: 15, fontFamily: "nunitoBold", color: P.wrongText, textAlign: "center" },
    button: { height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center" },
    buttonText: { color: P.onPrimary, fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
  });
