// components/home/HomeHero.js: the top of Home (owner-approved mockup "Apprec8 Home and Progress", 16 Nov 2026).
// A calm picture fills the top and fades into the page where the tasks begin. On it: your face (opens Me), one quiet
// pill for streak + stars (opens Progress), the date, the greeting, and Thought → Word → Fact to swipe. The cards move on
// by themselves every 30 s until the child touches them, never with "Remove animations". Parents: "Who's learning?".
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import useReduceMotion from "../../hooks/useReduceMotion";
import { authInstance } from "../../config/firebaseConfig";
import { bundledQuest } from "../../data/quests";
import { nodesForGrade } from "../../utils/gradeFilter";
import { dailyCardFor, dayNumber, learnCardsFor, toWords, toScienceFacts, toSpaceFacts, factSourceFor, pruneSaved, recordTap } from "../../utils/dailyCard";
import spaceData from "../../data/space_olympiad_data.json";
import { thoughtOfTheDay } from "./DailySwipeCard";
import { greeting } from "../../utils/homeFeed";

const AUTO_MS = 30000;
const PAD = 18;
const storeKey = () => `dailyCard.v1.${authInstance.currentUser?.uid || "guest"}`;
let spaceFactsCache = null;
const spaceFacts = () => (spaceFactsCache ||= toSpaceFacts(spaceData));

const SCENE = {
  light: { sky: "#E9DDF1", sun: "#F4DFA0", hill1: "#D8C4E4", hill2: "#C8AFD9", ink: "#241027", soft: "#4A3550", label: "#5E3A63", glass: "rgba(255,255,255,0.8)" },
  dark: { sky: "#1E1626", sun: "#BFB28C", hill1: "#2B2135", hill2: "#352840", ink: "#F4EDF5", soft: "#CDBFD0", label: "#D7A9DC", glass: "rgba(255,255,255,0.10)" },
};

/** Today's date as the kids' Home shows it: "MONDAY, 16 NOV". */
export const heroDate = (d = new Date()) =>
  `${d.toLocaleDateString("en-GB", { weekday: "long" })}, ${d.getDate()} ${d.toLocaleDateString("en-GB", { month: "short" })}`.toUpperCase();

function useDailySlides(grade) {
  const today = dayNumber();
  const source = factSourceFor(grade);
  const card = useMemo(() => {
    if (!Number.isInteger(grade)) return null;
    const words = toWords(learnCardsFor(bundledQuest("word-bank"), grade, nodesForGrade));
    const scienceFacts = source === "science" ? toScienceFacts(learnCardsFor(bundledQuest("science-quest"), grade, nodesForGrade)) : [];
    return dailyCardFor({ grade, words, scienceFacts, spaceFacts: source === "space" ? spaceFacts() : [] });
  }, [grade, today, source]);
  const thought = useMemo(() => thoughtOfTheDay(), [today]);
  return useMemo(() => {
    const list = [];
    if (thought) list.push({ key: "thought", kind: "thought", data: thought });
    if (card?.word) list.push({ key: "word", kind: "word", data: card.word });
    if (card?.fact) list.push({ key: "fact", kind: "fact", data: card.fact, source });
    return list;
  }, [thought, card, source]);
}

