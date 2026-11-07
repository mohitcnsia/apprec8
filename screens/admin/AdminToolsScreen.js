// screens/admin/AdminToolsScreen.js
// Admin tools (admin only, opened from Me): the Dashboard and the content seed buttons that used to
// sit on the Profile screen. Firestore rules still block writes for everyone else.

import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { SEEN_MESSAGES_KEY } from "../../hooks/useInAppMessaging";
import SeedDataFixButton from "../../components/quiz/SeedDataFixButton";
import SeedQuestNodesButton from "../../components/quiz/SeedQuestNodesButton";
import SeedTileQuestButton from "../../components/quiz/SeedTileQuestButton";
import { QUESTS } from "../../data/quests";
import SeedDataButton from "../../components/quiz/SeedDataButton";
import FixIeoQuestionsButton from "../../components/quiz/FixIeoQuestionsButton";
import DemoSchoolButton from "../../components/admin/DemoSchoolButton";

export default function AdminToolsScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID;

  if (!isAdmin) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Text style={styles.soft}>Admin only.</Text>
      </View>
    );
  }

  const resetSeenMessages = async () => {
    try {
      await AsyncStorage.removeItem(SEEN_MESSAGES_KEY);
      alert("Seen messages cleared. Restart the app to see the pop-up again.");
    } catch (e) {
      alert("Could not clear the seen messages list.");
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Admin tools</Text>

      <Pressable onPress={() => navigation.navigate("OwnerNotes")} style={styles.row} accessibilityRole="button">
        <Ionicons name="document-text-outline" size={20} color={P.selectedText} />
        <Text style={styles.rowText}>My notes (launch checklist, testing)</Text>
        <Ionicons name="chevron-forward" size={20} color={P.dimText} />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("IdeasReports")} style={styles.row} accessibilityRole="button">
        <Ionicons name="bulb-outline" size={20} color={P.selectedText} />
        <Text style={styles.rowText}>Ideas & reports (feedback, 🚩, polls)</Text>
        <Ionicons name="chevron-forward" size={20} color={P.dimText} />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("TeacherStart")} style={styles.row} accessibilityRole="button">
        <Ionicons name="school-outline" size={20} color={P.selectedText} />
        <Text style={styles.rowText}>Teachers' one-pager (Seema's start; share it)</Text>
        <Ionicons name="chevron-forward" size={20} color={P.dimText} />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("AdminDashboard")} style={styles.row} accessibilityRole="button">
        <Ionicons name="stats-chart-outline" size={20} color={P.selectedText} />
        <Text style={styles.rowText}>Dashboard (also in Progress → Kids)</Text>
        <Ionicons name="chevron-forward" size={20} color={P.dimText} />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Schools")} style={styles.row} accessibilityRole="button">
        <Ionicons name="school-outline" size={20} color={P.selectedText} />
        <Text style={styles.rowText}>Schools & classes (codes, teachers)</Text>
        <Ionicons name="chevron-forward" size={20} color={P.dimText} />
      </Pressable>
      <Pressable onPress={resetSeenMessages} style={styles.row} accessibilityRole="button">
        <Ionicons name="refresh-outline" size={20} color={P.selectedText} />
        <Text style={styles.rowText}>Reset seen pop-up messages</Text>
      </Pressable>

      <Text style={styles.section}>DEMO SCHOOL (made-up class)</Text>
      <View style={styles.card}>
        <DemoSchoolButton P={P} />
      </View>

      <Text style={styles.section}>SEED CONTENT (writes to live Firestore)</Text>
      <View style={styles.card}>
        {/* One button per tile quest (data/quests/index.js). Draft quests seed for testers only. */}
        {QUESTS.map((data) => (
          <SeedTileQuestButton key={data.QUEST_ID} data={data} />
        ))}
        {/* Corrections to old IEO questions reused by English Quest (data/fixes/ieoFixes.js) */}
        <FixIeoQuestionsButton />
        <SeedQuestNodesButton />
        <SeedDataFixButton />
        <SeedDataButton />
      </View>
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: insets.bottom + 28, gap: 12 },
    h1: { fontSize: 28, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    section: { fontSize: 13, fontFamily: "nunitoBold", color: P.label, letterSpacing: 1, marginTop: 8 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 14,
      minHeight: 56,
      borderRadius: 16,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
    },
    rowText: { flex: 1, fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    card: { padding: 12, borderRadius: 18, backgroundColor: P.card, borderWidth: 2, borderColor: P.border, gap: 10 },
  });
