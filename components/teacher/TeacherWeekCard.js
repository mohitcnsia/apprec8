// components/teacher/TeacherWeekCard.js
// "This week" for one class (mockup V4, approved 2026-11-05): 1 · reteach one thing, 2 · who needs you,
// 3 · the assignment, and who is ready for harder work. Logic: utils/weeklySummary.js (no extra reads).

import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { sendSticker } from "../../services/moodApi";

export default function TeacherWeekCard({ week, className, classId = null, P }) {
  const [sent, setSent] = useState({}); // "nudge" | "appreciate" → "sending" | number | "error"
  const send = async (kind, kids, topic) => {
    setSent((x) => ({ ...x, [kind]: "sending" }));
    try {
      const r = await sendSticker(classId, kind, kids.map((k) => k.uid), topic);
      setSent((x) => ({ ...x, [kind]: r?.sent ?? 0 }));
    } catch {
      setSent((x) => ({ ...x, [kind]: "error" }));
    }
  };
  const btnText = (kind, label) => (sent[kind] === "sending" ? "…" : typeof sent[kind] === "number" ? `Sent ✓ ${sent[kind]}` : sent[kind] === "error" ? "Try again" : label);
  if (!week || !week.total) return null;
  const s = makeStyles(P);
  const a = week.assignment;
  return (
    <View style={s.wrap} accessibilityLabel={`This week in ${className}`}>
      <Text style={s.h}>This week · {className}</Text>
      <Text style={s.soft}>
        {week.active} of {week.total} students practised in the last 7 days
      </Text>

      <View style={[s.card, week.reteach && { borderColor: P.selectedBorder }]}>
        <Text style={s.label}>1 · RETEACH ONE THING</Text>
        {week.reteach ? (
          <>
            <Text style={s.title}>{week.reteach.title}</Text>
            <Text style={s.line}>
              {week.reteach.kids} of {week.reteach.of} students are below 60% here. You can assign it below.
            </Text>
          </>
        ) : (
          <Text style={s.soft}>No topic is hard for most of the class. 👍</Text>
        )}
      </View>

      <View style={s.card}>
        <Text style={s.label}>2 · WHO NEEDS YOU</Text>
        {week.needs.length ? (
          week.needs.map((n) => (
            <View key={n.uid} style={s.row}>
              <Text style={[s.line, { flex: 1 }]}>{n.name || "Student"}</Text>
              <Text style={[s.soft, { flex: 2, textAlign: "right" }]}>{n.why}</Text>
            </View>
          ))
        ) : (
          <Text style={s.soft}>Everyone is on track.</Text>
        )}
      </View>

      {a ? (
        <View style={s.card}>
          <Text style={s.label}>3 · ASSIGNMENT{a.dueDate ? ` (due ${a.dueDate})` : ""}</Text>
          <Text style={s.line} numberOfLines={2}>
            {a.title}
          </Text>
          <Text style={s.line}>
            {a.done} done · {a.half} started · {a.notStarted} not started
          </Text>
          <View style={s.bar}>
            <View style={{ flex: a.done || 0.0001, backgroundColor: P.correctBorder }} />
            <View style={{ flex: a.half || 0.0001, backgroundColor: P.gold }} />
            <View style={{ flex: a.notStarted || 0.0001, backgroundColor: P.border }} />
          </View>
          {/* Who (owner, 2026-11-12): names per group; Nudge the ones not started, Appreciate the ones done. */}
          {a.who?.done?.length ? <Text style={s.soft}>Done: {a.who.done.map((k) => k.firstName).join(", ")}</Text> : null}
          {a.who?.half?.length ? <Text style={s.soft}>Started: {a.who.half.map((k) => k.firstName).join(", ")}</Text> : null}
          {a.who?.notStarted?.length ? <Text style={s.soft}>Not started: {a.who.notStarted.map((k) => k.firstName).join(", ")}</Text> : null}
          {classId ? (
            <View style={s.acts}>
              {a.who?.notStarted?.length ? (
                <Pressable disabled={!!sent.nudge && sent.nudge !== "error"} onPress={() => send("nudge", a.who.notStarted, a.title)} accessibilityRole="button" style={s.act}>
                  <Text style={s.actText}>{btnText("nudge", `Nudge ${a.who.notStarted.length} not started`)}</Text>
                </Pressable>
              ) : null}
              {a.who?.done?.length ? (
                <Pressable disabled={!!sent.appreciate && sent.appreciate !== "error"} onPress={() => send("appreciate", a.who.done, a.title)} accessibilityRole="button" style={s.act}>
                  <Text style={s.actText}>{btnText("appreciate", `Appreciate ${a.who.done.length} done`)}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      {week.ready.length ? (
        <Text style={s.soft}>
          🚀 Ready for harder work: {week.ready.map((k) => k.firstName || "Student").join(", ")}.
        </Text>
      ) : null}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    wrap: { gap: 8 },
    acts: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
    act: { paddingHorizontal: 12, minHeight: 38, borderRadius: 19, borderWidth: 1.5, borderColor: P.selectedBorder, justifyContent: "center" },
    actText: { fontSize: 13, fontFamily: "nunitoBold", color: P.selectedText },
    h: { fontSize: 20, fontFamily: "nunitoBold", color: P.text },
    card: { padding: 14, borderRadius: 18, borderWidth: 2, borderColor: P.border, backgroundColor: P.card, gap: 4 },
    label: { fontSize: 12, letterSpacing: 1, fontFamily: "nunitoBold", color: P.label },
    title: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    line: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold", color: P.textSoft },
    row: { flexDirection: "row", gap: 8, paddingVertical: 6, borderTopWidth: 1, borderTopColor: P.border },
    bar: { flexDirection: "row", height: 10, borderRadius: 5, overflow: "hidden", marginTop: 6, gap: 2 },
  });
