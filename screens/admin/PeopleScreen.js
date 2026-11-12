// screens/admin/PeopleScreen.js: who joined, when, and what they did (owner, 12-13 Nov: "our app should show all the user
// details, who all have joined and when"; mockup in the sign-ups doc). The owner sees everyone with email; a school admin
// sees their school's classes. Read-only for now (Help buttons come next). Data: functions/callable/peopleActions.js.
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import functions from "@react-native-firebase/functions";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { filterPeople, whenText, KIND_LABEL, shapePerson, peopleCounts } from "../../utils/people";

const TABS = [
  ["new", "New today"],
  ["stuck", "Stuck"],
  ["all", "All"],
];

export default function PeopleScreen() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const load = () => {
    setError("");
    functions()
      .httpsCallable("peopleList")({})
      .then((r) => setData({ ...r.data, people: (r.data.people || []).map((p) => shapePerson(p)) }))
      .catch((e) => setError(e?.code === "functions/not-found" ? "Deploy peopleList first (see My notes)." : e?.message || "Couldn't load. Try again."));
  };
  useEffect(load, []);

  const now = Date.now();
  const list = useMemo(() => (data ? filterPeople(data.people, { tab, query: q, now }) : []), [data, tab, q]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data && !error) return <View style={[s.screen, s.center]}><ActivityIndicator color={P.label} /></View>;
  if (!data) return <View style={[s.screen, s.center]}><Text style={s.soft}>{error}</Text></View>;
  const c = peopleCounts(data.people, now);

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.h1}>People</Text>
      <Text style={s.soft}>{c.total} people · {c.newToday} joined today · {c.stuck} stuck{c.robots || c.tests ? ` · not counted: ${[c.robots ? `${c.robots} Play robots` : null, c.tests ? `${c.tests} test accounts` : null].filter(Boolean).join(", ")}` : ""} · updated {whenText(data.at, now)}</Text>
      <View style={s.tabs} accessibilityRole="tablist">
        {TABS.map(([id, label]) => (
          <Pressable key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityState={{ selected: tab === id }} style={[s.tab, tab === id && s.tabOn]}>
            <Text style={[s.tabText, tab === id && s.tabTextOn]}>
              {label} {id === "new" ? c.newToday : id === "stuck" ? c.stuck : data.people.length}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        nativeID="people-search"
        value={q}
        onChangeText={setQ}
        placeholder={data.withEmail ? "Search name or email" : "Search name"}
        placeholderTextColor={P.dimText}
        autoCapitalize="none"
        style={s.search}
      />
      {list.length ? null : <Text style={s.soft}>Nobody here.</Text>}
      {list.map((p) => {
        const isOpen = open === p.uid;
        const place = p.teaches.length ? `teaches ${p.teaches.join(", ")}` : p.classes.length ? `in ${p.classes.join(", ")}` : p.waiting.length ? `waiting for ${p.waiting.join(", ")}` : "no class";
        return (
          <Pressable key={p.uid} onPress={() => setOpen(isOpen ? null : p.uid)} accessibilityRole="button" accessibilityState={{ expanded: isOpen }} style={[s.row, p.stuck && s.rowStuck]}>
            <View style={s.line}>
              <Text style={s.name} numberOfLines={1}>{p.name || "(no name)"}</Text>
              <Text style={[s.chip, p.stuck && s.chipStuck]}>{p.stuck ? "STUCK" : KIND_LABEL[p.kind]}{p.grade && p.kind !== "parent" ? ` · Class ${p.grade}` : ""}</Text>
            </View>
            {p.email ? <Text style={s.soft} numberOfLines={1}>{p.email}</Text> : null}
            <Text style={s.small}>Joined {whenText(p.joinedAt, now)} · last seen {p.lastSeenAt ? whenText(p.lastSeenAt, now) : "—"}</Text>
            <Text style={s.small}>{place} · {p.quizzes} {p.quizzes === 1 ? "quiz" : "quizzes"} · {p.stars} ★</Text>
            {isOpen ? (
              <View style={s.detail}>
                <Text style={s.small}>Joined: {new Date(p.joinedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}{p.via ? ` · via ${p.via}` : ""}</Text>
                {p.kind === "parent" ? <Text style={s.small}>{p.children} {p.children === 1 ? "child" : "children"} added</Text> : null}
                {p.kind === "none" ? <Text style={s.small}>Signed in but picked no class and added no child. Call or message them.</Text> : null}
                {p.robot ? <Text style={s.small}>Google Play's automatic test account: it signs in once to check the app. Not a real person.</Text> : null}
                {p.deletionRequested ? <Text style={s.warn}>Asked to delete the account (kept 90 days; you decide)</Text> : null}
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    center: { alignItems: "center", justifyContent: "center", padding: 24 },
    content: { padding: 16, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32, gap: 10 },
    h1: { fontSize: 24, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 14, fontFamily: "nunito", color: P.textSoft, lineHeight: 20 },
    small: { fontSize: 13, fontFamily: "nunito", color: P.textSoft, lineHeight: 18 },
    warn: { fontSize: 13, fontFamily: "nunitoBold", color: P.wrongText },
    tabs: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    tab: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5, borderColor: P.border, justifyContent: "center" },
    tabOn: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    tabText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    tabTextOn: { color: P.selectedText },
    search: { minHeight: 46, borderRadius: 14, borderWidth: 1.5, borderColor: P.border, paddingHorizontal: 14, color: P.text, fontFamily: "nunito", fontSize: 15, backgroundColor: P.card },
    row: { padding: 14, borderRadius: 16, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, gap: 3 },
    rowStuck: { borderColor: P.wrongText },
    line: { flexDirection: "row", alignItems: "center", gap: 8 },
    name: { flex: 1, fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    chip: { fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 0.5, color: P.selectedText, backgroundColor: P.selectedBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: "hidden" },
    chipStuck: { color: P.wrongText, backgroundColor: P.wrongBg || P.selectedBg },
    detail: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: P.border, gap: 3 },
  });
