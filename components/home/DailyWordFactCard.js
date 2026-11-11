// components/home/DailyWordFactCard.js: "Word and fact of the day" on the kid's Home (owner + Seema, 2026-11-11).
// Small and quiet, under the kid's main card (START stays the one loud thing). × hides it until tomorrow.
// Content is bundled (0 database reads): Treasure Words, Science Learn cards (Classes 3–5), Space facts (6–10).
// Taps ("I knew it" / "New for me") stay on this phone for now; "new" words are kept for My words (Me redesign).
import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
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

function Choice({ label, on, onPress, styles }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, on && styles.chipOn]}
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
  const [saved, setSaved] = useState(undefined); // undefined = loading

  const today = dayNumber();
  const card = useMemo(() => {
    if (!Number.isInteger(grade)) return null;
    const words = toWords(learnCardsFor(bundledQuest("word-bank"), grade, nodesForGrade));
    const source = factSourceFor(grade);
    const scienceFacts = source === "science" ? toScienceFacts(learnCardsFor(bundledQuest("science-quest"), grade, nodesForGrade)) : [];
    return dailyCardFor({ grade, words, scienceFacts, spaceFacts: source === "space" ? spaceFacts() : [] });
  }, [grade, today]);

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

  if (!card?.word || saved === undefined || saved.closedDay === today) return null;

  const persist = (next) => {
    setSaved(next);
    AsyncStorage.setItem(storeKey(), JSON.stringify(next)).catch(() => {});
  };
  const tap = (which, answer) => persist(recordTap(saved, today, which, answer, which === "word" ? card.word : null));
  const close = () => {
    Speech.stop();
    persist({ ...saved, closedDay: today });
  };
  const hear = () => {
    Speech.stop();
    Speech.speak(card.word.word, { language: "en-IN", rate: 0.75 });
    Speech.speak(`It means: ${card.word.meaning}`, { language: "en-IN", rate: 0.9 });
  };
  const mine = saved.taps[today] || {};
  const { word, fact } = card;

  return (
    <View style={styles.card} accessibilityLabel="Word and fact of the day">
      <View style={styles.row}>
        <Text style={styles.label}>WORD OF THE DAY</Text>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close until tomorrow">
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Text style={styles.word} numberOfLines={1}>
          {word.emoji ? `${word.emoji} ` : ""}
          {word.word}
        </Text>
        <Pressable onPress={hear} style={styles.hear} accessibilityRole="button" accessibilityLabel={`Hear the word ${word.word}`} hitSlop={6}>
          <Text style={styles.hearText}>🔊 Hear</Text>
        </Pressable>
      </View>
      <Text style={styles.body}>{word.meaning}</Text>
      <View style={styles.choices}>
        <Choice label="I knew it" on={mine.word === "knew"} onPress={() => tap("word", "knew")} styles={styles} />
        <Choice label="New for me" on={mine.word === "new"} onPress={() => tap("word", "new")} styles={styles} />
      </View>
      {mine.word ? <Text style={styles.cheer}>{mine.word === "new" ? "Nice! A new word for your collection." : "Great, you knew it!"}</Text> : null}

      {fact ? (
        <>
          <View style={styles.divider} />
          <Text style={styles.label}>{factSourceFor(grade) === "space" ? "SPACE FACT" : "SCIENCE FACT"}</Text>
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
          <View style={styles.choices}>
            <Choice label="I knew it" on={mine.fact === "knew"} onPress={() => tap("fact", "knew")} styles={styles} />
            <Choice label="New for me" on={mine.fact === "new"} onPress={() => tap("fact", "new")} styles={styles} />
          </View>
        </>
      ) : null}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 16, borderRadius: 20, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 6 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
    label: { fontSize: 13, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label },
    close: { fontSize: 18, color: P.textSoft, paddingHorizontal: 4 },
    word: { flex: 1, fontSize: 22, fontFamily: "nunitoBold", color: P.text },
    hear: { paddingHorizontal: 12, minHeight: 36, justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: P.border },
    hearText: { fontSize: 14, fontFamily: "nunitoBold", color: P.text },
    body: { fontSize: 15, fontFamily: "nunito", color: P.text, lineHeight: 21 },
    choices: { flexDirection: "row", gap: 10, marginTop: 4 },
    chip: { paddingHorizontal: 14, minHeight: 40, justifyContent: "center", borderRadius: 20, borderWidth: 1.5, borderColor: P.border },
    chipOn: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    chipText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    chipTextOn: { color: P.selectedText },
    cheer: { fontSize: 13, fontFamily: "nunitoBold", color: P.label },
    divider: { height: 1, backgroundColor: P.border, marginVertical: 8 },
    factRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    factTitle: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    factImage: { width: 64, height: 64, borderRadius: 12 },
  });
