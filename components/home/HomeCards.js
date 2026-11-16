// components/home/HomeCards.js: cards from Apprec8 / team tasks on Home, right under the greeting (owner-approved
// mockup, 16 Nov 2026). Safety amber, story lilac, fact blue, task green. Open → the card's own pages; ✕ closes it;
// a task stays until Done.
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import AppButton from "../common/AppButton";
import { listenMyCards, setCardStatus } from "../../services/cardsApi";

const LOOK = {
  safety: { icon: "shield-checkmark-outline", label: "SAFETY", light: ["#FFF4D6", "#7A5300"], dark: ["#3A2E12", "#F2D48A"] },
  story: { icon: "book-outline", label: "STORY", light: ["#F3E6F4", "#3b0940"], dark: ["#3A2340", "#E6C3EA"] },
  fact: { icon: "bulb-outline", label: "FACT", light: ["#E3F0FA", "#1B4E72"], dark: ["#1B2640", "#A9C8F0"] },
  task: { icon: "checkbox-outline", label: "TASK", light: ["#E6F6E4", "#1E5E1B"], dark: ["#1F3322", "#A8DCA5"] },
  other: { icon: "sparkles-outline", label: "FOR YOU", light: ["#F3E6F4", "#3b0940"], dark: ["#3A2340", "#E6C3EA"] },
};
export const cardLook = (kind, isDark) => {
  const l = LOOK[kind] || LOOK.other;
  const [bg, fg] = isDark ? l.dark : l.light;
  return { ...l, bg, fg };
};
const dueText = (dueAt) => {
  if (!dueAt) return null;
  const d = Math.round((new Date(dueAt).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5);
  return d < 0 ? "Was due, still open" : d === 0 ? "Due today" : d === 1 ? "Due tomorrow" : `Due in ${d} days`;
};

export default function HomeCards() {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  useEffect(() => listenMyCards(setCards), []);
  if (!cards.length) return null;
  return (
    <View style={{ gap: 12 }}>
      {cards.slice(0, 2).map((c) => {
        const L = cardLook(c.kind, isDark);
        const task = c.kind === "task";
        const open = () => navigation.navigate("CardReader", { card: c });
        const from = task ? `TASK${c.hat ? ` · AS ${c.hat.toUpperCase()}` : ""} · FROM ${String(c.from || "Apprec8").toUpperCase()}` : `${L.label} · FROM APPREC8`;
        return (
          <View key={c.id} style={[s.card, { backgroundColor: L.bg }]} accessibilityLabel={`${L.label}: ${c.title}`}>
            <View style={s.top}>
              <Ionicons name={L.icon} size={18} color={L.fg} />
              <Text style={[s.label, { color: L.fg }]} numberOfLines={1}>{from}</Text>
              {!task ? (
                <Pressable onPress={() => setCardStatus(c.id, "closed")} accessibilityRole="button" accessibilityLabel="Close this card" hitSlop={10} style={s.close}>
                  <Ionicons name="close" size={18} color={L.fg} />
                </Pressable>
              ) : null}
            </View>
            <Text style={[s.title, { color: isDark ? "#F4EDF5" : "#241027" }]}>{c.title}</Text>
            {c.text ? <Text style={[s.text, { color: isDark ? "#CDBFD0" : "#4A3550" }]}>{c.text}</Text> : null}
            {task && dueText(c.dueAt) ? <Text style={[s.due, { color: "#7A5300", backgroundColor: "#FFF4D6" }]}>{dueText(c.dueAt)}</Text> : null}
            <View style={s.actions}>
              {task && c.cards?.length ? <AppButton variant="soft" label="Open" onPress={open} /> : null}
              {task ? (
                <AppButton icon="checkmark" label="Done" onPress={() => setCardStatus(c.id, "done")} />
              ) : (
                <AppButton icon="arrow-forward" iconSide="right" label="Open" onPress={open} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, gap: 8 },
  top: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { flex: 1, fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 1.2 },
  close: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 19, lineHeight: 26, fontFamily: "nunitoBold" },
  text: { fontSize: 15, lineHeight: 22, fontFamily: "nunito" },
  due: { alignSelf: "flex-start", fontSize: 12, fontFamily: "nunitoBold", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: "hidden" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 4 },
});
