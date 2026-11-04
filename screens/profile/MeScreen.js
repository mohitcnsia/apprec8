// screens/profile/MeScreen.js
// Me tab (owner-approved mockup "F · Me", 2026-11-04): replaces the cluttered Profile screen.
// Profile card · My stuff (Reminders, Messages) · Look (theme) · Help · Admin tools (admin only) · Sign out.
// Stats moved to the Progress tab; seed buttons moved to Admin tools; the "Quest Mode (V2)" switch is gone
// (the Space quest is always on Home now). Old screens/quiz/ProfileScreen.js is no longer used.

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import firestore from "@react-native-firebase/firestore";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { helpTopics } from "../../data/app-topic-data";
import { TasksContext } from "../../store/tasks-context";
import { getClasses } from "../../services/classesApi";
import { myChildren } from "../../services/familyApi";
import PlayAsChildSheet from "./PlayAsChildSheet";
import { classLabel, MAX_CLASSES } from "../../utils/classes";

const THEMES = [
  ["system", "Phone setting"],
  ["light", "Light"],
  ["dark", "Dark"],
];

const nameOf = (doc, auth) => {
  const first = doc?.firstName?.trim();
  const last = doc?.lastName?.trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (doc?.username) return doc.username;
  if (auth?.displayName) return auth.displayName;
  if (auth?.email) return auth.email.split("@")[0];
  return "Me";
};

function Row({ icon, label, detail, onPress, styles, P, danger = false }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <View style={[styles.rowIcon, danger && { backgroundColor: P.wrongBg }]}>
        <Ionicons name={icon} size={20} color={danger ? P.wrongText : P.selectedText} />
      </View>
      <Text style={[styles.rowText, danger && { color: P.wrongText }]}>{label}</Text>
      {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      {danger ? null : <Ionicons name="chevron-forward" size={20} color={P.dimText} />}
    </Pressable>
  );
}

