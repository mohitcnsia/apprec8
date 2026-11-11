// components/home/DailyWordFactCard.js: "Word of the day" and "Science / Space fact" on the kid's Home (owner + Seema,
// 2026-11-11). Two separate cards (owner, 2026-11-12: subjects must not be clubbed), each closed with its own Close
// button next to its other buttons (thumb reach), until tomorrow. Science facts have "Learn more ›" = that topic.
// Content is bundled (0 database reads): Treasure Words, Science Learn cards (Classes 3–5), Space facts (6–10).
// Taps ("I knew it" / "New for me") stay on this phone; "new" words are kept for later review.
import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { bundledQuest } from "../../data/quests";
import { nodesForGrade } from "../../utils/gradeFilter";
import { dailyCardFor, dayNumber, learnCardsFor, toWords, toScienceFacts, toSpaceFacts, factSourceFor, pruneSaved, recordTap } from "../../utils/dailyCard";
import spaceData from "../../data/space_olympiad_data.json";

const storeKey = () => `dailyCard.v1.${authInstance.currentUser?.uid || "guest"}`;
let spaceFactsCache = null;
const spaceFacts = () => (spaceFactsCache ||= toSpaceFacts(spaceData));

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

export default function DailyWordFactCard({ grade }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const navigation = useNavigation();
  const [saved, setSaved] = useState(undefined); // undefined = loading

  const today = dayNumber();
  const source = factSourceFor(grade);
  const card = useMemo(() => {
    if (!Number.isInteger(grade)) return null;
    const words = toWords(learnCardsFor(bundledQuest("word-bank"), grade, nodesForGrade));
    const scienceFacts = source === "science" ? toScienceFacts(learnCardsFor(bundledQuest("science-quest"), grade, nodesForGrade)) : [];
    return dailyCardFor({ grade, words, scienceFacts, spaceFacts: source === "space" ? spaceFacts() : [] });
  }, [grade, today, source]);

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

  if (!card || saved === undefined) return null;

  const persist = (next) => {
    setSaved(next);
    AsyncStorage.setItem(storeKey(), JSON.stringify(next)).catch(() => {});
  };
  const tap = (which, answer) => persist(recordTap(saved, today, which, answer, which === "word" ? card.word : null));
  const hear = (text) => {
    Speech.stop();
    Speech.speak(text, { language: "en-IN", rate: 0.85 });
  };
  const mine = saved.taps[today] || {};
  const { word, fact } = card;
  const showWord = word && saved.closedDay !== today;
  const showFact = fact && saved.closedFactDay !== today;
  if (!showWord && !showFact) return null;

  return (
    <View style={{ gap: 12 }}>
      {showWord ? (
        <View style={styles.card} accessibilityLabel="Word of the day">
          <Text style={styles.label}>WORD OF THE DAY · ENGLISH</Text>
          <View style={styles.row}>
            <Text style={styles.word} numberOfLines={1}>
              {word.emoji ? `${word.emoji} ` : ""}
              {word.word}
            </Text>
            <Pressable onPress={() => hear(`${word.word}. It means: ${word.meaning}`)} style={styles.hear} accessibilityRole="button" accessibilityLabel={`Hear the word ${word.word}`} hitSlop={6}>
              <Text style={styles.hearText}>🔊 Hear</Text>
            </Pressable>
          </View>
          <Text style={styles.body}>{word.meaning}</Text>
          <View style={styles.choices}>
            <Chip label="I knew it" on={mine.word === "knew"} onPress={() => tap("word", "knew")} styles={styles} />
            <Chip label="New for me" on={mine.word === "new"} onPress={() => tap("word", "new")} styles={styles} />
            <Chip label="Close" quiet onPress={() => (Speech.stop(), persist({ ...saved, closedDay: today }))} styles={styles} />
          </View>
          {mine.word ? <Text style={styles.cheer}>{mine.word === "new" ? "Nice! A new word for you." : "Great, you knew it!"}</Text> : null}
        </View>
      ) : null}

      {showFact ? (
        <View style={styles.card} accessibilityLabel={source === "space" ? "Space fact" : "Science fact"}>
          <Text style={styles.label}>{source === "space" ? "SPACE FACT" : "SCIENCE FACT"}</Text>
          <View style={styles.factRow}>
            <View style={{ flex: 1, gap: 2 }}>
              {fact.title ? (
                <Text style={styles.factTitle}>
                  {fact.emoji ? `${fact.emoji} ` : ""}
                  {fact.title}
                </Text>
              ) : null}
              <Text style={styles.body}>{fact.text}</Text>
            </View>
            {fact.image ? <Image source={{ uri: fact.image }} style={styles.factImage} accessibilityIgnoresInvertColors /> : null}
          </View>
          {fact.nodeId ? (
            <Pressable
              onPress={() => navigation.navigate("EnglishQuestMap", { questId: "science-quest", openTopic: fact.nodeId })}
              accessibilityRole="button"
              accessibilityLabel={`Learn more about ${fact.title || "this"}`}
              style={styles.more}
            >
              <Text style={styles.moreText}>Learn more about {fact.title || "this"} ›</Text>
            </Pressable>
          ) : null}
          <View style={styles.choices}>
            <Chip label="I knew it" on={mine.fact === "knew"} onPress={() => tap("fact", "knew")} styles={styles} />
            <Chip label="New for me" on={mine.fact === "new"} onPress={() => tap("fact", "new")} styles={styles} />
            <Chip label="Close" quiet onPress={() => persist({ ...saved, closedFactDay: today })} styles={styles} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 16, borderRadius: 20, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 6 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
    label: { fontSize: 13, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label },
    word: { flex: 1, fontSize: 22, fontFamily: "nunitoBold", color: P.text },
    hear: { paddingHorizontal: 12, minHeight: 36, justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: P.border },
    hearText: { fontSize: 14, fontFamily: "nunitoBold", color: P.text },
    body: { fontSize: 15, fontFamily: "nunito", color: P.text, lineHeight: 21 },
    choices: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
    chip: { paddingHorizontal: 14, minHeight: 40, justifyContent: "center", borderRadius: 20, borderWidth: 1.5, borderColor: P.border },
    chipOn: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    chipQuiet: { borderColor: "transparent" },
    chipText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    chipTextOn: { color: P.selectedText },
    cheer: { fontSize: 13, fontFamily: "nunitoBold", color: P.label },
    factRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    factTitle: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    factImage: { width: 64, height: 64, borderRadius: 12 },
    more: { minHeight: 40, justifyContent: "center" },
    moreText: { fontSize: 15, fontFamily: "nunitoBold", color: P.label },
  });
