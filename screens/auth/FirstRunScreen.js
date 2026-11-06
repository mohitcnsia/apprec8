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
import { canSave, firstRunUpdate, bubbleText } from "../../utils/firstRun";
import { isAdultByYear, birthDecades, yearsOf } from "../../utils/consent";

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fbee3.webp?alt=media&token=e4b96cb2-7180-4a9b-900d-14c34dbaa6ba";
export const grownUpKey = (uid) => `grownUp:${uid}:v1`;

export default function FirstRunScreen({ uid, userDoc, onDone }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [name, setName] = useState(userDoc?.firstName || "");
  const [grade, setGrade] = useState(Number.isInteger(userDoc?.grade) ? userDoc.grade : null);
  const [role, setRole] = useState(null); // null (child) | "parent" | "teacher" | "learner" (College / grown-up)
  // Grown-ups give a year of birth (mockup X1: a neutral age screen, Google Families policy). Checked, never stored.
  const [decade, setDecade] = useState(null);
  const [year, setYear] = useState(null);
  const [tooYoung, setTooYoung] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ready = !!userDoc; // the account doc is made by the server a few seconds after sign-up
  const gradeFixed = Number.isInteger(userDoc?.grade);

  const pickRole = (r) => {
    setRole(role === r ? null : r);
    setTooYoung(false);
  };
  const pickYear = (y) => {
    if (isAdultByYear(y)) return setYear(y);
    // Under 18: a student here (the parent says yes next, mockup X2).
    setYear(null);
    setDecade(null);
    setRole(null);
    setTooYoung(true);
  };

  const save = async () => {
    if (!canSave({ name, grade, role }) || (role && !isAdultByYear(year)) || !ready || busy) return;
    setBusy(true);
    setError("");
    try {
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
          ? "You changed your profile a moment ago. Please try again in 10 minutes."
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
  const ok = canSave({ name, grade, role }) && (!role || isAdultByYear(year)) && ready;

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
              {gradeFixed ? null : chip("College / grown-up", role === "learner", () => pickRole("learner"))}
            </View>
            <View style={s.chips}>
              {chip("I'm a parent", role === "parent", () => pickRole("parent"))}
              {chip("I'm a teacher", role === "teacher", () => pickRole("teacher"))}
            </View>
            {tooYoung ? <Text style={s.small}>Then you're a student here: pick your class above. 🙂</Text> : null}
          </View>
          {role ? (
            <View style={{ gap: 8 }}>
              <Text style={s.label}>YEAR YOU WERE BORN</Text>
              <View style={s.chips}>{birthDecades().map((d) => chip(`${d}s`, decade === d, () => { setDecade(d); setYear(null); }, `d${d}`))}</View>
              {decade !== null ? <View style={s.chips}>{yearsOf(decade).map((y) => chip(String(y), year === y, () => pickYear(y), `y${y}`))}</View> : null}
            </View>
          ) : null}
          <Text style={s.small}>Others only see your first name and class.</Text>
          {error ? <Text style={s.error}>{error}</Text> : null}
          <Pressable onPress={save} disabled={!ok || busy} style={[s.primary, (!ok || busy) && s.primaryOff]} accessibilityRole="button">
            <Text style={[s.primaryText, (!ok || busy) && { color: P.disabledText }]}>
              {!ready ? "Getting your account ready…" : busy ? "Saving…" : "LET'S GO ▶"}
            </Text>
          </Pressable>
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
