// components/learn/LearnCards.js: bite-size Learn cards (spec R, mockup R1–R5, owner OK 2026-11-05).
// One idea per card, a one-tap check every few cards, Treasure Words flip cards, and a last card that sums up and opens
// the quiz. Calm colours: dim note tints on the dark theme, soft pastels on the light one (owner: nothing bright may jump
// out of the dark theme). Main button at the bottom (thumb zone). Shown by Apprec8Reader when the page has `cards`.

import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import * as Speech from "expo-speech";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { quizPalette } from "../quiz/quizPalette";
import { checkOptions, cardSpeech, allSeen } from "../../utils/learnCards";
import ReportStudyButton from "../quiz/ReportStudyButton";

const TINTS = {
  dark: { idea: ["#3A3322", "#21332A", "#2B2640", "#33262B"], check: "#3A2631", word: "#21332A", done: "#2B2640", ink: "#F4EDF5", soft: "#CFC3D1" },
  light: { idea: ["#FFF3B8", "#DDF5E5", "#E9E2FF", "#FFE6D6"], check: "#FFE0EC", word: "#DDF5E5", done: "#E9E2FF", ink: "#2B2112", soft: "#5A4A3A" },
};

/**
 * @param {object} props
 * @param {Array} props.cards - from learnCards(doc)
 * @param {string} props.title - page name (top left)
 * @param {string} props.cardKey - stable key (content id) for option order
 * @param {boolean} props.isDark
 * @param {string} props.finishLabel - last button ("TRY 8 QUESTIONS ▶", or "DONE" outside a quest)
 * @param {(info: {allSeen: boolean}) => void} props.onFinish - last button or "Skip to quiz"
 * @param {boolean} [props.canSkip] - show "Skip to quiz" (a quest step with a quiz after it)
 * @param {() => void} props.onShowPage - "See all on one page" (the old long page)
 */
