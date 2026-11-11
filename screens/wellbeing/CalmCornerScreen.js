// screens/wellbeing/CalmCornerScreen.js: Seema's 9 calming strategies (Calm corner, well-being tab, 2026-11-11).
// Opened after a sad "just today" tap and from Home. Breathing and 5 senses are guided; every card can be read aloud.
// Nothing here is saved or sent anywhere.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import useReduceMotion from "../../hooks/useReduceMotion";
import { CALM, SENSES_STEPS } from "../../utils/mood";

const say = (t) => {
  Speech.stop();
  Speech.speak(t, { language: "en-IN", rate: 0.85 });
};

function Breathe({ P, styles, onDone }) {
  const reduce = useReduceMotion();
  const size = useRef(new Animated.Value(0)).current;
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    let alive = true;
    const run = (r) => {
      if (!alive) return;
      if (r > 3) return onDone();
      setRound(r);
      setPhase("in");
      say("Breathe in");
      Animated.timing(size, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start(() => {
        if (!alive) return;
        setPhase("out");
        say("Breathe out");
        Animated.timing(size, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start(() => run(r + 1));
      });
    };
    run(1);
    return () => {
      alive = false;
      Speech.stop();
    };
  }, []);
  // Reduce motion: the circle stays still; the words and the voice still pace the breaths (4 s in, 4 s out).
  const scale = size.interpolate({ inputRange: [0, 1], outputRange: [reduce ? 1 : 0.5, 1] });
  return (
    <View style={{ alignItems: "center", gap: 16, paddingVertical: 12 }}>
      <Animated.View style={[styles.circle, { backgroundColor: P.selectedBg, borderColor: P.selectedBorder, transform: [{ scale }] }]} />
      <Text style={styles.big}>{phase === "in" ? "Breathe in…" : "Breathe out…"}</Text>
      <Text style={styles.soft}>Round {round} of 3</Text>
    </View>
  );
}

function Senses({ styles, onDone }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    say(SENSES_STEPS[i]);
  }, [i]);
  const last = i === SENSES_STEPS.length - 1;
  return (
    <View style={{ gap: 14, paddingVertical: 8 }}>
      <Text style={styles.big}>{SENSES_STEPS[i]}</Text>
      <Pressable onPress={() => (last ? onDone() : setI(i + 1))} accessibilityRole="button" style={styles.main}>
        <Text style={styles.mainText}>{last ? "DONE" : "NEXT"}</Text>
      </Pressable>
    </View>
  );
}

export default function CalmCornerScreen() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const [open, setOpen] = useState(null); // strategy id
  const [guide, setGuide] = useState(null); // "breathe" | "senses"
  useEffect(() => () => Speech.stop(), []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calm corner</Text>
      <Text style={styles.soft}>Try one or more of these to feel better.</Text>
      {CALM.map((c) => (
        <View key={c.id} style={styles.card}>
          <Pressable onPress={() => (setOpen(open === c.id ? null : c.id), setGuide(null))} accessibilityRole="button" accessibilityLabel={c.title} style={styles.row}>
            <Text style={styles.emoji}>{c.emoji}</Text>
            <Text style={styles.cardTitle}>{c.title}</Text>
            <Text style={styles.soft}>{open === c.id ? "▲" : "▼"}</Text>
          </Pressable>
          {open === c.id ? (
            <View style={{ gap: 10, marginTop: 8 }}>
              {guide === c.guide && guide === "breathe" ? <Breathe P={P} styles={styles} onDone={() => setGuide(null)} /> : null}
              {guide === c.guide && guide === "senses" ? <Senses styles={styles} onDone={() => setGuide(null)} /> : null}
              {guide !== c.guide || !c.guide ? (
                <>
                  <Text style={styles.body}>{c.text}</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {c.guide ? (
                      <Pressable onPress={() => setGuide(c.guide)} accessibilityRole="button" style={styles.main}>
                        <Text style={styles.mainText}>START</Text>
                      </Pressable>
                    ) : null}
                    <Pressable onPress={() => say(`${c.title}. ${c.text}`)} accessibilityRole="button" accessibilityLabel={`Hear: ${c.title}`} style={styles.hear}>
                      <Text style={styles.hearText}>🔊 Hear</Text>
                    </Pressable>
                  </View>
                </>
              ) : null}
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { padding: 16, gap: 10, paddingBottom: 40 },
    title: { fontSize: 26, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 14, fontFamily: "nunito", color: P.textSoft },
    card: { padding: 14, borderRadius: 18, backgroundColor: P.card, borderWidth: 1, borderColor: P.border },
    row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 },
    emoji: { fontSize: 26 },
    cardTitle: { flex: 1, fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    body: { fontSize: 16, fontFamily: "nunito", color: P.text, lineHeight: 23 },
    big: { fontSize: 22, fontFamily: "nunitoBold", color: P.text, textAlign: "center" },
    circle: { width: 160, height: 160, borderRadius: 80, borderWidth: 2 },
    main: { paddingHorizontal: 22, minHeight: 46, borderRadius: 23, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    mainText: { fontSize: 15, fontFamily: "nunitoBold", color: P.onPrimary },
    hear: { paddingHorizontal: 16, minHeight: 46, borderRadius: 23, borderWidth: 1, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    hearText: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
  });
