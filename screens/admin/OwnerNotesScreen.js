// screens/admin/OwnerNotesScreen.js
// Admin tools → My notes (owner only, 2026-11-06): the launch checklist and the testing list, readable on the phone.
// Sections are folded; boxes can be ticked (saved on this phone only, AsyncStorage). The text is bundled
// (data/ownerNotes.js), so it is refreshed with every "publish". No Firestore reads.

import React, { useEffect, useMemo, useState } from "react";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown from "react-native-markdown-display";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, Chip } from "./schoolUi";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { OWNER_NOTES, OWNER_NOTES_UPDATED } from "../../data/ownerNotes";
import { parseNotes, sectionCount } from "../../utils/ownerNotes";

const TICKS_KEY = "ownerNotes:ticks:v1";
const TAB_KEY = "ownerNotes:tab:v1";

export default function OwnerNotesScreen() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const md = useMemo(() => markdownStyles(P), [P]);
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID;

  const [tab, setTab] = useState(OWNER_NOTES[0].id);
  const [open, setOpen] = useState({}); // { "tab:sectionId": true }
  const [ticks, setTicks] = useState({});
  const notes = useMemo(() => Object.fromEntries(OWNER_NOTES.map((n) => [n.id, parseNotes(n.md)])), []);

  useEffect(() => {
    (async () => {
      try {
        const [t, last] = await Promise.all([AsyncStorage.getItem(TICKS_KEY), AsyncStorage.getItem(TAB_KEY)]);
        if (t) setTicks(JSON.parse(t) || {});
        if (last && notes[last]) setTab(last);
      } catch (e) {
        // fine: start with nothing ticked
      }
    })();
  }, [notes]);

  const pickTab = (id) => {
    setTab(id);
    AsyncStorage.setItem(TAB_KEY, id).catch(() => {});
  };
  const toggle = (b) => {
    const now = b.key in ticks ? ticks[b.key] : b.done;
    const next = { ...ticks, [b.key]: !now };
    setTicks(next);
    AsyncStorage.setItem(TICKS_KEY, JSON.stringify(next)).catch(() => {});
  };
  // Images (e.g. the feature graphic): full width, wide shape.
  const mdRules = {
    image: (node) => <Image key={node.key} source={{ uri: node.attributes.src }} style={{ width: "100%", aspectRatio: 1024 / 500, borderRadius: 12, marginVertical: 6 }} resizeMode="contain" />,
  };
  const onLink = (url) => {
    if (/^https?:/.test(url)) Linking.openURL(url).catch(() => {});
    return false; // links to other .md files don't open on the phone
  };

  if (!isAdmin) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Text style={styles.soft}>Owner only.</Text>
      </View>
    );
  }

  const note = notes[tab];
  const renderBody = (body) =>
    body.map((b, i) =>
      b.type === "check" ? (
        <Pressable
          key={`${b.key}-${i}`}
          onPress={() => toggle(b)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: b.key in ticks ? ticks[b.key] : b.done }}
          style={{ flexDirection: "row", gap: 10, alignItems: "flex-start", minHeight: 44, paddingVertical: 6 }}
        >
          <Ionicons name={(b.key in ticks ? ticks[b.key] : b.done) ? "checkbox" : "square-outline"} size={24} color={(b.key in ticks ? ticks[b.key] : b.done) ? P.correctBorder : P.dimText} />
          <View style={{ flex: 1 }}>
            <Markdown style={md} rules={mdRules} onLinkPress={onLink}>
              {b.text}
            </Markdown>
          </View>
        </Pressable>
      ) : (
        <Markdown key={`md-${i}`} style={md} rules={mdRules} onLinkPress={onLink}>
          {b.text}
        </Markdown>
      )
    );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>My notes</Text>
      <Text style={styles.dim}>Only you see this. Updated with each publish ({OWNER_NOTES_UPDATED}). Ticks stay on this phone.</Text>
      <View style={styles.chips}>
        {OWNER_NOTES.map((n) => (
          <Chip key={n.id} label={n.title} on={tab === n.id} onPress={() => pickTab(n.id)} styles={styles} />
        ))}
      </View>

      {note.title ? <Text style={styles.title}>{note.title}</Text> : null}
      {note.intro.length ? renderBody(note.intro) : null}

      {note.sections.map((s) => {
        if (s.group) {
          return (
            <View key={s.id} style={{ gap: 4, marginTop: 8 }}>
              <Text style={styles.label}>{s.title.toUpperCase()}</Text>
              {renderBody(s.body)}
            </View>
          );
        }
        const k = `${tab}:${s.id}`;
        const isOpen = !!open[k];
        const c = sectionCount(s, ticks);
        return (
          <View key={s.id} style={[styles.card, { paddingVertical: 4, gap: 4 }]}>
            <Pressable
              onPress={() => setOpen((o) => ({ ...o, [k]: !o[k] }))}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, minHeight: 52 }}
            >
              <Text style={[styles.text, { flex: 1 }]}>{s.title}</Text>
              {c.total ? <Text style={[styles.small, c.done === c.total && { color: P.correctText }]}>{`${c.done}/${c.total}`}</Text> : null}
              <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={P.dimText} />
            </Pressable>
            {isOpen ? (
              <View style={{ paddingBottom: 10 }}>
                {renderBody(s.body)}
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const markdownStyles = (P) => ({
  body: { color: P.text, fontSize: 15, lineHeight: 22, fontFamily: "nunito" },
  strong: { fontFamily: "nunitoBold" },
  link: { color: P.selectedText, textDecorationLine: "underline" },
  code_inline: { backgroundColor: P.selectedBg, color: P.selectedText, borderRadius: 4, paddingHorizontal: 4 },
  fence: { backgroundColor: P.selectedBg, color: P.text, borderWidth: 0, borderRadius: 10, fontSize: 13 },
  code_block: { backgroundColor: P.selectedBg, color: P.text, borderWidth: 0, borderRadius: 10, fontSize: 13 },
  table: { borderColor: P.border, borderRadius: 8 },
  th: { padding: 6, borderColor: P.border },
  td: { padding: 6, borderColor: P.border },
  tr: { borderColor: P.border },
  heading4: { color: P.text, fontFamily: "nunitoBold", fontSize: 16 },
  hr: { backgroundColor: P.border },
  paragraph: { marginTop: 2, marginBottom: 6 },
});
