// screens/admin/SendCardScreen.js: "Send a card" + "Cards you sent" (owner-approved mockup, 16 Nov 2026).
// Starters (Safety, Story, Fact, Task) or blank; title + one or two lines; study-card pages (ideas + one-tap questions);
// "More like this" = a whole quest; who: All parents · All children · A class · Everyone · Choose people (staff: the
// hat); optional notification (server: one card notification a day per person, never to children).
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import functions from "@react-native-firebase/functions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import AppButton, { MainAction } from "../../components/common/AppButton";
import { CARD_STARTERS } from "../../data/cardStarters";
import { QUESTS } from "../../data/quests";
import { sendCard, sentCards } from "../../services/cardsApi";
import { listSchools, listClassesOfSchool } from "../../services/classesApi";
import { showAlert } from "../../services/dialog";

const WHO = [["parents", "All parents"], ["children", "All children"], ["class", "A class"], ["everyone", "Everyone"], ["people", "Choose people"]];
const HATS = [[null, "—"], ["admin", "Admin"], ["teacher", "Teacher"], ["counsellor", "Counsellor"]];
const DUE = [[0, "No date"], [1, "Tomorrow"], [3, "In 3 days"], [7, "In a week"]];
const blank = () => ({ kind: "other", title: "", text: "", cards: [], moreQuestId: null, hat: null });