export default function LearnCards({ cards, title, cardKey = "", questContext = null, isDark, finishLabel, onFinish, canSkip = false, onShowPage }) {
  const P = quizPalette(isDark);
  const T = isDark ? TINTS.dark : TINTS.light;
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, T, insets), [P, T, insets]);

  const total = cards.length; // the summary card comes after these
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(() => new Set([0]));
  const [flipped, setFlipped] = useState({}); // word cards turned over
  const [picked, setPicked] = useState({}); // check cards: index → chosen option
  const onSummary = index === total;
  const card = onSummary ? null : cards[index];

  useEffect(() => {
    setSeen((prev) => (prev.has(index) ? prev : new Set([...prev, index])));
    Speech.stop();
  }, [index]);
  useEffect(() => () => Speech.stop(), []);

  const speak = () => {
    Speech.stop();
    const text = onSummary ? `You learned: ${summary.join(". ")}` : cardSpeech(card);
    if (text) {
      const isHindi = /[\u0900-\u097F]/.test(text);
      Speech.speak(text, { language: isHindi ? "hi-IN" : "en-IN", rate: isHindi ? 0.85 : 0.9 });
    }
  };
  const finish = () => onFinish({ allSeen: allSeen(seen, total) });

  const ideaTitles = cards.filter((c) => c.kind === "idea").map((c) => c.title);
  const summary = (ideaTitles.length ? ideaTitles : cards.filter((c) => c.kind === "word").map((c) => c.word)).slice(0, 5);
  const ideaNo = cards.slice(0, index + 1).filter((c) => c.kind === "idea").length;
  const tint = onSummary ? T.done : card.kind === "check" ? T.check : card.kind === "word" ? T.word : T.idea[(ideaNo - 1) % T.idea.length];
  const tilt = onSummary ? "0.6deg" : index % 2 ? "1deg" : "-1deg";

  let body = null;
  if (onSummary) {
    body = (
      <>
        <Text style={s.emoji}>🌟</Text>
        <Text style={s.cardTitle}>You learned {summary.length} {summary.length === 1 ? "thing" : "things"}</Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {summary.map((t) => (
            <Text key={t} style={s.text}>✓ {t}</Text>
          ))}
        </View>
      </>
    );
  } else if (card.kind === "idea") {
    body = (
      <>
        {card.emoji ? <Text style={s.emoji}>{card.emoji}</Text> : null}
        <Text style={s.cardTitle}>{card.title}</Text>
        {card.image ? <Image source={{ uri: card.image }} style={s.image} contentFit="contain" accessibilityIgnoresInvertColors /> : null}
        <Text style={[s.text, { marginTop: 8 }]}>{card.text}</Text>
        {card.examples.length ? (
          <View style={{ gap: 8, marginTop: 14 }}>
            {card.examples.map((e) => (
              <Text key={e} style={s.example}>{e}</Text>
            ))}
          </View>
        ) : null}
      </>
    );
  } else if (card.kind === "word") {
    const open = !!flipped[index];
    body = (
      <Pressable onPress={() => setFlipped((f) => ({ ...f, [index]: !open }))} accessibilityRole="button" accessibilityLabel={open ? `${card.word}: ${card.meaning}` : `${card.word}. Tap to see the meaning`}>
        <Text style={s.kicker}>TREASURE WORD 💎</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 }}>
          {card.emoji ? <Text style={{ fontSize: 34 }}>{card.emoji}</Text> : null}
          <Text style={s.word}>{card.word}</Text>
        </View>
        <View style={s.rule} />
        {open ? (
          <>
            <Text style={s.text}>{card.meaning}</Text>
            {card.example ? <Text style={[s.soft, { marginTop: 8 }]}>"{card.example}"</Text> : null}
            {card.opposite ? <Text style={[s.soft, { marginTop: 8 }]}>Opposite: {card.opposite}</Text> : null}
            <Text style={[s.hint, { marginTop: 14 }]}>↻ Tap to hide the meaning</Text>
          </>
        ) : (
          <Text style={[s.hint, { marginVertical: 18 }]}>Do you know it? Tap the card to see the meaning</Text>
        )}
      </Pressable>
    );
  } else {
    const options = checkOptions(card, cardKey);
    const chosen = picked[index];
    const grid = options.every((o) => o.length <= 14) && options.length === 4;
    body = (
      <>
        <Text style={s.kicker}>QUICK CHECK ✋</Text>
        <Text style={[s.cardTitle, { fontSize: 22, lineHeight: 29 }]}>{card.question}</Text>
        <View style={[grid ? s.grid : { gap: 10 }, { marginTop: 14 }]}>
          {options.map((o) => {
            const isAnswer = o === card.answer;
            const show = chosen != null && (isAnswer || o === chosen);
            return (
              <Pressable
                key={o}
                disabled={chosen != null}
                onPress={() => setPicked((p) => ({ ...p, [index]: o }))}
                style={[s.option, grid && s.optionGrid, show && (isAnswer ? s.optionRight : s.optionWrong)]}
                accessibilityRole="button"
              >
                <Text style={[s.optionText, grid && { textAlign: "center" }]}>{o}{show ? (isAnswer ? " ✓" : " ✗") : ""}</Text>
              </Pressable>
            );
          })}
        </View>
        {chosen != null ? (
          <Text style={[s.text, { marginTop: 12, fontSize: 16 }]}>
            {chosen === card.answer ? "Yes! 🎉 " : `It's "${card.answer}". `}
            {card.explain || ""}
          </Text>
        ) : (
          <Text style={[s.hint, { marginTop: 12 }]}>Just a check: no stars lost here.</Text>
        )}
      </>
    );
  }

  const last = onSummary;
  return (
    <View style={s.screen}>
      <View style={s.top}>
        <Text style={s.topTitle} numberOfLines={1}>{title}</Text>
        <ReportStudyButton
          contentId={cardKey}
          cardIndex={onSummary ? "summary" : index}
          cardTitle={onSummary ? "Summary" : card?.title || card?.word || card?.question || `Card ${index + 1}`}
          cardText={onSummary ? summary.join(". ") : card?.text || card?.meaning || card?.question || ""}
          questContext={questContext}
          color={P.textSoft}
        />
        {canSkip && !last ? (
          <Pressable onPress={finish} hitSlop={10} accessibilityRole="button">
            <Text style={s.skip}>Skip to quiz ›</Text>
          </Pressable>
        ) : (
          <Text style={s.count}>{Math.min(index + 1, total)} / {total}</Text>
        )}
      </View>
      {total <= 12 ? (
        <View style={s.dots}>
          {Array.from({ length: total + 1 }, (_, i) => (
            <View key={i} style={[s.dot, i === index && s.dotNow, i < index && s.dotDone]} />
          ))}
        </View>
      ) : (
        <View style={s.track}><View style={[s.fill, { width: `${Math.round((index / total) * 100)}%` }]} /></View>
      )}
      <ScrollView contentContainerStyle={s.middle}>
        <View style={[s.note, { backgroundColor: tint, transform: [{ rotate: tilt }] }]}>
          <View style={s.tape} />
          <Pressable style={s.speaker} onPress={speak} accessibilityLabel="Read aloud" hitSlop={6}>
            <Text style={{ fontSize: 20 }}>🔊</Text>
          </Pressable>
          {body}
        </View>
        {last ? (
          <View style={{ alignItems: "center", gap: 14, marginTop: 18 }}>
            <Pressable onPress={() => setIndex(0)} accessibilityRole="button"><Text style={s.link}>Read the cards again</Text></Pressable>
            <Pressable onPress={onShowPage} accessibilityRole="button"><Text style={s.link}>See everything on one page</Text></Pressable>
          </View>
        ) : index === 0 ? (
          <Pressable onPress={onShowPage} style={{ alignSelf: "center", marginTop: 18 }} accessibilityRole="button">
            <Text style={s.link}>See everything on one page</Text>
          </Pressable>
        ) : null}
      </ScrollView>
      <View style={s.footer}>
        {!last || index > 0 ? (
          <Pressable style={s.square} disabled={index === 0} onPress={() => setIndex((i) => Math.max(0, i - 1))} accessibilityLabel="Previous card">
            <Text style={[s.squareText, index === 0 && { color: P.dimText }]}>‹</Text>
          </Pressable>
        ) : null}
        <Pressable style={s.primary} onPress={last ? finish : () => setIndex((i) => i + 1)} accessibilityRole="button">
          <Text style={s.primaryText}>{last ? finishLabel : "NEXT"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (P, T, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg, paddingTop: insets.top },
    top: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 18, paddingTop: 14 },
    topTitle: { flex: 1, fontSize: 15, fontWeight: "800", color: P.textSoft },
    count: { fontSize: 14, fontWeight: "800", color: P.dimText },
    skip: { fontSize: 14, fontWeight: "800", color: P.label },
    dots: { flexDirection: "row", gap: 6, paddingHorizontal: 18, paddingTop: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: P.border },
    dotNow: { width: 18, backgroundColor: P.selectedBorder },
    dotDone: { backgroundColor: P.selectedBorder },
    track: { height: 6, borderRadius: 3, backgroundColor: P.track, marginHorizontal: 18, marginTop: 12, overflow: "hidden" },
    fill: { height: 6, backgroundColor: P.primary },
    middle: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 26 },
    note: { borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 6, borderBottomRightRadius: 22, padding: 22, paddingTop: 30, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
    tape: { position: "absolute", top: -10, alignSelf: "center", width: 88, height: 22, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.12)" },
    speaker: { position: "absolute", top: 10, right: 10, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(127,127,127,0.15)" },
    emoji: { fontSize: 42, lineHeight: 50 },
    kicker: { fontSize: 13, fontWeight: "900", letterSpacing: 1, color: T.soft },
    cardTitle: { fontSize: 26, lineHeight: 32, fontWeight: "900", color: T.ink, marginTop: 4, paddingRight: 40 },
    text: { fontSize: 18, lineHeight: 26, fontWeight: "700", color: T.ink },
    soft: { fontSize: 16, lineHeight: 23, fontWeight: "700", color: T.soft },
    hint: { fontSize: 14, fontWeight: "800", color: T.soft, textAlign: "center" },
    example: { alignSelf: "flex-start", fontSize: 19, fontWeight: "900", color: T.ink, backgroundColor: "rgba(127,127,127,0.14)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, overflow: "hidden" },
    word: { fontSize: 32, fontWeight: "900", color: T.ink, flexShrink: 1 },
    rule: { height: 2, backgroundColor: "rgba(127,127,127,0.2)", marginVertical: 12 },
    image: { width: "100%", height: 160, marginTop: 10, borderRadius: 12 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    option: { minHeight: 52, borderRadius: 14, borderWidth: 2, borderColor: "rgba(127,127,127,0.3)", backgroundColor: "rgba(127,127,127,0.08)", justifyContent: "center", paddingHorizontal: 14, paddingVertical: 8 },
    optionGrid: { width: "47%", flexGrow: 1, alignItems: "center" },
    optionRight: { borderColor: P.correctBorder, backgroundColor: P.correctBg },
    optionWrong: { borderColor: P.wrongBorder, backgroundColor: P.wrongBg },
    optionText: { fontSize: 18, fontWeight: "900", color: T.ink },
    link: { fontSize: 14, fontWeight: "800", color: P.textSoft, textDecorationLine: "underline" },
    footer: { flexDirection: "row", gap: 10, paddingHorizontal: 18, paddingTop: 8, paddingBottom: Math.max(14, insets.bottom + 8) },
    square: { width: 58, height: 58, borderRadius: 18, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    squareText: { fontSize: 22, fontWeight: "800", color: P.textSoft },
    primary: { flex: 1, height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center" },
    primaryText: { color: P.onPrimary, fontSize: 18, fontWeight: "800", letterSpacing: 1 },
  });