export default function HomeHero({ name, streak = 0, stars = 0, grade, onOpenMe, onOpenProgress, faces = null }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const C = isDark ? SCENE.dark : SCENE.light;
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const width = Dimensions.get("window").width;
  const pageW = width - PAD * 2;
  const slides = useDailySlides(grade);
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(null);
  const ref = useRef(null);
  const today = dayNumber();

  useEffect(() => {
    AsyncStorage.getItem(storeKey())
      .then((raw) => setSaved(pruneSaved(JSON.parse(raw || "null"), today)))
      .catch(() => setSaved(pruneSaved(null, today)));
  }, [today]);
  useEffect(() => () => Speech.stop(), []);

  // Move on by itself every 30 s, only until the child touches the cards (owner 16 Nov), never with Remove animations.
  useEffect(() => {
    if (touched || reduceMotion || slides.length < 2) return undefined;
    const t = setInterval(() => {
      setIndex((i) => {
        const n = (i + 1) % slides.length;
        ref.current?.scrollTo({ x: n * pageW, animated: true });
        return n;
      });
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [touched, reduceMotion, slides.length, pageW]);

  const hear = (text) => {
    setTouched(true);
    Speech.stop();
    Speech.speak(text, { language: "en-IN", rate: 0.85 });
  };
  const tapWord = (answer, word) => {
    setTouched(true);
    const next = recordTap(saved, today, "word", answer, word);
    setSaved(next);
    AsyncStorage.setItem(storeKey(), JSON.stringify(next)).catch(() => {});
  };
  const mine = saved?.taps?.[today] || {};
  const s = styles;

  return (
    <View style={[s.hero, { paddingTop: insets.top + 14, marginTop: -(insets.top + 14) }]}>
      {/* The picture: sky, sun (moon at night), two soft hills; fades into the page at the bottom. */}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 375 440" preserveAspectRatio="xMidYMax slice" pointerEvents="none">
        <Rect width="375" height="440" fill={C.sky} />
        <Circle cx="300" cy="150" r="58" fill={C.sun} opacity={0.25} />
        <Circle cx="300" cy="150" r="36" fill={C.sun} />
        <Path d="M0 300 C70 268 140 284 200 302 S320 324 375 292 V440 H0Z" fill={C.hill1} />
        <Path d="M0 336 C90 312 170 330 240 342 S330 350 375 336 V440 H0Z" fill={C.hill2} />
      </Svg>
      <LinearGradient pointerEvents="none" colors={["transparent", P.bg]} style={s.fade} />

      <View style={s.topRow}>
        <Pressable onPress={onOpenMe} accessibilityRole="button" accessibilityLabel="Open Me" hitSlop={6} style={[s.face, { backgroundColor: P.streakBg, borderColor: isDark ? P.border : "#FFFFFF" }]}>
          <Text style={[s.faceText, { color: P.streakText }]}>{(name || "?").trim().charAt(0).toUpperCase()}</Text>
        </Pressable>
        <Pressable onPress={onOpenProgress} accessibilityRole="button" accessibilityLabel={`${streak} day streak, ${stars} stars. Open Progress`} hitSlop={6} style={[s.pill, { backgroundColor: C.glass }]}>
          <Ionicons name="flame" size={14} color="#E07B2E" />
          <Text style={[s.pillText, { color: C.ink }]}>{streak}</Text>
          <View style={[s.pillLine, { backgroundColor: isDark ? P.border : "#D8C6DA" }]} />
          <Ionicons name="star" size={14} color={P.gold} />
          <Text style={[s.pillText, { color: C.ink }]}>{Number(stars).toLocaleString("en-IN")}</Text>
        </Pressable>
      </View>

      <Text style={[s.date, { color: C.label }]}>{heroDate()}</Text>
      <Text style={[s.hello, { color: C.soft }]}>{greeting()},</Text>
      <Text style={[s.name, { color: C.ink }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {name || "friend"}
      </Text>

      {faces?.length ? (
        <View style={{ gap: 8, marginTop: 6 }}>
          <Text style={[s.label, { color: C.label }]}>WHO'S LEARNING?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {faces.map((f) => (
              <Pressable key={f.key} onPress={f.onPress} accessibilityRole="button" accessibilityLabel={f.a11y || f.label} style={s.faceItem}>
                <View style={[s.bigFace, f.add ? { borderWidth: 2, borderStyle: "dashed", borderColor: C.label, backgroundColor: "transparent" } : { backgroundColor: f.active ? P.selectedBg : C.glass, borderWidth: f.active ? 3 : 0, borderColor: P.selectedBorder }]}>
                  {f.add ? <Ionicons name="add" size={22} color={C.label} /> : <Text style={[s.bigFaceText, { color: C.ink }]}>{f.initial}</Text>}
                </View>
                <Text style={[s.faceLabel, { color: C.ink }]} numberOfLines={1}>{f.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {slides.length ? (
        <View style={{ marginTop: 14 }}>
          <ScrollView
            ref={ref}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={() => setTouched(true)}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / pageW))}
            style={{ width: pageW }}
          >
            {slides.map((sl) => (
              <View key={sl.key} style={{ width: pageW, paddingRight: 8, gap: 8 }}>
                {sl.kind === "thought" ? (
                  <>
                    <Text style={[s.label, { color: C.label }]}>THOUGHT OF THE DAY</Text>
                    <Text style={[s.quote, { color: C.ink }]}>{sl.data}</Text>
                  </>
                ) : sl.kind === "word" ? (
                  <>
                    <Text style={[s.label, { color: C.label }]}>WORD OF THE DAY</Text>
                    <Text style={[s.word, { color: C.ink }]} numberOfLines={1} adjustsFontSizeToFit>{sl.data.word}</Text>
                    <Text style={[s.body, { color: C.soft }]} numberOfLines={3}>{sl.data.meaning}</Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {[["knew", "I knew it"], ["new", "New for me"]].map(([k, label]) => (
                        <Pressable key={k} onPress={() => tapWord(k, sl.data)} accessibilityRole="button" accessibilityState={{ selected: mine.word === k }} hitSlop={6} style={[s.smallChip, { backgroundColor: mine.word === k ? P.selectedBg : C.glass }]}>
                          <Text style={[s.smallChipText, { color: mine.word === k ? P.selectedText : C.ink }]}>{label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={[s.label, { color: C.label }]}>{sl.source === "space" ? "SPACE FACT" : "SCIENCE FACT"}</Text>
                    {sl.data.title ? <Text style={[s.factTitle, { color: C.ink }]} numberOfLines={2}>{sl.data.title}</Text> : null}
                    <Text style={[s.body, { color: C.soft }]} numberOfLines={4}>{sl.data.text}</Text>
                  </>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={s.dotsRow}>
            <Pressable
              onPress={() => {
                const sl = slides[index];
                if (!sl) return;
                hear(sl.kind === "thought" ? sl.data : sl.kind === "word" ? `${sl.data.word}. It means: ${sl.data.meaning}` : `${sl.data.title ? sl.data.title + ". " : ""}${sl.data.text}`);
              }}
              accessibilityRole="button"
              accessibilityLabel="Listen"
              style={[s.listen, { backgroundColor: C.glass }]}
            >
              <Ionicons name="volume-high-outline" size={20} color={C.ink} />
            </Pressable>
            <View style={{ flexDirection: "row", gap: 6 }} accessibilityLabel={`Card ${index + 1} of ${slides.length}. Swipe for more.`}>
              {slides.map((sl, i) => (
                <View key={sl.key} style={[s.dot, { width: i === index ? 18 : 6, backgroundColor: i === index ? C.ink : C.label, opacity: i === index ? 1 : 0.45 }]} />
              ))}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: -PAD, paddingHorizontal: PAD, paddingBottom: 34, overflow: "hidden" },
  fade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 90 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  face: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  faceText: { fontSize: 18, fontFamily: "nunitoBold" },
  pill: { height: 36, paddingHorizontal: 12, borderRadius: 18, flexDirection: "row", alignItems: "center", gap: 5 },
  pillText: { fontSize: 14, fontFamily: "nunitoBold" },
  pillLine: { width: 1, height: 14, marginHorizontal: 4 },
  date: { marginTop: 16, fontSize: 12, fontFamily: "nunitoBold", letterSpacing: 1.2 },
  hello: { marginTop: 6, fontSize: 16, fontFamily: "nunitoBold" },
  name: { fontSize: 32, lineHeight: 38, fontFamily: "nunitoBold" },
  label: { fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 1.4 },
  quote: { fontSize: 23, lineHeight: 31, fontFamily: "serif", fontStyle: "italic" },
  word: { fontSize: 28, fontFamily: "nunitoBold" },
  factTitle: { fontSize: 19, fontFamily: "nunitoBold", lineHeight: 25 },
  body: { fontSize: 15, lineHeight: 21, fontFamily: "nunito" },
  smallChip: { height: 34, paddingHorizontal: 12, borderRadius: 17, justifyContent: "center" },
  smallChipText: { fontSize: 13, fontFamily: "nunitoBold" },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12 },
  listen: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  dot: { height: 6, borderRadius: 3 },
  faceItem: { alignItems: "center", gap: 6, width: 64 },
  bigFace: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  bigFaceText: { fontSize: 20, fontFamily: "nunitoBold" },
  faceLabel: { fontSize: 13, fontFamily: "nunitoBold", maxWidth: 64 },
});