export default function SendCardScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);
  const [mode, setMode] = useState("list");
  const [sent, setSent] = useState(null);
  const [card, setCard] = useState(blank());
  const [who, setWho] = useState("parents");
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [people, setPeople] = useState(null);
  const [search, setSearch] = useState("");
  const [chosen, setChosen] = useState([]);
  const [push, setPush] = useState(true);
  const [dueDays, setDueDays] = useState(0);
  const [busy, setBusy] = useState(false);

  const loadSent = useCallback(() => {
    sentCards().then(setSent).catch(() => setSent([]));
  }, []);
  useFocusEffect(loadSent);
  useEffect(() => {
    if (who === "class" && !classes.length)
      listSchools()
        .then(async (sc) => (await Promise.all(sc.map((x) => listClassesOfSchool(x.id).then((cs) => cs.map((c) => ({ ...c, schoolName: x.name })))))).flat())
        .then((all) => setClasses(all.filter((c) => !String(c.id).startsWith("demo_"))))
        .catch(() => {});
    if (who === "people" && !people)
      functions().httpsCallable("peopleList")({}).then((r) => setPeople(r.data?.people || [])).catch(() => setPeople([]));
  }, [who]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setCard((c) => ({ ...c, [k]: v }));
  const setPage = (i, k, v) => setCard((c) => ({ ...c, cards: c.cards.map((p, j) => (j === i ? { ...p, [k]: v } : p)) }));
  const setWrong = (i, w, v) => setCard((c) => ({ ...c, cards: c.cards.map((p, j) => (j === i ? { ...p, wrong: Object.assign([...(p.wrong || ["", ""])], { [w]: v }) } : p)) }));
  const found = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || !people) return [];
    return people.filter((p) => (p.name || "").toLowerCase().includes(q) && !chosen.some((c) => c.uid === p.uid)).slice(0, 6);
  }, [search, people, chosen]);
  const audienceLabel = who === "class" ? classes.find((c) => c.id === classId)?.name || "a class" : who === "people" ? chosen.map((c) => c.name).join(", ") : WHO.find(([id]) => id === who)[1].toLowerCase();

  const send = () => {
    if (!card.title.trim()) return showAlert("Add a title", "Give the card a short title.");
    if (who === "class" && !classId) return showAlert("Choose the class", "Pick which class gets the card.");
    if (who === "people" && !chosen.length) return showAlert("Choose people", "Search a name and tap it to add.");
    showAlert(`Send to ${audienceLabel}?`, push ? "They also get a notification (children don't)." : "No notification: they see it on Home.", [
      { text: "Not yet", style: "cancel" },
      {
        text: "Send",
        onPress: async () => {
          setBusy(true);
          try {
            const r = await sendCard(
              { ...card, push, dueAt: card.kind === "task" && dueDays ? Date.now() + dueDays * 864e5 : null },
              { type: who, classId: who === "class" ? classId : null, uids: who === "people" ? chosen.map((c) => c.uid) : [] }
            );
            showAlert("Sent", `On ${r.sent} ${r.sent === 1 ? "person's" : "people's"} Home${r.pushed ? `, ${r.pushed} notification${r.pushed === 1 ? "" : "s"}` : ""}.`);
            setCard(blank());
            setChosen([]);
            setMode("list");
            loadSent();
          } catch (e) {
            showAlert("Couldn't send", e?.message || String(e));
          }
          setBusy(false);
        },
      },
    ]);
  };

  if (mode === "list") {
    return (
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <Text style={s.h1}>Cards you sent</Text>
        {sent === null ? <Text style={s.soft}>Loading…</Text> : null}
        {sent && !sent.length ? <Text style={s.soft}>Nothing sent yet.</Text> : null}
        {(sent || []).map((c) => (
          <View key={c.id} style={s.box}>
            <Text style={s.label}>{`${(c.kind || "card").toUpperCase()} · ${c.audience?.type === "people" ? "CHOSEN PEOPLE" : (c.audience?.type || "").toUpperCase()}`}</Text>
            <Text style={s.title}>{c.title}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              <Text style={s.pill}>Sent to {c.sent || 0}</Text>
              <Text style={s.pill}>Opened {c.opened || 0}</Text>
              <Text style={s.pill}>{c.kind === "task" ? "Done" : "Finished"} {c.done || 0}</Text>
              {c.kind !== "task" ? <Text style={s.pillSoft}>Closed {c.closed || 0}</Text> : null}
            </View>
          </View>
        ))}
        <MainAction style={{ marginTop: 8 }}>
          <AppButton icon="add" label="New card" size="lg" onPress={() => setMode("new")} />
        </MainAction>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.h1}>Send a card</Text>

      <Text style={s.label}>START FROM</Text>
      <View style={s.wrap}>
        {CARD_STARTERS.map((st) => (
          <AppButton key={st.id} variant="chip" size="sm" selected={card.kind === st.card.kind} label={st.label} onPress={() => setCard({ ...blank(), ...JSON.parse(JSON.stringify(st.card)) })} />
        ))}
        <AppButton variant="chip" size="sm" selected={card.kind === "other"} label="Blank" onPress={() => setCard(blank())} />
      </View>

      <Text style={s.label}>TITLE</Text>
      <TextInput value={card.title} onChangeText={(v) => set("title", v)} placeholder="A short title" placeholderTextColor={P.dimText} style={s.input} maxLength={80} />
      <Text style={s.label}>TEXT (ONE OR TWO LINES)</Text>
      <TextInput value={card.text} onChangeText={(v) => set("text", v)} placeholder="What it's about" placeholderTextColor={P.dimText} style={[s.input, { minHeight: 64 }]} multiline maxLength={220} />

      <Text style={s.label}>PAGES (STUDY CARDS: IDEAS AND QUICK QUESTIONS)</Text>
      {card.cards.map((p, i) => (
        <View key={i} style={s.box}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[s.label, { flex: 1 }]}>{p.kind === "check" ? `QUESTION · PAGE ${i + 1}` : `IDEA · PAGE ${i + 1}`}</Text>
            <Pressable onPress={() => setCard((c) => ({ ...c, cards: c.cards.filter((_, j) => j !== i) }))} accessibilityLabel={`Remove page ${i + 1}`} hitSlop={10}>
              <Ionicons name="trash-outline" size={18} color={P.wrongText} />
            </Pressable>
          </View>
          {p.kind === "check" ? (
            <>
              <TextInput value={p.question} onChangeText={(v) => setPage(i, "question", v)} placeholder="Question" placeholderTextColor={P.dimText} style={s.input} multiline />
              <TextInput value={p.answer} onChangeText={(v) => setPage(i, "answer", v)} placeholder="Right answer" placeholderTextColor={P.dimText} style={[s.input, { borderColor: P.correctBorder }]} />
              {[0, 1, 2].map((w) => (
                <TextInput key={w} value={(p.wrong || [])[w] || ""} onChangeText={(v) => setWrong(i, w, v)} placeholder={`Wrong answer ${w + 1}${w === 2 ? " (optional)" : ""}`} placeholderTextColor={P.dimText} style={s.input} />
              ))}
              <TextInput value={p.explain || ""} onChangeText={(v) => setPage(i, "explain", v)} placeholder="Why (shown after they tap)" placeholderTextColor={P.dimText} style={s.input} multiline />
            </>
          ) : (
            <>
              <TextInput value={p.title} onChangeText={(v) => setPage(i, "title", v)} placeholder="Page title" placeholderTextColor={P.dimText} style={s.input} />
              <TextInput value={p.text} onChangeText={(v) => setPage(i, "text", v)} placeholder="Page text" placeholderTextColor={P.dimText} style={[s.input, { minHeight: 70 }]} multiline />
            </>
          )}
        </View>
      ))}
      {card.cards.length < 8 ? (
        <View style={s.wrap}>
          <AppButton variant="soft" icon="document-text-outline" label="Idea page" onPress={() => set("cards", [...card.cards, { kind: "idea", title: "", text: "" }])} />
          <AppButton variant="soft" icon="help-circle-outline" label="Question" onPress={() => set("cards", [...card.cards, { kind: "check", question: "", answer: "", wrong: ["", ""], explain: "" }])} />
        </View>
      ) : null}

      <Text style={s.label}>MORE LIKE THIS (LAST PAGE)</Text>
      <View style={s.wrap}>
        <AppButton variant="chip" size="sm" selected={!card.moreQuestId} label="None" onPress={() => set("moreQuestId", null)} />
        {QUESTS.map((m) => (
          <AppButton key={m.QUEST_ID} variant="chip" size="sm" selected={card.moreQuestId === m.QUEST_ID} label={(m.quest?.title || m.QUEST_ID).replace(/ Quest$/, "")} onPress={() => set("moreQuestId", m.QUEST_ID)} />
        ))}
      </View>

      <Text style={s.label}>WHO</Text>
      <View style={s.wrap}>
        {WHO.map(([id, label]) => (
          <AppButton key={id} variant="chip" size="sm" selected={who === id} label={label} onPress={() => setWho(id)} />
        ))}
      </View>
      {who === "class" ? (
        <View style={s.wrap}>
          {classes.length ? classes.map((c) => <AppButton key={c.id} variant="chip" size="sm" selected={classId === c.id} label={`${c.name}${c.schoolName ? ` · ${c.schoolName}` : ""}`} onPress={() => setClassId(c.id)} />) : <Text style={s.soft}>Loading classes…</Text>}
        </View>
      ) : null}
      {who === "people" ? (
        <View style={s.box}>
          <TextInput value={search} onChangeText={setSearch} placeholder={people ? "Search a name" : "Loading people…"} placeholderTextColor={P.dimText} style={s.input} />
          {found.map((p) => (
            <Pressable key={p.uid} onPress={() => (setChosen((c) => [...c, p]), setSearch(""))} style={s.found} accessibilityRole="button">
              <Text style={s.title}>{p.name || "(no name)"}</Text>
              <Text style={s.soft}>{[p.kind, p.grade ? `Class ${p.grade}` : null, (p.teaches || [])[0]].filter(Boolean).join(" · ")}</Text>
            </Pressable>
          ))}
          <View style={s.wrap}>
            {chosen.map((c) => (
              <AppButton key={c.uid} variant="chip" size="sm" selected icon="close" iconSide="right" label={c.name || "?"} onPress={() => setChosen((x) => x.filter((y) => y.uid !== c.uid))} />
            ))}
          </View>
          {chosen.some((c) => c.kind === "teacher") ? (
            <>
              <Text style={s.label}>AS (FOR STAFF)</Text>
              <View style={s.wrap}>
                {HATS.map(([id, label]) => <AppButton key={label} variant="chip" size="sm" selected={card.hat === id} label={label} onPress={() => set("hat", id)} />)}
              </View>
            </>
          ) : null}
        </View>
      ) : null}

      {card.kind === "task" ? (
        <>
          <Text style={s.label}>DUE</Text>
          <View style={s.wrap}>
            {DUE.map(([d, label]) => <AppButton key={label} variant="chip" size="sm" selected={dueDays === d} label={label} onPress={() => setDueDays(d)} />)}
          </View>
        </>
      ) : null}

      <View style={[s.box, { flexDirection: "row", alignItems: "center", gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Also send a notification</Text>
          <Text style={s.soft}>At most one a day per person. Children never get one.</Text>
        </View>
        <Switch value={push} onValueChange={setPush} accessibilityLabel="Also send a notification" />
      </View>

      <MainAction style={{ marginTop: 8 }}>
        <AppButton variant="soft" label="Cancel" onPress={() => setMode("list")} />
        <AppButton icon="send" iconSide="right" label="Send" size="lg" busy={busy} onPress={send} />
      </MainAction>
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { padding: 18, paddingTop: insets.top + 14, paddingBottom: insets.bottom + 30, gap: 10 },
    h1: { fontSize: 26, fontFamily: "nunitoBold", color: P.text, marginBottom: 4 },
    label: { fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 1.2, color: P.label, marginTop: 6 },
    title: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 13, fontFamily: "nunito", color: P.textSoft },
    input: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, color: P.text, fontFamily: "nunito" },
    box: { borderWidth: 1, borderColor: P.border, borderRadius: 16, padding: 12, gap: 8, backgroundColor: P.card },
    wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    pill: { fontSize: 12, fontFamily: "nunitoBold", color: P.selectedText, backgroundColor: P.selectedBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, overflow: "hidden" },
    pillSoft: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft, backgroundColor: P.track, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, overflow: "hidden" },
    found: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: P.border },
  });
