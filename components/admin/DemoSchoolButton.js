// components/admin/DemoSchoolButton.js
// Admin tools → "Reset Demo School" (spec: CODE_REVIEW.md 2026-11-05). Builds the made-up school on the phone
// (utils/demoSchool.js, from the bundled quest questions) and sends it to the admin-only server function, which
// deletes the old demo data, writes the new one and sets the password of the 3 demo logins (@example.com).
// The password is typed here, sent once over HTTPS and never saved (not in the app, not in Firestore, not in git).

import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import functions from "@react-native-firebase/functions";
import { QUESTS } from "../../data/quests";
import { buildDemoSchool, DEMO_LOGINS } from "../../utils/demoSchool";
import { showAlert } from "../../services/dialog";

export default function DemoSchoolButton({ P }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); // owner 2026-11-06: let people see what they typed (mistakes lock the demo logins)
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const { ops, summary } = buildDemoSchool({ quests: QUESTS, now: Date.now() });
      const res = await functions().httpsCallable("seedDemoSchool", { timeout: 300000 })({ ops, password });
      setPassword("");
      showAlert(
        "Demo School ready",
        `${summary.kids + 1} kids, ${summary.attempts} attempts (${res.data.written} documents; ${res.data.deleted} old ones removed).\n\nLogins: ${DEMO_LOGINS.map((l) => l.email).join(", ")}. Keep the password in Play Console only.`
      );
    } catch (e) {
      const msg = e?.code === "functions/not-found" || /not.?found/i.test(e?.message || "") ? "The server part isn't deployed yet (DR-16)." : e?.message || String(e);
      showAlert("Couldn't reset the Demo School", msg);
    }
    setBusy(false);
  };
  const confirm = () =>
    showAlert("Reset the Demo School?", "Deletes the old demo data and writes a fresh made-up class (about 1,100 writes, free). Real children are never touched.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", onPress: run },
    ]);
  const ok = password.length >= 8 && !busy;
  return (
    <View style={{ gap: 8 }}>
      <Text style={[s.soft, { color: P.textSoft }]}>Demo School: 2 classes, 44 made-up kids, 6 weeks of practice. For Seema's tour, testing and Play reviewers. Moves forward every Sunday by itself.</Text>
      <View style={{ justifyContent: "center" }}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Password for the 3 demo logins (8+ characters)"
          placeholderTextColor={P.dimText}
          style={[s.input, { borderColor: P.border, color: P.text, backgroundColor: P.bg, paddingRight: 52 }]}
        />
        <Pressable onPress={() => setShow(!show)} hitSlop={8} accessibilityRole="button" accessibilityLabel={show ? "Hide password" : "Show password"} style={s.eye}>
          <Text style={{ fontSize: 18, color: P.textSoft }}>{show ? "🙈" : "👁"}</Text>
        </Pressable>
      </View>
      <Pressable onPress={confirm} disabled={!ok} accessibilityRole="button" style={[s.button, { backgroundColor: P.primary }, !ok && { opacity: 0.5 }]}>
        {busy ? <ActivityIndicator color={P.onPrimary} /> : <Text style={[s.buttonText, { color: P.onPrimary }]}>RESET DEMO SCHOOL</Text>}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  soft: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold" },
  input: { height: 50, borderRadius: 14, borderWidth: 2, paddingHorizontal: 14, fontSize: 16, fontFamily: "nunitoBold" },
  eye: { position: "absolute", right: 6, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  button: { height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 16, fontFamily: "nunitoBold", letterSpacing: 0.5 },
});
