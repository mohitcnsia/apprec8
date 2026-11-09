// screens/auth/FirstRunScreen.js: first run (mockup T4, owner OK 2026-11-05): first name + class, or "I'm a parent /
// teacher". Shown once after sign-up (AppContent), so Home stops saying "friend" and class-based things appear.
// Saves only rule-allowed fields (utils/firstRun.js); "grown-up" is remembered on the phone. Chamak's speech bubble
// says what the child types (HeroScene "hello").

import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import HeroScene from "../../components/auth/HeroScene";
import { canSave, firstRunUpdate, bubbleText, needsProfileSave } from "../../utils/firstRun";

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fbee3.webp?alt=media&token=e4b96cb2-7180-4a9b-900d-14c34dbaa6ba";
// True if the account's profile was saved in the last 10 minutes (the rule that limits profile changes).
const recentlySaved = (doc) => {
  const t = doc?.profileLastSavedAt;
  const ms = t?.toMillis ? t.toMillis() : typeof t === "number" ? t : 0;
  return ms > 0 && Date.now() - ms < 10 * 60 * 1000;
};
export const grownUpKey = (uid) => `grownUp:${uid}:v1`;

export default function FirstRunScreen({ uid, userDoc, onDone, onSignOut }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [name, setName] = useState(userDoc?.firstName || "");
  const [grade, setGrade] = useState(Number.isInteger(userDoc?.grade) ? userDoc.grade : null);
  const [role, setRole] = useState(null); // null (child) | "parent" | "teacher"
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ready = !!userDoc; // the account doc is made by the server a few seconds after sign-up
  const gradeFixed = Number.isInteger(userDoc?.grade);

  const save = async () => {
    if (!canSave({ name, grade, role }) || !ready || busy) return;
    setBusy(true);
    setError("");
    try {
      // Nothing new to save (a grown-up with the same name): skip the write, so the 10-minute profile rule can't block.
      if (needsProfileSave(userDoc, { name, grade, role }))
        await db
          .collection("users")
          .doc(uid)
          .update(firstRunUpdate(userDoc, { name, grade, role }, { stamp: firestore.FieldValue.serverTimestamp(), defaultAvatar: DEFAULT_AVATAR }));
      if (role) await AsyncStorage.setItem(grownUpKey(uid), "1").catch(() => {});
      onDone?.({ grownUp: !!role });
    } catch (e) {
      console.warn("First run save failed:", e?.code || e);
      setError(
        e?.code === "firestore/permission-denied"
          ? recentlySaved(userDoc)
            ? "You changed your profile a moment ago. Please try again in 10 minutes."
            : "Couldn't save your profile (not allowed). Please tell us: Me → Tell us what you think."
          : "Couldn't save. Check the internet and try again."
      );
    }
    setBusy(false);
  };

  const chip = (label, on, onPress, key = label) => (
    <Pressable key={key} onPress={onPress} disabled={busy} style={[s.chip, on && s.chipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
      <Text style={[s.chipText, on && { color: P.selectedText }]}>{label}</Text>
    </Pressable>
  );
  const ok = canSave({ name, grade, role }) && ready;

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
        <View style={s.hero}>
          <HeroScene variant="hello" isDark={isDark} bubble={bubbleText({ name, grade, role })} />
        </View>
        <View style={s.block}>
          <View>
            <Text style={s.title}>Hi! Two quick things</Text>
            <Text style={s.sub}>So we show the right lessons.</Text>
          </View>
          <View style={{ gap: 6 }}>
            <Text style={s.label}>YOUR FIRST NAME</Text>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError("");
              }}
              style={s.input}
              placeholder="First name"
              placeholderTextColor={P.dimText}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={24}
              editable={!busy}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Text style={s.label}>YOUR CLASS</Text>
            <View style={s.chips}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) =>
                chip(String(g), !role && grade === g, () => {
                  if (gradeFixed) return;
                  setGrade(g);
                  setRole(null);
                })
              )}
            </View>
            <View style={s.chips}>
              {chip("I'm a parent", role === "parent", () => setRole(role === "parent" ? null : "parent"))}
              {chip("I'm a teacher", role === "teacher", () => setRole(role === "teacher" ? null : "teacher"))}
            </View>
          </View>
          <Text style={s.small}>Others only see your first name and class.</Text>
          {error ? <Text style={s.error}>{error}</Text> : null}
          <Pressable onPress={save} disabled={!ok || busy} style={[s.primary, (!ok || busy) && s.primaryOff]} accessibilityRole="button">
            <Text style={[s.primaryText, (!ok || busy) && { color: P.disabledText }]}>
              {!ready ? "Getting your account ready…" : busy ? "Saving…" : "LET'S GO ▶"}
            </Text>
          </Pressable>
          {/* Never a dead end (owner 2026-11-09): go back and use another account. */}
          {typeof onSignOut === "function" ? (
            <Pressable onPress={onSignOut} disabled={busy} accessibilityRole="button" style={{ alignItems: "center", minHeight: 44, justifyContent: "center" }}>
              <Text style={[s.small, { textDecorationLine: "underline" }]}>Not you? Use a different account</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    scroll: { flexGrow: 1, paddingTop: insets.top },
    hero: { flexGrow: 1, minHeight: 230, justifyContent: "center", paddingVertical: 12 },
    block: { paddingHorizontal: 22, paddingBottom: Math.max(16, insets.bottom + 10), gap: 16 },
    title: { fontSize: 27, fontWeight: "900", color: P.text },
    sub: { fontSize: 15, fontWeight: "700", color: P.textSoft, marginTop: 2 },
    label: { fontSize: 13, fontWeight: "800", letterSpacing: 0.5, color: P.textSoft },
    input: { height: 56, borderRadius: 16, borderWidth: 2, borderColor: P.border, backgroundColor: P.card, paddingHorizontal: 16, fontSize: 18, fontWeight: "700", color: P.text },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { minWidth: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
    chipOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    chipText: { fontSize: 16, fontWeight: "800", color: P.textSoft },
    small: { fontSize: 13, fontWeight: "700", color: P.textSoft },
    error: { fontSize: 15, fontWeight: "700", color: P.wrongText, backgroundColor: P.wrongBg, borderRadius: 12, padding: 10, overflow: "hidden" },
    primary: { height: 60, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center" },
    primaryOff: { backgroundColor: P.disabledBg, borderBottomColor: P.disabledShadow },
    primaryText: { color: P.onPrimary, fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
  });