export default function MeScreen({ navigation, signoutHandler }) {
  const { isDark, themeChoice, setThemeChoice } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const { tasks = [] } = useContext(TasksContext) || {};

  const auth = authInstance.currentUser;
  const uid = auth?.uid || null;
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && uid === APPREC8_TEAM_REVIEWER_UID;
  const [userData, setUserData] = useState(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [myClasses, setMyClasses] = useState([]);
  const [children, setChildren] = useState([]);
  const [playKid, setPlayKid] = useState(null); // "Play as" sheet (mockup N1)
  const childKey = (userData?.childUids || []).join(",");
  useEffect(() => {
    if (!childKey) return setChildren([]);
    myChildren(childKey.split(",")).then(setChildren).catch(() => setChildren([]));
  }, [childKey]);
  const classKey = (userData?.classIds || []).join(",");
  const pendingKey = (userData?.pendingClassIds || []).join(",");
  const [pendingClasses, setPendingClasses] = useState([]);
  useEffect(() => {
    if (!classKey) return setMyClasses([]);
    getClasses(classKey.split(",")).then(setMyClasses).catch(() => setMyClasses([]));
  }, [classKey]);
  useEffect(() => {
    if (!pendingKey) return setPendingClasses([]);
    getClasses(pendingKey.split(",")).then(setPendingClasses).catch(() => setPendingClasses([]));
  }, [pendingKey]);

  useEffect(() => {
    if (!uid) return undefined;
    return firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot(
        (snap) => setUserData(snap.exists() ? snap.data() : null),
        (e) => console.warn("MeScreen: user doc failed", e)
      );
  }, [uid]);

  const name = nameOf(userData, auth);
  const photo = userData?.photoURL || auth?.photoURL || null;
  const activeReminders = tasks.filter((t) => t.userId === uid && !t.completed).length;
  const version = Constants.expoConfig?.version || "";

  const editProfile = () =>
    navigation.navigate("EditProfile", {
      currentFirstName: userData?.firstName || "",
      currentLastName: userData?.lastName || "",
      currentPhotoURL: userData?.photoURL || "",
      currentProfileLastSavedAt: userData?.profileLastSavedAt || null,
      currentGrade: userData?.grade ?? null,
    });

  const openHelp = () =>
    navigation.navigate("LinkScreen", {
      data: helpTopics,
      title: "Help & Support",
      userEmail: userData?.email || auth?.email || "",
    });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Profile card */}
      <View style={styles.card}>
        {/* Big picture + name (Pratha 2026-11-04: "kids love to see their pictures") */}
        <View style={styles.profileRow}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarLetter]}>
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.name} numberOfLines={2}>{name}</Text>
            {userData?.grade ? <Text style={styles.soft}>Class {userData.grade}</Text> : null}
            {auth?.email ? <Text style={styles.soft} numberOfLines={1}>{auth.email}</Text> : null}
          </View>
        </View>
        <Pressable onPress={editProfile} style={styles.outlineButton} accessibilityRole="button" disabled={!userData}>
          <Text style={styles.outlineButtonText}>Edit profile</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>MY STUFF</Text>
      <View style={styles.group}>
        <Row
          icon="alarm-outline"
          label="Reminders"
          detail={activeReminders ? String(activeReminders) : null}
          onPress={() => navigation.navigate("Tasks")}
          styles={styles}
          P={P}
        />
        <View style={styles.divider} />
        <Row icon="mail-outline" label="Messages" onPress={() => navigation.navigate("MessageCenter")} styles={styles} P={P} />
      </View>

      {/* Parents add their children here (RB-6). Child accounts don't see this. */}
      {!userData?.isChild ? (
        <>
          <Text style={styles.section}>MY CHILDREN</Text>
          <View style={styles.group}>
            {children.map((k) => (
              <View key={k.uid}>
                <Row
                  icon="happy-outline"
                  label={`Play as ${k.firstName || "child"}`}
                  detail={k.grade ? `Class ${k.grade}` : null}
                  onPress={() => (!userData?.hasParentPin ? navigation.navigate("ParentPin", { mode: "set" }) : setPlayKid(k))}
                  styles={styles}
                  P={P}
                />
                <View style={styles.divider} />
              </View>
            ))}
            <Row icon="person-add-outline" label="Add a child" onPress={() => navigation.navigate("AddChild")} styles={styles} P={P} />
            <View style={styles.divider} />
            <Row icon="keypad-outline" label={userData?.hasParentPin ? "Change parent PIN" : "Set parent PIN"} onPress={() => navigation.navigate("ParentPin", { mode: "set" })} styles={styles} P={P} />
          </View>
        </>
      ) : (
        <View style={styles.group}>
          <Row icon="swap-horizontal-outline" label="Switch to parent (PIN)" onPress={() => navigation.navigate("ParentPin", { mode: "unlock" })} styles={styles} P={P} />
        </View>
      )}

      <Text style={styles.section}>MY CLASSES</Text>
      <View style={styles.group}>
        {myClasses.map((c) => (
          <View key={c.id}>
            <Row icon="people-outline" label={classLabel(c)} detail={c.schoolName || null} onPress={() => {}} styles={styles} P={P} />
            <View style={styles.divider} />
          </View>
        ))}
        {pendingClasses.map((c) => (
          <View key={c.id}>
            <Row icon="time-outline" label={classLabel(c)} detail="waiting for teacher" onPress={() => {}} styles={styles} P={P} />
            <View style={styles.divider} />
          </View>
        ))}
        {myClasses.length + pendingClasses.length < MAX_CLASSES ? (
          <Row icon="add-circle-outline" label="Join a class (with a parent)" onPress={() => navigation.navigate("JoinClass")} styles={styles} P={P} />
        ) : null}
        {/* Teachers enter the school's invite code (mockup L4). Not on child profiles. */}
        {!userData?.isChild ? (
          <>
            <View style={styles.divider} />
            <Row icon="school-outline" label="Join as a teacher" onPress={() => navigation.navigate("JoinAsTeacher")} styles={styles} P={P} />
          </>
        ) : null}
      </View>

      <Text style={styles.section}>LOOK</Text>
      <View style={styles.segment} accessibilityRole="radiogroup">
        {THEMES.map(([id, label]) => (
          <Pressable
            key={id}
            onPress={() => setThemeChoice && setThemeChoice(id)}
            style={[styles.segmentItem, themeChoice === id && styles.segmentOn]}
            accessibilityRole="radio"
            accessibilityState={{ selected: themeChoice === id }}
          >
            <Text style={[styles.segmentText, themeChoice === id && styles.segmentTextOn]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>HELP</Text>
      <View style={styles.group}>
        <Row icon="help-circle-outline" label="Help" onPress={openHelp} styles={styles} P={P} />
        <View style={styles.divider} />
        <Row icon="chatbubble-ellipses-outline" label="Tell us what you think" onPress={() => navigation.navigate("cntct")} styles={styles} P={P} />
      </View>

      {isAdmin ? (
        <>
          <Text style={styles.section}>ADMIN</Text>
          <View style={styles.group}>
            <Row icon="construct-outline" label="Admin tools" onPress={() => navigation.navigate("AdminTools")} styles={styles} P={P} />
          </View>
        </>
      ) : null}

      {typeof signoutHandler === "function" ? (
        <View style={styles.group}>
          <Row icon="log-out-outline" label="Sign out" onPress={() => setConfirmSignOut(true)} styles={styles} P={P} danger />
        </View>
      ) : null}

      <Text style={styles.version}>
        Apprec8 {version} · © {new Date().getFullYear()} Apprec8
      </Text>

      <ConfirmationModal
        visible={confirmSignOut}
        title="Are you sure you want to sign out?"
        onCancel={() => setConfirmSignOut(false)}
        onConfirm={() => {
          setConfirmSignOut(false);
          if (typeof signoutHandler === "function") signoutHandler();
        }}
      />
      <PlayAsChildSheet
        kid={playKid}
        P={P}
        onClose={() => setPlayKid(null)}
        onLoginCode={() => {
          const k = playKid;
          setPlayKid(null);
          navigation.navigate("AddChild", { kid: k });
        }}
      />
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 28, gap: 10 },
    h1: { fontSize: 28, fontFamily: "nunitoBold", color: P.text, marginBottom: 4 },
    card: { padding: 16, borderRadius: 20, backgroundColor: P.card, borderWidth: 2, borderColor: P.border, gap: 14 },
    profileRow: { alignItems: "center", gap: 12, paddingTop: 6 },
    avatar: { width: 140, height: 140, borderRadius: 70, backgroundColor: P.track, borderWidth: 4, borderColor: P.selectedBorder },
    avatarLetter: { alignItems: "center", justifyContent: "center", backgroundColor: P.primary },
    avatarText: { fontSize: 60, fontFamily: "nunitoBold", color: P.onPrimary },
    name: { fontSize: 26, lineHeight: 32, fontFamily: "nunitoBold", color: P.text, textAlign: "center" },
    soft: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    outlineButton: { height: 46, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: P.selectedBorder, alignItems: "center", justifyContent: "center", backgroundColor: P.card },
    outlineButtonText: { fontSize: 16, fontFamily: "nunitoBold", color: P.selectedText },
    section: { fontSize: 13, fontFamily: "nunitoBold", color: P.label, letterSpacing: 1, marginTop: 8 },
    group: { borderRadius: 18, backgroundColor: P.card, borderWidth: 2, borderColor: P.border, overflow: "hidden" },
    row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, minHeight: 56 },
    rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: P.selectedBg, alignItems: "center", justifyContent: "center" },
    rowText: { flex: 1, fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    rowDetail: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    divider: { height: 2, backgroundColor: P.border, marginLeft: 60 },
    segment: { flexDirection: "row", gap: 4, padding: 4, borderRadius: 16, backgroundColor: P.track },
    segmentItem: { flex: 1, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    segmentOn: { backgroundColor: P.card },
    segmentText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    segmentTextOn: { color: P.selectedText },
    version: { textAlign: "center", fontSize: 12, fontFamily: "nunitoBold", color: P.dimText, marginTop: 14 },
  });
