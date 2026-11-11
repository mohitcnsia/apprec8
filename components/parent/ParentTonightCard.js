// components/parent/ParentTonightCard.js: a parent's card per child on Home, "tonight" (redesign doc, 2026-11-11).
// Practised today or not → 5 questions to ask at home, one at a time, answer behind "See answer", Right / Needs help →
// "Tell <name> one thing they did well" with a ready line → "I praised <name>". The action happens at home.
// Reads the same progress docs as the parent's Progress card (services/progressCache: fresh twice a day, 0 extra reads).
// Taps stay on this phone for now (owner totals come with the owner's weekly screen).
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadProgress, peekProgress } from "../../services/progressCache";
import { authInstance } from "../../config/firebaseConfig";
import { QUESTS } from "../../data/quests";
import { nodesForGrade } from "../../utils/gradeFilter";
import { isTileVisible } from "../../utils/courseVisibility";
import { topicNamer } from "../../utils/progressView";
import { talkQuestions } from "../../utils/parentWeek";
import { dayNumber } from "../../utils/dailyCard";
import { practisedToday, daysThisWeek, praiseLine, recordAnswer, recordPraise, tonightProgress, prune } from "../../utils/tonight";

const storeKey = () => `tonight.v1.${authInstance.currentUser?.uid || "guest"}`;

