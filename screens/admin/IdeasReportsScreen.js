// screens/admin/IdeasReportsScreen.js
// Admin tools → "Ideas & reports": userFeedback + 🚩 reports + poll answers (G66).
// Newest first, filter by type, with a "✓ Done" toggle for the owner.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, updateDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { timeAgo } from "../../utils/kidStats";
import { showAlert } from "../../services/dialog";

const db = getFirestore(getApp());

const FILTERS = [
  { id: "all", label: "All" },
  { id: "ideas", label: "Ideas 💡" },
  { id: "mistakes", label: "Mistakes 🚩" },
  { id: "contact", label: "Contact 💬" },
  { id: "polls", label: "Polls 📊" },
];

export default function IdeasReportsScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID;

  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const q = query(collection(db, "userFeedback"), orderBy("createdAt", "desc"), limit(100));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    } catch (e) {
      console.error("Failed to load feedback:", e);
      showAlert("Couldn't load reports", e.message);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin, load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const toggleDone = async (item) => {
    const nextStatus = item.status === "done" ? "new" : "done";
    setUpdatingId(item.id);
    // Optimistic local update
    setItems((prev) =>
      (prev || []).map((x) => (x.id === item.id ? { ...x, status: nextStatus } : x))
    );
    try {
      await updateDoc(doc(db, "userFeedback", item.id), { status: nextStatus });
    } catch (e) {
      showAlert("Couldn't update status", e.message);
      load(); // revert
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Text style={styles.soft}>Admin only.</Text>
      </View>
    );
  }

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((x) => {
      if (filter === "all") return true;
      if (filter === "ideas") return x.feedbackType === "idea";
      if (filter === "mistakes") return x.feedbackType === "issue_report" || x.entryPoint === "report_flag";
      if (filter === "contact") return x.entryPoint === "cntct" || x.feedbackType === "contact";
      if (filter === "polls") return x.entryPoint === "chamak_asks" || x.feedbackType === "poll";
      return true;
    });
  }, [items, filter]);

  const openCount = (items || []).filter((x) => x.status !== "done").length;

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn} accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={P.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Ideas & reports</Text>
          <Text style={styles.sub}>{openCount} open {openCount === 1 ? "item" : "items"}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[styles.filterChip, filter === f.id && styles.filterChipOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === f.id }}
            >
              <Text style={[styles.filterText, filter === f.id && styles.filterTextOn]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={P.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[P.primary]} tintColor={P.primary} />}
        >
          {!filtered.length ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>📭</Text>
              <Text style={styles.emptyTitle}>No items here</Text>
              <Text style={styles.soft}>Everything in this filter is caught up.</Text>
            </View>
          ) : (
            filtered.map((item) => {
              const isDone = item.status === "done";
              const isIdea = item.feedbackType === "idea";
              const isMistake = item.feedbackType === "issue_report" || item.entryPoint === "report_flag";
              const isPoll = item.entryPoint === "chamak_asks" || item.feedbackType === "poll";

              let typeBadge = "💬 FEEDBACK";
              let badgeColor = P.textSoft;
              if (isIdea) {
                typeBadge = "💡 IDEA";
                badgeColor = P.gold || "#D9A700";
              } else if (isMistake) {
                typeBadge = "🚩 MISTAKE";
                badgeColor = P.wrongText || "#E53935";
              } else if (isPoll) {
                typeBadge = "📊 POLL";
                badgeColor = P.primary;
              }

              const timeMs = item.createdAt?.toDate ? item.createdAt.toDate().getTime() : Date.now();
              const sender = `${item.userName || "Student"}${Number.isInteger(item.userGrade) ? ` · Class ${item.userGrade}` : ""}`;

              return (
                <View key={item.id} style={[styles.card, isDone && styles.cardDone]}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.typeBadge, { borderColor: badgeColor }]}>
                        <Text style={[styles.typeText, { color: badgeColor }]}>{typeBadge}</Text>
                      </View>
                      <Text style={styles.timeText}>{timeAgo(timeMs)}</Text>
                    </View>

                    {/* Done Action Toggle */}
                    <TouchableOpacity
                      onPress={() => toggleDone(item)}
                      disabled={updatingId === item.id}
                      style={[styles.doneBtn, isDone ? styles.doneBtnChecked : styles.doneBtnUnchecked]}
                      accessibilityRole="button"
                      accessibilityLabel={isDone ? "Mark as new" : "Mark as done"}
                    >
                      <Text style={[styles.doneBtnText, isDone && { color: P.onPrimary }]}>
                        {isDone ? "✓ Done" : "Mark done"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Sender Details */}
                  <Text style={styles.senderText}>{sender}</Text>

                  {/* Specific content by type */}
                  {isIdea ? (
                    <View style={styles.contentBox}>
                      {item.promptQuestion ? (
                        <Text style={styles.promptQuestion}>"{item.promptQuestion}"</Text>
                      ) : null}
                      <View style={styles.choiceRow}>
                        <Text style={{ fontSize: 20 }}>{item.choiceEmoji || "💡"}</Text>
                        <Text style={styles.choiceText}>{item.selectedChoice || "No choice tapped"}</Text>
                      </View>
                      {item.feedbackText ? (
                        <Text style={styles.noteText}>"{item.feedbackText}"</Text>
                      ) : null}
                    </View>
                  ) : isMistake ? (
                    <View style={styles.contentBox}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.targetId} numberOfLines={1}>
                          {item.contentContext?.id || item.questId || "Question"}
                        </Text>
                        <Text style={[styles.reasonBadge, { color: P.wrongText }]}>
                          {String(item.childReason || item.issueCategory || "Issue").replace(/_/g, " ")}
                        </Text>
                      </View>
                      {item.contentContext?.titlePreview ? (
                        <Text style={styles.previewText} numberOfLines={2}>
                          {item.contentContext.titlePreview}
                        </Text>
                      ) : null}
                      {item.feedbackText ? (
                        <Text style={styles.noteText}>"{item.feedbackText}"</Text>
                      ) : null}
                    </View>
                  ) : (
                    <View style={styles.contentBox}>
                      <Text style={styles.generalText}>{item.feedbackText || "No text provided"}</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    header: {
      paddingTop: insets.top + 10,
      paddingHorizontal: 16,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: P.bg,
      borderBottomWidth: 1,
      borderBottomColor: P.border,
    },
    backBtn: { padding: 4 },
    h1: { fontSize: 22, fontFamily: "nunitoBold", color: P.text },
    sub: { fontSize: 13, fontFamily: "nunito", color: P.textSoft },
    filterBar: { backgroundColor: P.bg, borderBottomWidth: 1, borderBottomColor: P.border },
    filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
    filterChip: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: P.card,
      borderWidth: 1.5,
      borderColor: P.border,
    },
    filterChipOn: { backgroundColor: P.primary, borderColor: P.primary },
    filterText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    filterTextOn: { color: P.onPrimary },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    list: { flex: 1 },
    listContent: { padding: 16, gap: 12, paddingBottom: insets.bottom + 24 },
    empty: { alignItems: "center", paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontFamily: "nunitoBold", color: P.text, marginBottom: 4 },
    soft: { fontSize: 14, fontFamily: "nunito", color: P.textSoft },
    card: {
      backgroundColor: P.card,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: P.border,
      padding: 14,
      gap: 8,
    },
    cardDone: {
      opacity: 0.65,
      backgroundColor: P.track || P.card,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    badgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    typeBadge: {
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: 2,
      paddingHorizontal: 6,
    },
    typeText: { fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 0.5 },
    timeText: { fontSize: 12, fontFamily: "nunito", color: P.textSoft },
    doneBtn: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1.5,
    },
    doneBtnUnchecked: {
      borderColor: P.border,
      backgroundColor: P.bg,
    },
    doneBtnChecked: {
      borderColor: P.primary,
      backgroundColor: P.primary,
    },
    doneBtnText: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      color: P.textSoft,
    },
    senderText: {
      fontSize: 15,
      fontFamily: "nunitoBold",
      color: P.text,
    },
    contentBox: {
      backgroundColor: P.bg,
      borderRadius: 12,
      padding: 10,
      gap: 6,
    },
    promptQuestion: {
      fontSize: 13,
      fontFamily: "nunito",
      color: P.textSoft,
      fontStyle: "italic",
    },
    choiceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    choiceText: {
      fontSize: 15,
      fontFamily: "nunitoBold",
      color: P.text,
      flex: 1,
    },
    noteText: {
      fontSize: 14,
      fontFamily: "nunito",
      color: P.text,
      marginTop: 4,
      paddingLeft: 6,
      borderLeftWidth: 3,
      borderLeftColor: P.primary,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    targetId: {
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: P.textSoft,
      flex: 1,
    },
    reasonBadge: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      textTransform: "capitalize",
    },
    previewText: {
      fontSize: 14,
      fontFamily: "nunito",
      color: P.text,
    },
    generalText: {
      fontSize: 14,
      fontFamily: "nunito",
      color: P.text,
    },
  });

