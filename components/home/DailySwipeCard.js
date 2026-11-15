// components/home/DailySwipeCard.js: Thought/Word/Fact as ONE swipe card on top (G112 Home tidy-up).
// Shows "⭐ Today: N · this week: M" in the header, with a horizontal pager for:
// 1. Thought of the day (inspirational, kid-friendly from data/thoughts.js)
// 2. Word of the day (Treasure Words from bundled word bank with audio)
// 3. Fact of the day (Science or Space fact with image and topic link)
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { bundledQuest } from "../../data/quests";
import { nodesForGrade } from "../../utils/gradeFilter";
import {
  dailyCardFor,
  dayNumber,
  learnCardsFor,
  toWords,
  toScienceFacts,
  toSpaceFacts,
  factSourceFor,
  pruneSaved,
  recordTap,
} from "../../utils/dailyCard";
import spaceData from "../../data/space_olympiad_data.json";
import { THOUGHTS } from "../../data/thoughts";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const storeKey = () => `dailyCard.v1.${authInstance.currentUser?.uid || "guest"}`;
let spaceFactsCache = null;
const spaceFacts = () => (spaceFactsCache ||= toSpaceFacts(spaceData));

export const thoughtOfTheDay = (now = Date.now()) => {
  if (!THOUGHTS || THOUGHTS.length === 0) return "Be kind, be curious, and keep learning!";
  const day = Math.floor(now / (1000 * 60 * 60 * 24));
  return THOUGHTS[day % THOUGHTS.length];
};

function Chip({ label, on, onPress, styles, quiet }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, on && styles.chipOn, quiet && styles.chipQuiet]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      accessibilityLabel={label}
      hitSlop={6}
    >
      <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

