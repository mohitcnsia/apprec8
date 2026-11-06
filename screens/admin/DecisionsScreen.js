// screens/admin/DecisionsScreen.js: Me → Decisions (owner only; owner 2026-11-06: "get approval on the app itself …
// Yes, No, More details, Later"). Claude's questions arrive with a notification; one tap answers. "More details" first
// opens the full story; tapping it again tells Claude to explain more. Logic: utils/decisions.js.

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown from "react-native-markdown-display";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "./schoolUi";
import { markdownStyles } from "./OwnerNotesScreen";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { inbox, answerLabel } from "../../utils/decisions";
import { listenDecisions, answerDecision, notifyThisPhone } from "../../services/decisionsApi";

const PHONE_KEY = "decisions:phone:v1";
const mdRules = {
  image: (node) => <Image key={node.key} source={{ uri: node.attributes.src }} style={{ width: "100%", aspectRatio: 1024 / 500, borderRadius: 12, marginVertical: 6 }} resizeMode="contain" />,
};

export default function DecisionsScreen() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const md = useMemo(() => markdownStyles(P), [P]);
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID;

  const [docs, setDocs] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState({}); // details opened
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);
  const [showDone, setShowDone] = useState(false);
  const [changing, setChanging] = useState({});
  const [phone, setPhone] = useState("unknown"); // unknown | on | off
  const [phoneMsg, setPhoneMsg] = useState("");

  useEffect(() => {
    if (!isAdmin) return undefined;
    AsyncStorage.getItem(PHONE_KEY)
      .then((v) => setPhone(v ? "on" : "off"))
      .catch(() => setPhone("off"));
    return listenDecisions((list, err) => {
      setDocs(list);
      setError(err);
    });
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Text style={styles.soft}>Owner only.</Text>
      </View>
    );
  }

  const box = inbox(docs || []);
  const answer = async (d, a) => {
    if (a === "more" && d.details && !open[d.id]) {
      setOpen({ ...open, [d.id]: true }); // first tap: read the full story here
      return;
    }
    setBusy(d.id);
    try {
      await answerDecision(d.id, a, notes[d.id]);
      setChanging({ ...changing, [d.id]: false });
    } catch (e) {
      setError(e?.code || "error");
    }
    setBusy(null);
  };
  const turnOnPhone = async () => {
    setPhoneMsg("");
    try {
      const r = await notifyThisPhone();
      if (!r.ok) return setPhoneMsg(r.reason);
      await AsyncStorage.setItem(PHONE_KEY, "1").catch(() => {});
      setPhone("on");
      setPhoneMsg("Done. New questions will buzz this phone.");
    } catch (e) {
      setPhoneMsg(e?.code === "firestore/permission-denied" ? "Not switched on yet: Gemini turns it on (DR-21)." : "Couldn't save. Check the internet and try again.");
    }
  };

  const buttons = (d) => (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {btn(d, "yes", "👍 YES", true)}
        {btn(d, "no", "✋ NO")}
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {btn(d, "more", d.details && !open[d.id] ? "❓ MORE DETAILS" : "❓ STILL UNCLEAR")}
        {btn(d, "later", "⏰ LATER")}
      </View>
    </View>
  );
  function btn(d, a, label, main = false) {
    return (
      <Pressable
        key={a}
        onPress={() => answer(d, a)}
        disabled={busy === d.id}
        accessibilityRole="button"
        style={[styles.smallButton, { flex: 1, minHeight: 52 }, main && { backgroundColor: P.primary, borderColor: P.primary }]}
      >
        <Text style={[styles.smallButtonText, main && { color: P.onPrimary }]}>{label}</Text>
      </Pressable>
    );
  }
  const card = (d, answered = false) => (
    <View key={d.id} style={styles.card}>
      <Text style={styles.small}>{d.from === "gemini" ? "FROM GEMINI" : "FROM CLAUDE"}</Text>
      <Text style={styles.title}>{d.title}</Text>
      <Text style={styles.soft}>{d.ask}</Text>
      {d.link ? (
        <Pressable onPress={() => Linking.openURL(d.link).catch(() => {})} accessibilityRole="link" style={styles.link}>
          <Text style={styles.linkText}>🔗 Open the mockup / page</Text>
        </Pressable>
      ) : null}
      {d.details ? (
        open[d.id] ? (
          <Markdown style={md} rules={mdRules} onLinkPress={(u) => (/^https?:/.test(u) && Linking.openURL(u).catch(() => {}), false)}>
            {d.details}
          </Markdown>
        ) : (
          <Pressable onPress={() => setOpen({ ...open, [d.id]: true })} accessibilityRole="button" style={styles.link}>
            <Text style={styles.linkText}>Read the full story ▾</Text>
          </Pressable>
        )
      ) : null}
      {answered && !changing[d.id] ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={[styles.text, { flex: 1 }]}>
            You said: {answerLabel(d.answer)}
            {d.note ? ` · "${d.note}"` : ""}
          </Text>
          <Pressable onPress={() => setChanging({ ...changing, [d.id]: true })} accessibilityRole="button" style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Change</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <TextInput
            value={notes[d.id] || ""}
            onChangeText={(t) => setNotes({ ...notes, [d.id]: t })}
            placeholder="A note for Claude (optional)"
            placeholderTextColor={P.dimText}
            style={[styles.input, { height: 48, fontSize: 15 }]}
            maxLength={500}
          />
          {busy === d.id ? <ActivityIndicator color={P.label} /> : buttons(d)}
        </>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: "flex-end" }]}>
        <Text style={styles.h1}>Decisions</Text>
        <Text style={styles.soft}>
          {box.waiting.length ? `${box.waiting.length} waiting for you. One tap each.` : "Nothing waiting. 🎉 New questions arrive with a notification."}
        </Text>
        {error === "firestore/permission-denied" ? <Text style={styles.small}>Not switched on yet: Gemini turns it on (DR-21).</Text> : null}
        {docs === null ? <ActivityIndicator color={P.label} /> : null}
        {box.done.length ? (
          <Pressable onPress={() => setShowDone(!showDone)} accessibilityRole="button" style={styles.link}>
            <Text style={styles.linkText}>
              {showDone ? "▾" : "▸"} Answered ({box.done.length})
            </Text>
          </Pressable>
        ) : null}
        {showDone ? box.done.map((d) => card(d, true)) : null}
        {box.later.length ? <Text style={styles.label}>LATER · BACK TOMORROW ({box.later.length})</Text> : null}
        {box.later.map((d) => card(d, true))}
        {box.waiting.map((d) => card(d))}
        {phoneMsg ? <Text style={styles.small}>{phoneMsg}</Text> : null}
      </ScrollView>
      {phone === "off" ? (
        <View style={styles.footer}>
          <MainButton label="🔔 NOTIFY ME ON THIS PHONE" onPress={turnOnPhone} styles={styles} P={P} />
        </View>
      ) : null}
    </View>
  );
}
