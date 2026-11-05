// screens/guides/GuideScreen.js
// One guide (mockups W2 + W4, owner-approved 2026-11-05): its steps, ticked from real data each time the screen opens.
// "DO STEP n" turns on the guide strip (components/guides/GuideStrip.js) and opens the real screen. Coming back after
// finishing a step shows "Step n done!" with the next one (W4).

import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "../admin/schoolUi";
import { guideById, guideState, newlyDone } from "../../utils/guides";
import { loadGuideFacts } from "../../services/guideFacts";
import { setActiveGuide } from "../../services/guideActive";

const seen = new Map(); // guideId → ids done at the last look (this app session)

export default function GuideScreen({ route, navigation }) {
  const guide = guideById(route.params?.guideId);
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const [st, setSt] = useState(null);
  const [justDone, setJustDone] = useState(null);
  const alive = useRef(true);

  useFocusEffect(
    useCallback(() => {
      alive.current = true;
      if (guide) {
        loadGuideFacts(guide.id).then((facts) => {
          if (!alive.current) return;
          const next = guideState(guide, facts);
          const doneIds = next.steps.filter((s) => s.state === "done").map((s) => s.id);
          const fresh = seen.has(guide.id) ? newlyDone(seen.get(guide.id), doneIds) : [];
          seen.set(guide.id, doneIds);
          setJustDone(fresh.length ? next.steps.find((s) => s.id === fresh[fresh.length - 1]) : null);
          setSt(next);
        });
      }
      return () => {
        alive.current = false;
      };
    }, [guide])
  );

  if (!guide) return <View style={styles.screen} />;

  const doStep = (s) => {
    setActiveGuide({ guideId: guide.id, stepId: s.id, n: s.n, total: guide.steps.length, hint: s.hint });
    if (s.go.tab) navigation.navigate(s.go.tab, { screen: "ProgressScreen", params: { view: s.go.view || "classes" } });
    else navigation.navigate(s.go.screen);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: "flex-end", gap: 8 }]}>
        {justDone ? (
          <View style={[styles.card, { alignItems: "center", gap: 6, marginBottom: 8 }]} accessibilityLiveRegion="polite">
            <Text style={{ fontSize: 48 }}>✅</Text>
            <Text style={styles.title}>Step {justDone.n} done!</Text>
            <Text style={[styles.soft, { textAlign: "center" }]}>{justDone.title}</Text>
          </View>
        ) : null}
        <Text style={styles.small}>
          {guide.icon} GUIDE · {st ? `${st.doneCount} of ${st.total} done` : "…"}
        </Text>
        <Text style={styles.h1}>{guide.title}</Text>
        {st === null ? <ActivityIndicator color={P.label} /> : null}
        {(st?.steps || []).map((s) =>
          s.state === "now" ? (
            <View key={s.id} style={[styles.card, { flexDirection: "row", borderColor: P.selectedBorder, gap: 12 }]}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" }}>
                <Text style={[styles.text, { color: P.onPrimary }]}>{s.n}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.text}>{s.title}</Text>
                <Text style={styles.small}>{s.why}</Text>
                {s.waiting ? <Text style={[styles.small, { color: P.gold }]}>⏳ {s.waiting}</Text> : null}
              </View>
            </View>
          ) : (
            <Pressable key={s.id} onPress={() => doStep(s)} accessibilityRole="button" style={[styles.row, { opacity: s.state === "done" ? 0.6 : 1 }]}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: s.state === "done" ? P.correctBg : "transparent",
                  borderWidth: s.state === "done" ? 0 : 2,
                  borderColor: P.border,
                }}
              >
                <Text style={[styles.text, { color: s.state === "done" ? P.correctText : P.textSoft }]}>{s.state === "done" ? "✓" : s.n}</Text>
              </View>
              <Text style={[styles.text, { flex: 1, color: s.state === "done" ? P.text : P.textSoft }, s.state === "done" && { textDecorationLine: "line-through" }]}>{s.title}</Text>
            </Pressable>
          )
        )}
        {st?.finished ? <Text style={[styles.title, { textAlign: "center", marginTop: 8 }]}>All done! 🎉</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        {st?.now ? <MainButton label={`DO STEP ${st.now.n} ▶`} onPress={() => doStep(st.now)} styles={styles} P={P} /> : null}
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" style={{ alignItems: "center", padding: 10 }}>
          <Text style={styles.soft}>{st?.finished ? "Back" : "I'll do it later"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