export default function ParentTonightCard({ child, P }) {
  const s = useMemo(() => makeStyles(P), [P]);
  const name = child.firstName || "your child";
  const mine = useMemo(
    () => QUESTS.filter((m) => !m.quest?.draft && isTileVisible(m.quest, child) && nodesForGrade(m.nodes, child.grade).some((n) => n.kind === "main")),
    [child]
  );
  const shape = (m, d) => ({ questId: m.QUEST_ID, stats: d?.stats || {}, mistakes: d?.mistakes || {}, quizzes: m.quizzes, questNodes: m.nodes, namer: topicNamer(m.nodes) });
  const [quests, setQuests] = useState(() => (mine.every((m) => peekProgress(child.uid, m.QUEST_ID) !== undefined) ? mine.map((m) => shape(m, peekProgress(child.uid, m.QUEST_ID))) : null));
  const [saved, setSaved] = useState(undefined);
  const [showAnswer, setShowAnswer] = useState(false);
  const [justDone, setJustDone] = useState(false); // the thank-you shows once, then the card is gone until tomorrow
  const today = dayNumber();

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      Promise.all(mine.map((m) => loadProgress(child.uid, m.QUEST_ID).then((d) => shape(m, d)).catch(() => null))).then((out) => alive && setQuests(out.filter(Boolean)));
      return () => {
        alive = false;
      };
    }, [child.uid, mine])
  );
  useEffect(() => {
    AsyncStorage.getItem(storeKey())
      .then((raw) => setSaved(prune(JSON.parse(raw || "null"), today)))
      .catch(() => setSaved({}));
  }, [today]);

  useEffect(() => {
    if (!justDone) return undefined;
    const t = setTimeout(() => setJustDone(false), 6000); // thank-you for 6 s, then the card leaves Home for today
    return () => clearTimeout(t);
  }, [justDone]);
  const questions = useMemo(() => (quests ? talkQuestions(quests, 5) : []), [quests]);
  if (!quests || saved === undefined) return null;

  const persist = (next) => {
    setSaved(next);
    AsyncStorage.setItem(storeKey(), JSON.stringify(next)).catch(() => {});
  };
  const did = practisedToday(quests);
  const days = daysThisWeek(quests);
  const prog = tonightProgress(saved, today, child.uid, questions);
  const strong = questions.find((q) => q.kind === "strong")?.topic || null;
  const current = typeof prog.step === "number" ? questions[prog.step] : null;
  // Owner, 2026-11-11: once tonight is done, the card goes away for the day (back tomorrow with new questions).
  if (prog.step === "done" && !justDone) return null;

  return (
    <View style={s.card} accessibilityLabel={`${name} tonight`}>
      <View style={s.row}>
        <Text style={s.name}>{name}</Text>
        <Text style={[s.pill, did ? s.pillOn : null]}>{did ? "Practised today ✓" : "Not yet today"}</Text>
      </View>
      <Text style={s.soft}>
        {days} of 7 days this week{did ? "" : ` · a few minutes tonight helps ${name} most`}
      </Text>

      {current ? (
        <>
          <Text style={s.label}>
            TONIGHT · ASK {name.toUpperCase()} · {prog.step + 1} OF {questions.length}
          </Text>
          <Text style={s.q}>{current.text}</Text>
          {current.topic ? <Text style={s.soft}>{current.kind === "strong" ? `Something ${name} is good at: ${current.topic}` : `Topic: ${current.topic}`}</Text> : null}
          {showAnswer ? (
            <Text style={s.answer}>Answer: {current.answer || "(see the app)"}</Text>
          ) : (
            <Pressable onPress={() => setShowAnswer(true)} accessibilityRole="button" style={s.link}>
              <Text style={s.linkText}>See answer ›</Text>
            </Pressable>
          )}
          <View style={s.buttons}>
            <Pressable onPress={() => (setShowAnswer(false), persist(recordAnswer(saved, today, child.uid, current.key, "right")))} accessibilityRole="button" style={[s.btn, s.btnMain]}>
              <Text style={[s.btnText, s.btnTextMain]}>Right ✓</Text>
            </Pressable>
            <Pressable onPress={() => (setShowAnswer(false), persist(recordAnswer(saved, today, child.uid, current.key, "help")))} accessibilityRole="button" style={s.btn}>
              <Text style={s.btnText}>Needs help</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {prog.step === "praise" ? (
        <>
          <Text style={s.label}>NOW, ONE KIND WORD</Text>
          <Text style={s.q}>Tell {name} one thing they did well today.</Text>
          <Text style={s.answer}>{praiseLine(name, strong)}</Text>
          <Pressable onPress={() => (setJustDone(true), persist(recordPraise(saved, today, child.uid)))} accessibilityRole="button" style={[s.btn, s.btnMain]}>
            <Text style={[s.btnText, s.btnTextMain]}>I praised {name}</Text>
          </Pressable>
        </>
      ) : null}

      {prog.step === "done" ? (
        <Text style={s.body}>
          Thank you! {questions.length ? `${prog.right} of ${questions.length} right tonight. ` : ""}Talks like this help {name} more than anything else. 🌟
        </Text>
      ) : null}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 16, borderRadius: 20, backgroundColor: P.card, borderWidth: 1, borderColor: P.selectedBorder, gap: 8 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
    name: { flex: 1, fontSize: 20, fontFamily: "nunitoBold", color: P.text },
    pill: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: P.border },
    pillOn: { color: P.correctText, borderColor: P.correctBorder, backgroundColor: P.correctBg },
    label: { fontSize: 12, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label, marginTop: 6 },
    q: { fontSize: 17, fontFamily: "nunitoBold", color: P.text, lineHeight: 24 },
    answer: { fontSize: 15, fontFamily: "nunito", color: P.text, backgroundColor: P.selectedBg, padding: 10, borderRadius: 12 },
    soft: { fontSize: 13, fontFamily: "nunito", color: P.textSoft },
    body: { fontSize: 15, fontFamily: "nunito", color: P.text, lineHeight: 21 },
    link: { minHeight: 40, justifyContent: "center" },
    linkText: { fontSize: 15, fontFamily: "nunitoBold", color: P.label },
    buttons: { flexDirection: "row", gap: 10 },
    btn: { flex: 1, minHeight: 48, borderRadius: 24, borderWidth: 1.5, borderColor: P.border, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
    btnMain: { backgroundColor: P.primary, borderColor: P.primary },
    btnText: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    btnTextMain: { color: P.onPrimary },
  });