export default function DailySwipeCard({ grade, starsToday = 0, starsWeek = 0 }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const navigation = useNavigation();
  const [saved, setSaved] = useState(undefined);
  const [slideIndex, setSlideIndex] = useState(0);
  const flatListRef = useRef(null);

  const today = dayNumber();
  const source = factSourceFor(grade);
  const card = useMemo(() => {
    if (!Number.isInteger(grade)) return null;
    const words = toWords(learnCardsFor(bundledQuest("word-bank"), grade, nodesForGrade));
    const scienceFacts =
      source === "science"
        ? toScienceFacts(learnCardsFor(bundledQuest("science-quest"), grade, nodesForGrade))
        : [];
    return dailyCardFor({
      grade,
      words,
      scienceFacts,
      spaceFacts: source === "space" ? spaceFacts() : [],
    });
  }, [grade, today, source]);

  const thought = useMemo(() => thoughtOfTheDay(), [today]);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(storeKey())
      .then((raw) => alive && setSaved(pruneSaved(JSON.parse(raw || "null"), today)))
      .catch(() => alive && setSaved(pruneSaved(null, today)));
    return () => {
      alive = false;
    };
  }, [today]);

  useEffect(() => () => Speech.stop(), []);

  if (saved === undefined) return null;

  const isClosed = saved?.closedDay === today;

  const persist = (next) => {
    setSaved(next);
    AsyncStorage.setItem(storeKey(), JSON.stringify(next)).catch(() => {});
  };

  const tap = (which, answer) =>
    persist(recordTap(saved, today, which, answer, which === "word" ? card?.word : null));

  const hear = (text) => {
    Speech.stop();
    Speech.speak(text, { language: "en-IN", rate: 0.85 });
  };

  const mine = saved?.taps?.[today] || {};
  const word = card?.word || null;
  const fact = card?.fact || null;

  const slides = useMemo(() => {
    const list = [];
    if (thought) list.push({ key: "thought", kind: "thought", data: thought });
    if (word) list.push({ key: "word", kind: "word", data: word });
    if (fact) list.push({ key: "fact", kind: "fact", data: fact });
    return list;
  }, [thought, word, fact]);

  const goToSlide = (idx) => {
    if (idx < 0 || idx >= slides.length) return;
    setSlideIndex(idx);
    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* ⭐ Today: N · this week: M summary banner on top */}
      <View style={styles.starsBar} accessibilityLabel={`Today: ${starsToday} stars, this week: ${starsWeek} stars`}>
        <View style={styles.starsBadge}>
          <Text style={styles.starsBadgeText}>⭐</Text>
        </View>
        <Text style={styles.starsText}>
          Today: <Text style={styles.starsBold}>{starsToday}</Text> · this week:{" "}
          <Text style={styles.starsBold}>{starsWeek}</Text>
        </Text>
      </View>

      {!isClosed && slides.length > 0 ? (
        <View style={styles.card} accessibilityLabel="Daily swipe card">
          {/* Header tabs / dot pills */}
          <View style={styles.cardHeader}>
            <View style={styles.pillsRow}>
              {slides.map((s, idx) => {
                const label = s.kind === "thought" ? "Thought" : s.kind === "word" ? "Word" : "Fact";
                const active = slideIndex === idx;
                return (
                  <Pressable
                    key={s.key}
                    onPress={() => goToSlide(idx)}
                    style={[styles.tabPill, active && styles.tabPillActive]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${label} slide`}
                  >
                    <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              onPress={() => {
                Speech.stop();
                persist({ ...saved, closedDay: today });
              }}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close daily cards for today"
              hitSlop={8}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Slide Content */}
          <View style={styles.slideArea}>
            {slides[slideIndex]?.kind === "thought" ? (
              <View style={styles.slideInner}>
                <Text style={styles.label}>✨ THOUGHT OF THE DAY</Text>
                <Text style={styles.thoughtBody}>"{slides[slideIndex].data}"</Text>
                <View style={styles.choicesRow}>
                  <Chip
                    label="Next: Word ›"
                    on={false}
                    onPress={() => goToSlide(1)}
                    styles={styles}
                  />
                </View>
              </View>
            ) : null}

            {slides[slideIndex]?.kind === "word" ? (
              <View style={styles.slideInner}>
                <Text style={styles.label}>WORD OF THE DAY · ENGLISH</Text>
                <View style={styles.wordRow}>
                  <Text style={styles.wordTitle} numberOfLines={1}>
                    {word.emoji ? `${word.emoji} ` : ""}
                    {word.word}
                  </Text>
                  <Pressable
                    onPress={() => hear(`${word.word}. It means: ${word.meaning}`)}
                    style={styles.hear}
                    accessibilityRole="button"
                    accessibilityLabel={`Hear the word ${word.word}`}
                    hitSlop={6}
                  >
                    <Text style={styles.hearText}>🔊 Hear</Text>
                  </Pressable>
                </View>
                <Text style={styles.body}>{word.meaning}</Text>
                <View style={styles.choicesRow}>
                  <Chip
                    label="I knew it"
                    on={mine.word === "knew"}
                    onPress={() => tap("word", "knew")}
                    styles={styles}
                  />
                  <Chip
                    label="New for me"
                    on={mine.word === "new"}
                    onPress={() => tap("word", "new")}
                    styles={styles}
                  />
                  {slides.length > 2 ? (
                    <Chip
                      label="Fact ›"
                      quiet
                      onPress={() => goToSlide(2)}
                      styles={styles}
                    />
                  ) : null}
                </View>
                {mine.word ? (
                  <Text style={styles.cheer}>
                    {mine.word === "new" ? "Nice! A new word for you." : "Great, you knew it!"}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {slides[slideIndex]?.kind === "fact" ? (
              <View style={styles.slideInner}>
                <Text style={styles.label}>{source === "space" ? "SPACE FACT" : "SCIENCE FACT"}</Text>
                <View style={styles.factRow}>
                  <View style={{ flex: 1, gap: 4 }}>
                    {fact.title ? (
                      <Text style={styles.factTitle}>
                        {fact.emoji ? `${fact.emoji} ` : ""}
                        {fact.title}
                      </Text>
                    ) : null}
                    <Text style={styles.body}>{fact.text}</Text>
                  </View>
                  {fact.image ? (
                    <Image
                      source={{ uri: fact.image }}
                      style={styles.factImage}
                      accessibilityIgnoresInvertColors
                    />
                  ) : null}
                </View>
                {fact.nodeId ? (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("EnglishQuestMap", {
                        questId: "science-quest",
                        openTopic: fact.nodeId,
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Learn more about ${fact.title || "this"}`}
                    style={styles.more}
                  >
                    <Text style={styles.moreText}>Learn more about {fact.title || "this"} ›</Text>
                  </Pressable>
                ) : null}
                <View style={styles.choicesRow}>
                  <Chip
                    label="I knew it"
                    on={mine.fact === "knew"}
                    onPress={() => tap("fact", "knew")}
                    styles={styles}
                  />
                  <Chip
                    label="New for me"
                    on={mine.fact === "new"}
                    onPress={() => tap("fact", "new")}
                    styles={styles}
                  />
                </View>
              </View>
            ) : null}
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, slideIndex === i && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    container: { gap: 8, marginVertical: 4 },
    starsBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: P.card,
      borderWidth: 1,
      borderColor: P.border,
    },
    starsBadge: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: P.selectedBg,
      alignItems: "center",
      justifyContent: "center",
    },
    starsBadgeText: { fontSize: 14 },
    starsText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    starsBold: { fontFamily: "nunitoBold", color: P.text },

    card: {
      padding: 16,
      borderRadius: 20,
      backgroundColor: P.card,
      borderWidth: 1.5,
      borderColor: P.border,
      gap: 10,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    pillsRow: { flexDirection: "row", gap: 6 },
    tabPill: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: P.track,
    },
    tabPillActive: { backgroundColor: P.selectedBg, borderWidth: 1, borderColor: P.selectedBorder },
    tabPillText: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft },
    tabPillTextActive: { color: P.selectedText },
    closeBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: P.track,
    },
    closeBtnText: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft },

    slideArea: { minHeight: 120, justifyContent: "center" },
    slideInner: { gap: 8 },
    label: { fontSize: 12, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label },
    thoughtBody: { fontSize: 16, fontFamily: "nunito", color: P.text, lineHeight: 23, fontStyle: "italic" },
    wordRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
    wordTitle: { flex: 1, fontSize: 22, fontFamily: "nunitoBold", color: P.text },
    hear: {
      paddingHorizontal: 12,
      minHeight: 34,
      justifyContent: "center",
      borderRadius: 17,
      borderWidth: 1,
      borderColor: P.border,
    },
    hearText: { fontSize: 13, fontFamily: "nunitoBold", color: P.text },
    body: { fontSize: 15, fontFamily: "nunito", color: P.text, lineHeight: 21 },
    choicesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
    chip: {
      paddingHorizontal: 14,
      minHeight: 38,
      justifyContent: "center",
      borderRadius: 19,
      borderWidth: 1.5,
      borderColor: P.border,
    },
    chipOn: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    chipQuiet: { borderColor: "transparent" },
    chipText: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft },
    chipTextOn: { color: P.selectedText },
    cheer: { fontSize: 13, fontFamily: "nunitoBold", color: P.label },
    factRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    factTitle: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    factImage: { width: 64, height: 64, borderRadius: 12 },
    more: { minHeight: 36, justifyContent: "center" },
    moreText: { fontSize: 14, fontFamily: "nunitoBold", color: P.label },

    dotsRow: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: P.border },
    dotActive: { width: 14, backgroundColor: P.label },
  });

