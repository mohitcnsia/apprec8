// components/teacher/BulkApproveCard.js: approve several join requests at once (owner, 2026-11-12: 50 Class 10 students).
// The teacher ticks the students whose parents said YES (e.g. from the parents' WhatsApp group), picks how they said yes
// once, confirms, and each is approved with the same server call as one by one (approveMember), so each kid's consent
// record says how the parent agreed. Students not ticked stay waiting. Nothing is approved without the confirm step.
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { showAlert } from "../../services/dialog";
import { formatMobile } from "../../utils/joinLink";
import { needsParentYes } from "./JoinRequestCard";

const METHODS = [
  ["whatsapp", "WhatsApp"],
  ["slip", "Slip"],
  ["call", "Phone"],
];

export default function BulkApproveCard({ kids, P, approveOne, onDone }) {
  const s = useMemo(() => makeStyles(P), [P]);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState({});
  const [method, setMethod] = useState("whatsapp");
  const [progress, setProgress] = useState(null); // "3 of 12"
  if (kids.length < 2) return null;

  const chosen = kids.filter((k) => picked[k.uid]);
  const label = (k) => [k.firstName || "Student", k.rollNo ? `Roll ${k.rollNo}` : null].filter(Boolean).join(" · ");
  const run = async () => {
    let ok = 0;
    const failed = [];
    for (let i = 0; i < chosen.length; i++) {
      setProgress(`${i + 1} of ${chosen.length}`);
      try {
        await approveOne(chosen[i], needsParentYes(chosen[i]) ? method : null);
        ok += 1;
      } catch (e) {
        failed.push(chosen[i].firstName || "a student");
      }
    }
    setProgress(null);
    setPicked({});
    setOpen(false);
    onDone && onDone();
    if (failed.length) showAlert("Some weren't approved", `${ok} approved. Try again for: ${failed.join(", ")}.`);
  };
  const confirm = () =>
    showAlert(
      `Approve ${chosen.length} students?`,
      `You confirm each of their parents said YES (${METHODS.find((m) => m[0] === method)[1]}). They join the class at once.`,
      [
        { text: "Not yet", style: "cancel" },
        { text: `Approve ${chosen.length}`, onPress: run },
      ]
    );

  if (!open) {
    return (
      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" style={s.open}>
        <Text style={s.openText}>Approve several at once ({kids.length} waiting) ›</Text>
      </Pressable>
    );
  }

  return (
    <View style={s.card}>
      <Text style={s.title}>Tick the students whose parents said YES</Text>
      <Pressable onPress={() => setPicked(Object.fromEntries(kids.map((k) => [k.uid, true])))} accessibilityRole="button" style={s.all}>
        <Text style={s.link}>Tick all {kids.length}</Text>
      </Pressable>
      {kids.map((k) => (
        <Pressable
          key={k.uid}
          onPress={() => setPicked((p) => ({ ...p, [k.uid]: !p[k.uid] }))}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !!picked[k.uid] }}
          style={s.row}
        >
          <View style={[s.box, picked[k.uid] && s.boxOn]}>{picked[k.uid] ? <Text style={s.tick}>✓</Text> : null}</View>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{label(k)}</Text>
            {k.parentMobile ? <Text style={s.soft}>Parent {formatMobile(k.parentMobile)}</Text> : null}
          </View>
        </Pressable>
      ))}
      <Text style={s.soft}>The parents said yes on:</Text>
      <View style={s.methods}>
        {METHODS.map(([id, text]) => (
          <Pressable key={id} onPress={() => setMethod(id)} accessibilityRole="radio" accessibilityState={{ selected: method === id }} style={[s.method, method === id && s.methodOn]}>
            <Text style={[s.methodText, method === id && s.methodTextOn]}>{text}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.methods}>
        <Pressable onPress={() => (setOpen(false), setPicked({}))} accessibilityRole="button" style={s.cancel}>
          <Text style={s.link}>Cancel</Text>
        </Pressable>
        <Pressable disabled={!chosen.length || !!progress} onPress={confirm} accessibilityRole="button" style={[s.go, (!chosen.length || progress) && { opacity: 0.5 }]}>
          <Text style={s.goText}>{progress ? `Approving ${progress}…` : `APPROVE ${chosen.length}`}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    open: { minHeight: 44, justifyContent: "center" },
    openText: { fontSize: 15, fontFamily: "nunitoBold", color: P.label },
    card: { padding: 14, borderRadius: 18, backgroundColor: P.card, borderWidth: 2, borderColor: P.selectedBorder, gap: 8 },
    title: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    all: { minHeight: 36, justifyContent: "center" },
    link: { fontSize: 14, fontFamily: "nunitoBold", color: P.label },
    row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 },
    box: { width: 26, height: 26, borderRadius: 7, borderWidth: 2, borderColor: P.borderDeep, alignItems: "center", justifyContent: "center" },
    boxOn: { backgroundColor: P.primary, borderColor: P.primary },
    tick: { color: P.onPrimary, fontSize: 15, fontFamily: "nunitoBold" },
    name: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 13, fontFamily: "nunito", color: P.textSoft },
    methods: { flexDirection: "row", gap: 8, alignItems: "center" },
    method: { paddingHorizontal: 14, minHeight: 38, borderRadius: 19, borderWidth: 1.5, borderColor: P.border, justifyContent: "center" },
    methodOn: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    methodText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    methodTextOn: { color: P.selectedText },
    cancel: { minHeight: 46, paddingHorizontal: 12, justifyContent: "center" },
    go: { flex: 1, minHeight: 50, borderRadius: 16, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    goText: { fontSize: 16, fontFamily: "nunitoBold", color: P.onPrimary, letterSpacing: 1 },
  });
