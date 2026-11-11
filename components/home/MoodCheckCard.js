// components/home/MoodCheckCard.js: the weekly mood check on a kid's Home (well-being safety steps, 2026-11-11).
// Once a week, taps only. Happy / Okay → a kind line. Sad → "Just today, or for a while?":
//   just today → Calm corner (3 strategies); for a while → Let the counsellor know · 1098 · 14416 · I'm okay for now.
// Nothing changes anywhere else in the app (no streak or score touched). Taps go only to the server (moodApi).
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { dayNumber } from "../../utils/dailyCard";
import { MOODS, MESSAGES, HELPLINES, shouldAskMood } from "../../utils/mood";
import { recordMood } from "../../services/moodApi";

const key = () => `moodAnswered.v1.${authInstance.currentUser?.uid || "guest"}`;

export default function MoodCheckCard({ createdAt, onCalm }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const today = dayNumber();
  const [ask, setAsk] = useState(false);
  const [step, setStep] = useState("ask"); // ask | happy | okay | sad | today | while | told
  const [mood, setMood] = useState(null);

  useEffect(() => {
    let alive = true;
    const created = createdAt?.toMillis ? createdAt.toMillis() : Date.parse(createdAt || authInstance.currentUser?.metadata?.creationTime || "");
    AsyncStorage.getItem(key())
      .then((v) => {
        if (alive) setAsk(shouldAskMood({ lastAnsweredDay: v == null ? null : Number(v), today, firstDay: Number.isFinite(created) ? dayNumber(created) : null }));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [today, createdAt]);

  if (!ask) return null;

  const save = (m, extra) => {
    AsyncStorage.setItem(key(), String(today)).catch(() => {});
    recordMood(m, extra).catch((e) => console.warn("recordMood:", e?.code || e?.message)); // the kid never sees an error here
  };
  const pick = (m) => {
    setMood(m);
    setStep(m);
    if (m !== "sad") save(m);
  };
  const done = () => setAsk(false);

  const Btn = ({ label, onPress, main, sub }) => (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={[styles.btn, main && styles.btnMain]}>
      <Text style={[styles.btnText, main && styles.btnTextMain]}>{label}</Text>
      {sub ? <Text style={styles.btnSub}>{sub}</Text> : null}
    </Pressable>
  );

  return (
    <View style={styles.card} accessibilityLabel="How are you feeling this week?">
      {step === "ask" ? (
        <>
          <Text style={styles.label}>THIS WEEK</Text>
          <Text style={styles.title}>How are you feeling?</Text>
          <View style={styles.faces}>
            {MOODS.map((m) => (
              <Pressable key={m.id} onPress={() => pick(m.id)} accessibilityRole="button" accessibilityLabel={m.label} style={styles.face}>
                <Text style={styles.emoji}>{m.emoji}</Text>
                <Text style={styles.faceText}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
          {/* With the mood card, not on its own (owner, 2026-11-12): it goes when the card goes. */}
          {onCalm ? (
            <Pressable onPress={onCalm} accessibilityRole="button" accessibilityLabel="Calm corner" style={{ minHeight: 40, justifyContent: "center" }}>
              <Text style={styles.link}>🌿 Calm corner: ways to feel better ›</Text>
            </Pressable>
          ) : null}
        </>
      ) : null}

      {step === "happy" || step === "okay" ? (
        <>
          <Text style={styles.body}>{MESSAGES[step]}</Text>
          <Btn label="Thanks" onPress={done} main />
        </>
      ) : null}

      {step === "sad" ? (
        <>
          <Text style={styles.body}>{MESSAGES.sad}</Text>
          <Text style={styles.title}>{MESSAGES.sadAsk}</Text>
          <View style={{ gap: 8 }}>
            <Btn label="Just today" onPress={() => (save("sad", { span: "today" }), setStep("today"))} />
            <Btn label="For a while" onPress={() => (save("sad", { span: "while" }), setStep("while"))} />
          </View>
        </>
      ) : null}

      {step === "today" ? (
        <>
          <Text style={styles.body}>{MESSAGES.sadToday}</Text>
          <Btn label="Try something calming" onPress={() => (done(), onCalm && onCalm())} main />
          <Btn label="I'm okay now" onPress={done} />
        </>
      ) : null}

      {step === "while" || step === "told" ? (
        <>
          <Text style={styles.body}>{step === "told" ? MESSAGES.told : MESSAGES.sadWhile}</Text>
          {step === "while" ? <Btn label="Let the counsellor know" sub="They'll find a quiet moment to talk with you" onPress={() => (save(mood || "sad", { span: "while", tellCounsellor: true }), setStep("told"))} main /> : null}
          {HELPLINES.map((h) => (
            <Btn key={h.id} label={h.label} sub={h.sub} onPress={() => Linking.openURL(`tel:${h.tel}`).catch(() => {})} />
          ))}
          <Btn label="I'm okay for now" onPress={done} />
        </>
      ) : null}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 16, borderRadius: 20, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 10 },
    label: { fontSize: 13, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label },
    title: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    body: { fontSize: 16, fontFamily: "nunito", color: P.text, lineHeight: 22 },
    faces: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    face: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderColor: P.border, minHeight: 76 },
    emoji: { fontSize: 32 },
    faceText: { fontSize: 14, fontFamily: "nunitoBold", color: P.text, marginTop: 4 },
    btn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: P.border, minHeight: 48, justifyContent: "center" },
    btnMain: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    btnText: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    btnTextMain: { color: P.selectedText },
    btnSub: { fontSize: 13, fontFamily: "nunito", color: P.textSoft, marginTop: 2 },
    link: { fontSize: 15, fontFamily: "nunitoBold", color: P.label },
  });
