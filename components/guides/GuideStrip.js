// components/guides/GuideStrip.js
// The guide strip (mockup W3): while a guide step is being done, a small strip at the top of every screen says what to
// tap. "Guide ›" goes back to the guide (which ticks the step from real data); ✕ stops; tapping the text folds it.

import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { navRef, navigateTo } from "../../navigation/navRef";
import { useActiveGuide, setActiveGuide } from "../../services/guideActive";

const HIDDEN_ON = new Set(["Guide", "Guides"]);

export default function GuideStrip() {
  const active = useActiveGuide();
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const [route, setRoute] = useState(null);
  const [folded, setFolded] = useState(false);

  useEffect(() => {
    const update = () => setRoute(navRef.isReady() ? navRef.getCurrentRoute()?.name || null : null);
    update();
    return navRef.addListener("state", update);
  }, []);
  useEffect(() => setFolded(false), [active?.stepId]);

  if (!active || HIDDEN_ON.has(route)) return null;
  const back = () => navigateTo("Profile", { screen: "Guide", params: { guideId: active.guideId } });

  if (folded) {
    return (
      <Pressable onPress={() => setFolded(false)} style={styles.pill} accessibilityRole="button" accessibilityLabel="Show the guide tip">
        <Text style={styles.pillText}>🧭 Step {active.n}/{active.total}</Text>
      </Pressable>
    );
  }
  return (
    <View style={styles.strip} accessibilityLiveRegion="polite">
      <Text style={styles.icon}>🧭</Text>
      <Pressable onPress={() => setFolded(true)} style={{ flex: 1 }} accessibilityRole="button" accessibilityHint="Folds the tip">
        <Text style={styles.label}>
          GUIDE · STEP {active.n} OF {active.total}
        </Text>
        <Text style={styles.hint}>{active.hint}</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable onPress={back} hitSlop={8} accessibilityRole="button" style={styles.backBtn}>
          <Text style={styles.backText}>Guide ›</Text>
        </Pressable>
        <Pressable onPress={() => setActiveGuide(null)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Stop the guide tip">
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    strip: {
      position: "absolute",
      top: insets.top + 6,
      left: 12,
      right: 12,
      flexDirection: "row",
      gap: 10,
      alignItems: "flex-start",
      padding: 12,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: P.selectedBorder,
      backgroundColor: P.card,
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    icon: { fontSize: 20 },
    label: { fontSize: 12, letterSpacing: 1, fontFamily: "nunitoBold", color: P.label },
    hint: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold", color: P.text, marginTop: 2 },
    actions: { alignItems: "flex-end", gap: 10 },
    backBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: P.selectedBg },
    backText: { fontSize: 13, fontFamily: "nunitoBold", color: P.selectedText },
    close: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    pill: {
      position: "absolute",
      top: insets.top + 6,
      right: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: P.selectedBorder,
      backgroundColor: P.card,
      elevation: 6,
    },
    pillText: { fontSize: 13, fontFamily: "nunitoBold", color: P.selectedText },
  });
