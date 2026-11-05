// screens/guides/GuidesScreen.js
// Me → Guides (mockup W1, owner-approved 2026-11-05): the guides this person can do, with progress. Learn by doing:
// each step opens the real screen and ticks itself from real data.

import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "../admin/schoolUi";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { guidesFor, guideState } from "../../utils/guides";
import { loadGuideFacts } from "../../services/guideFacts";

export default function GuidesScreen({ route, navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const uid = authInstance.currentUser?.uid;
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && uid === APPREC8_TEAM_REVIEWER_UID;
  const guides = guidesFor({ isAdmin, isChild: !!route.params?.isChild });
  const [states, setStates] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      Promise.all(guides.map(async (g) => [g.id, guideState(g, await loadGuideFacts(g.id))])).then((list) => alive && setStates(Object.fromEntries(list)));
      return () => {
        alive = false;
      };
    }, [guides.length]) // eslint-disable-line react-hooks/exhaustive-deps
  );

  const current = guides.find((g) => states?.[g.id] && !states[g.id].finished && states[g.id].doneCount > 0) || guides.find((g) => states?.[g.id] && !states[g.id].finished) || null;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: "flex-end" }]}>
        <Text style={styles.h1}>Guides</Text>
        <Text style={styles.soft}>Learn by doing. Each step opens the real screen and ticks itself when you finish.</Text>
        {states === null ? <ActivityIndicator color={P.label} /> : null}
        {guides.map((g) => {
          const st = states?.[g.id];
          const pct = st ? Math.round((st.doneCount / st.total) * 100) : 0;
          const on = current?.id === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => navigation.navigate("Guide", { guideId: g.id })}
              accessibilityRole="button"
              accessibilityLabel={`${g.title}, ${st ? `${st.doneCount} of ${st.total} steps done` : ""}`}
              style={[styles.card, { flexDirection: "row", alignItems: "center" }, on && { borderColor: P.selectedBorder }]}
            >
              <Text style={{ fontSize: 30 }}>{g.icon}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.text}>{g.title}</Text>
                <Text style={styles.small}>
                  {g.who} · {g.steps.length} steps
                </Text>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: P.border, overflow: "hidden" }}>
                  <View style={{ width: `${pct}%`, height: "100%", backgroundColor: P.primary }} />
                </View>
              </View>
              <Text style={styles.soft}>{st ? (st.finished ? "✓" : `${st.doneCount}/${st.total}`) : ""}</Text>
            </Pressable>
          );
        })}
        {!guides.length ? <Text style={styles.soft}>No guides for you yet.</Text> : null}
      </ScrollView>
      {current ? (
        <View style={styles.footer}>
          <MainButton label={`CONTINUE: ${current.title.toUpperCase()}`} onPress={() => navigation.navigate("Guide", { guideId: current.id })} styles={styles} P={P} />
        </View>
      ) : null}
    </View>
  );
}
