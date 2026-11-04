// screens/admin/ClassDetailScreen.js
// One class (mockup L3, owner-approved 2026-11-05): its code, who is waiting for approval (children added by a parent,
// and teachers who used an invite code), the teachers, the kids, and one big SHARE CODE button in the thumb zone.
// Sharing uses the phone's share menu, so the admin picks WhatsApp, SMS or anything else (owner: "let the sharer decide").

import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "./schoolUi";
import { getClasses, classMembers, approveMember, classTeam, decideTeacherRequest } from "../../services/classesApi";
import { SUBJECT_NAMES, classCodeMessage, classSubjects } from "../../utils/classes";

const names = (subs = []) => subs.map((s) => SUBJECT_NAMES[s] || s).join(", ");

export default function ClassDetailScreen({ route, navigation }) {
  const { classId } = route.params || {};
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);

  const [cls, setCls] = useState(null);
  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState(null); // { teachers, requests } | { failed: true }
  const [busyId, setBusyId] = useState(null);
  const [showKids, setShowKids] = useState(false);

  const load = useCallback(async () => {
    try {
      const [c] = await getClasses([classId]);
      setCls(c || { missing: true });
      setMembers(await classMembers(classId).catch(() => []));
    } catch (e) {
      setCls({ missing: true });
    }
    try {
      setTeam(await classTeam(classId));
    } catch (e) {
      setTeam({ failed: true }); // the server update (DR-11) isn't deployed yet
    }
  }, [classId]);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const decide = async (id, fn) => {
    setBusyId(id);
    try {
      await fn();
      await load();
    } catch (e) {
      Alert.alert("Couldn't do that", e?.message || String(e));
    }
    setBusyId(null);
  };
  const confirmDecline = (who, onYes) =>
    Alert.alert(`Decline ${who}?`, "They can ask again with the code.", [
      { text: "Cancel", style: "cancel" },
      { text: "Decline", style: "destructive", onPress: onYes },
    ]);

  if (!cls) {
    return (
      <View style={[styles.screen, { justifyContent: "center" }]}>
        <ActivityIndicator color={P.label} />
      </View>
    );
  }
  if (cls.missing) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Text style={styles.soft}>This class was not found.</Text>
      </View>
    );
  }

  const pendingKids = members.filter((m) => m.status === "pending");
  const kids = members.filter((m) => m.status === "approved");
  const requests = team?.requests || [];
  const waiting = pendingKids.length + requests.length;
  const shareCode = () =>
    Share.share({ message: classCodeMessage({ className: cls.name, schoolName: cls.schoolName, code: cls.joinCode }) }).catch(() => {});

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.h1}>{cls.name}</Text>
          <Text style={styles.soft}>{[cls.schoolName, `Class ${cls.grade}`, names(classSubjects(cls))].filter(Boolean).join(" · ")}</Text>
        </View>

        <View style={styles.codeCard} accessible accessibilityLabel={`Class code ${String(cls.joinCode).split("").join(" ")}`}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CLASS CODE</Text>
            <Text style={styles.code} selectable>
              {cls.joinCode}
            </Text>
          </View>
        </View>

        <Text style={styles.label}>WAITING FOR YOU ({waiting})</Text>
        {waiting === 0 ? (
          <Text style={styles.dim}>Nobody is waiting. Share the code below with parents.</Text>
        ) : (
          <View style={styles.listCard}>
            {pendingKids.map((m, i) => (
              <View key={m.uid}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>{m.firstName || "Child"}</Text>
                    <Text style={styles.small}>{m.parentName ? `Added by ${m.parentName}${m.relation ? ` (${m.relation})` : ""}` : "Added by a parent"}</Text>
                  </View>
                  <Pressable
                    onPress={() => confirmDecline(m.firstName || "this child", () => decide(m.uid, () => approveMember({ classId, kidUid: m.uid, approve: false })))}
                    accessibilityRole="button"
                    accessibilityLabel={`Decline ${m.firstName || "child"}`}
                    style={styles.iconButton}
                  >
                    <Ionicons name="close" size={20} color={P.textSoft} />
                  </Pressable>
                  <Pressable onPress={() => decide(m.uid, () => approveMember({ classId, kidUid: m.uid, approve: true }))} accessibilityRole="button" style={styles.smallButton}>
                    {busyId === m.uid ? <ActivityIndicator color={P.selectedText} /> : <Text style={styles.smallButtonText}>Approve</Text>}
                  </Pressable>
                </View>
              </View>
            ))}
            {requests.map((r, i) => (
              <View key={`t-${r.uid}`}>
                {i > 0 || pendingKids.length ? <View style={styles.divider} /> : null}
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>{r.firstName}</Text>
                    <Text style={styles.small}>Wants to teach {names(r.subjects) || "here"}</Text>
                  </View>
                  <Pressable
                    onPress={() => confirmDecline(r.firstName, () => decide(r.uid, () => decideTeacherRequest({ classId, uid: r.uid, approve: false })))}
                    accessibilityRole="button"
                    accessibilityLabel={`Decline ${r.firstName}`}
                    style={styles.iconButton}
                  >
                    <Ionicons name="close" size={20} color={P.textSoft} />
                  </Pressable>
                  <Pressable onPress={() => decide(r.uid, () => decideTeacherRequest({ classId, uid: r.uid, approve: true }))} accessibilityRole="button" style={styles.smallButton}>
                    {busyId === r.uid ? <ActivityIndicator color={P.selectedText} /> : <Text style={styles.smallButtonText}>Approve</Text>}
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.label}>TEACHERS</Text>
        <View style={styles.listCard}>
          {team?.teachers?.length
            ? team.teachers.map((t) => (
                <View key={t.uid}>
                  <View style={styles.row}>
                    <Text style={[styles.text, { flex: 1 }]}>{t.firstName}</Text>
                    <Text style={styles.small}>{names(t.subjects)}</Text>
                  </View>
                  <View style={styles.divider} />
                </View>
              ))
            : null}
          {team?.failed && (cls.teacherIds || []).length ? (
            <>
              <View style={styles.row}>
                <Text style={styles.small}>{(cls.teacherIds || []).length} teacher(s). Names show after the next server update.</Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : null}
          <Pressable
            onPress={() => navigation.navigate("InviteTeacher", { classId, className: cls.name, schoolName: cls.schoolName, subjects: classSubjects(cls) })}
            accessibilityRole="button"
            style={[styles.link, { minHeight: 52 }]}
          >
            <Ionicons name="add" size={20} color={P.selectedText} />
            <Text style={styles.linkText}>Invite a teacher</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setShowKids((v) => !v)} accessibilityRole="button" accessibilityState={{ expanded: showKids }} style={[styles.listCard, styles.row, { paddingVertical: 0 }]}>
          <Text style={[styles.text, { flex: 1 }]}>Kids in this class</Text>
          <Text style={styles.soft}>{kids.length}</Text>
          <Ionicons name={showKids ? "chevron-up" : "chevron-down"} size={18} color={P.textSoft} />
        </Pressable>
        {showKids && kids.length ? <Text style={styles.soft}>{kids.map((k) => k.firstName || "Child").join(", ")}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={[styles.dim, { textAlign: "center" }]}>WhatsApp, SMS, anything. Parents enter the code when they add their child.</Text>
        <MainButton label="SHARE CODE" onPress={shareCode} styles={styles} P={P} />
      </View>
    </View>
  );
}
