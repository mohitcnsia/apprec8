// components/parent/ParentWeekCard.js
// A parent's week at a glance for one child (mockups V2/V3, approved 2026-11-05). English / हिंदी switch (saved on
// this phone). Logic: utils/parentWeek.js. Reads: the child's progress docs, at most once per 10 minutes
// (services/progressCache.js; pull down = fresh). Rules: DR-10, parents only.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadProgress, peekProgress, progressReadAt } from "../../services/progressCache";
import { updatedText } from "../../utils/refreshSlots";
import { QUESTS } from "../../data/quests";
import { nodesForGrade } from "../../utils/gradeFilter";
import { isTileVisible } from "../../utils/courseVisibility";
import { topicNamer } from "../../utils/progressView";
import { parentWeek, weekIndexOf, talkQuestions } from "../../utils/parentWeek";

const LANG_KEY = "parentLang:v1";

export function useParentLang() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((v) => v && setLang(v)).catch(() => {});
  }, []);
  const choose = (v) => {
    setLang(v);
    AsyncStorage.setItem(LANG_KEY, v).catch(() => {});
  };
  return [lang, choose];
}

export default function ParentWeekCard({ child, lang, P, refreshTrigger = 0 }) {
  const s = useMemo(() => makeStyles(P), [P]);
  const mine = useMemo(
    () => QUESTS.filter((m) => !m.quest?.draft && isTileVisible(m.quest, child) && nodesForGrade(m.nodes, child.grade).some((n) => n.kind === "main")),
    [child]
  );
  const shape = (m, d) => ({ questId: m.QUEST_ID, title: m.quest?.title || m.QUEST_ID, stats: d?.stats || {}, nodes: d?.nodes || {}, mistakes: d?.mistakes || {}, quizzes: m.quizzes, questNodes: m.nodes, namer: topicNamer(m.nodes) });
  // Draw at once from what was loaded before (switching tabs); fresh from the server only after 7:30 am / 7:30 pm.
  const [quests, setQuests] = useState(() => (mine.every((m) => peekProgress(child.uid, m.QUEST_ID) !== undefined) ? mine.map((m) => shape(m, peekProgress(child.uid, m.QUEST_ID))) : null));
  const [showMissed, setShowMissed] = useState(false);

  const load = useCallback(
    (force = false) => {
      let alive = true;
      // All subjects at once (not one after another).
      Promise.all(mine.map((m) => loadProgress(child.uid, m.QUEST_ID, { force }).then((d) => shape(m, d)).catch(() => null))).then((out) => {
        if (alive) setQuests(out.filter(Boolean)); // not allowed or offline: that subject is skipped
      });
      return () => {
        alive = false;
      };
    },
    [child.uid, mine]
  );

  useFocusEffect(useCallback(() => load(false), [load]));

  useEffect(() => {
    if (refreshTrigger > 0) return load(true); // pull down = fresh numbers
  }, [load, refreshTrigger]);

  if (quests === null) return <ActivityIndicator color={P.label} />;
  const w = parentWeek({ name: child.firstName || "Your child", grade: child.grade, quests, lang, weekIndex: weekIndexOf() });
  const t = w.words;
  const missed = talkQuestions(quests, 5);
  // Oldest read among the subjects shown, so "Updated" never claims newer than it is.
  const readTimes = mine.map((m) => progressReadAt(child.uid, m.QUEST_ID)).filter(Number.isFinite);
  const updated = readTimes.length ? updatedText(Math.min(...readTimes), Date.now(), lang) : "";

  return (
    <View style={s.wrap}>
      <Text style={s.h}>{w.title}</Text>
      <View style={s.card}>
        <Text style={s.label}>{t.thisWeek} · {w.rangeText}</Text>
        {updated ? <Text style={s.small}>{updated}</Text> : null}
        <Text style={s.big}>{w.timeText}</Text>
        {w.deltaText ? <Text style={[s.small, { color: w.deltaUp ? P.correctText : P.textSoft }]}>{w.deltaText}</Text> : null}
        <View style={s.days}>
          {w.days.map((d) => (
            <View key={d.key} style={{ flex: 1, alignItems: "center", gap: 3 }}>
              <View style={[s.dayBox, { backgroundColor: d.on ? P.primary : P.border, opacity: d.future ? 0.4 : 1 }]} />
              <Text style={s.small}>{d.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {w.nothingText ? (
        <Text style={s.soft}>{w.nothingText}</Text>
      ) : (
        <View style={s.card}>
          {w.subjects.map((sub, i) => (
            <View key={sub.questId} style={[{ gap: 3, paddingVertical: 6 }, i > 0 && { borderTopWidth: 1, borderTopColor: P.border }]}>
              <Text style={s.subject}>{sub.title}</Text>
              {sub.strong ? <Text style={s.line}>✅ {t.strong}: {sub.strong}</Text> : null}
              {sub.practise ? <Text style={[s.line, { color: P.gold }]}>🎯 {t.practise}: {sub.practise}</Text> : null}
              <Text style={s.small}>
                {sub.done}/{sub.total} · {sub.next ? `${t.next}: ${sub.next}` : t.allDone}
              </Text>
            </View>
          ))}
        </View>
      )}

      {w.unpractisedText ? (
        <View style={[s.card, { paddingVertical: 10 }]}>
          <Text style={s.small}>{w.unpractisedText}</Text>
        </View>
      ) : null}

      <View style={[s.card, { backgroundColor: P.selectedBg, borderColor: P.selectedBg }]}>
        <Text style={s.label}>{t.home}</Text>
        <Text style={s.line}>{w.home}</Text>
      </View>
      {/* Folded, not hidden (design rule): the latest mistakes, with the right answer, to talk about at home. */}
      {missed.length ? (
        <View style={s.card}>
          <Pressable onPress={() => setShowMissed((v) => !v)} accessibilityRole="button" accessibilityState={{ expanded: showMissed }} style={{ flexDirection: "row", alignItems: "center", minHeight: 40 }}>
            <Text style={[s.subject, { flex: 1 }]}>{t.missed(missed.length)}</Text>
            <Text style={s.soft}>{showMissed ? "▲" : "▼"}</Text>
          </Pressable>
          {showMissed
            ? missed.map((m) => (
                <View key={m.key} style={{ paddingVertical: 6, borderTopWidth: 1, borderTopColor: P.border, gap: 2 }}>
                  {m.kind === "strong" ? (
                    <>
                      <Text style={[s.small, { color: P.correctText }]}>{t.strongAsk(m.topic)}</Text>
                      <Text style={s.line}>{m.text}</Text>
                      {m.answer ? <Text style={[s.small, { color: P.correctText }]}>✓ {m.answer}</Text> : null}
                    </>
                  ) : m.kind === "question" ? (
                    <>
                      <Text style={s.line}>{m.text}</Text>
                      {m.answer ? <Text style={[s.small, { color: P.correctText }]}>✓ {m.answer}</Text> : null}
                    </>
                  ) : (
                    <>
                      <Text style={s.small}>{t.topicMiss(m.topic)}</Text>
                      <Text style={s.line}>{m.text}</Text>
                      {m.answer ? <Text style={[s.small, { color: P.correctText }]}>✓ {m.answer}</Text> : null}
                    </>
                  )}
                </View>
              ))
            : null}
        </View>
      ) : null}
      <Text style={s.soft}>
        💜 {t.tipFrom}: {w.tip}
      </Text>
    </View>
  );
}

/** English / हिंदी switch. */
export function LangSwitch({ lang, onChange, P }) {
  const s = makeStyles(P);
  return (
    <View style={s.switch} accessibilityRole="radiogroup">
      {[
        ["en", "English"],
        ["hi", "हिंदी"],
      ].map(([id, label]) => (
        <Pressable key={id} onPress={() => onChange(id)} accessibilityRole="radio" accessibilityState={{ selected: lang === id }} style={[s.switchItem, lang === id && { backgroundColor: P.selectedBg, borderColor: P.selectedBorder }]}>
          <Text style={[s.line, lang === id && { color: P.selectedText }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    wrap: { gap: 10 },
    h: { fontSize: 22, fontFamily: "nunitoBold", color: P.text },
    card: { padding: 14, borderRadius: 18, borderWidth: 2, borderColor: P.border, backgroundColor: P.card, gap: 4 },
    label: { fontSize: 12, letterSpacing: 1, fontFamily: "nunitoBold", color: P.label },
    big: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    subject: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    line: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold", color: P.text },
    small: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft },
    soft: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold", color: P.textSoft },
    days: { flexDirection: "row", gap: 6, marginTop: 8 },
    dayBox: { height: 26, alignSelf: "stretch", borderRadius: 8 },
    switch: { flexDirection: "row", gap: 8, alignSelf: "flex-end" },
    switchItem: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 2, borderColor: P.border },
  });
