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
import * as Updates from "expo-updates";
import firestore from "@react-native-firebase/firestore";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { helpTopics } from "../../data/app-topic-data";
import { TasksContext } from "../../store/tasks-context";
import { getClasses, mySchoolAdminSchools } from "../../services/classesApi";
import { myChildren } from "../../services/familyApi";
import PlayAsChildSheet from "./PlayAsChildSheet";
import HelpSheet, { NeedHelpRow } from "../../components/safety/HelpSheet";
import { classLabel, MAX_CLASSES } from "../../utils/classes";
import { listenDecisions } from "../../services/decisionsApi";
import { useOwnerExtras, setOwnerExtras } from "../../services/ownerView";
import { usePersona, withPersona } from "../../services/persona";
import PersonaBanner from "../../components/admin/PersonaBanner";
import { inbox } from "../../utils/decisions";
import IdeaModal from "../../components/feedback/IdeaModal";

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
  const persona = usePersona(); // owner's "View as" (Admin tools): Me shows that person's sections
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && uid === APPREC8_TEAM_REVIEWER_UID && persona.role === "owner";
  const [rawUser, setUserData] = useState(null);
  const userData = useMemo(() => withPersona(rawUser), [rawUser, persona]); // eslint-disable-line react-hooks/exhaustive-deps
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [myClasses, setMyClasses] = useState([]);
  const [children, setChildren] = useState([]);
  const [playKid, setPlayKid] = useState(null); // "Play as" sheet (mockup N1)
  const [helpOpen, setHelpOpen] = useState(false); // "Need help?" (mockup P1–P2)
  const [decisionsWaiting, setDecisionsWaiting] = useState(0); // owner only (Me → Decisions)
  const ownerExtras = useOwnerExtras(); // owner's "View as": off = see what other grown-ups see
  useEffect(() => (isAdmin ? listenDecisions((list) => setDecisionsWaiting(inbox(list).waiting.length)) : undefined), [isAdmin]);
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
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);
  const [isSchoolAdmin, setIsSchoolAdmin] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  // Who this person is on Me (a parent who also teaches sees both sections).
  const isParent = !userData?.isChild && (!Number.isInteger(userData?.grade) || (userData?.childUids || []).length > 0);
  const isTeacher = (userData?.teachesClassIds || []).length > 0;
  const isStudent = Number.isInteger(userData?.grade) && !isTeacher && !(userData?.childUids || []).length;

  useEffect(() => {
    if (isAdmin || !uid) return;
    mySchoolAdminSchools()
      .then((s) => setIsSchoolAdmin(s.length > 0))
      .catch(() => setIsSchoolAdmin(false));
  }, [isAdmin, uid]);

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
  const enrolledMs = rawUser?.createdAt?.toMillis?.() || (auth?.metadata?.creationTime ? Date.parse(auth.metadata.creationTime) : null);
  const enrolled = enrolledMs ? new Date(enrolledMs).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
  const photo = userData?.photoURL || auth?.photoURL || null;
  const activeReminders = tasks.filter((t) => t.userId === uid && !t.completed).length;
  const version = Constants.expoConfig?.version || "";
  // Which over-the-air update this phone runs (owner, 2026-11-11: "is my phone up to date?"): first 8 characters of
  // the update id, as in the EAS update list; "built-in" = the Play Store version with no update yet.
  const updateCode = Updates.updateId ? Updates.updateId.slice(0, 8) : "built-in";

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
      <PersonaBanner />

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
            {/* Back from the old Profile screen (owner, 13 Nov): when this account joined, with the year. */}
            {enrolled ? <Text style={styles.soft}>Enrolled {enrolled}</Text> : null}
          </View>
        </View>
        <Pressable onPress={editProfile} style={styles.outlineButton} accessibilityRole="button" disabled={!userData}>
          <Text style={styles.outlineButtonText}>Edit profile</Text>
        </Pressable>
      </View>

      {/* Redesign (owner + Seema, 2026-11-11): Me shows only what this person does; every row is an action. Settings
          and rarely used rows fold under More (fold, don't delete). */}

      {/* Owner: Decisions + Admin tools first. School admins: their admin tools. */}
      {isAdmin ? (
        <View style={styles.group}>
          <Row icon="checkmark-done-outline" label="Decisions for you" detail={decisionsWaiting ? String(decisionsWaiting) : null} onPress={() => navigation.navigate("Decisions")} styles={styles} P={P} />
          <View style={styles.divider} />
          <Row icon="construct-outline" label="Admin tools" onPress={() => navigation.navigate("AdminTools")} styles={styles} P={P} />
        </View>
      ) : isSchoolAdmin ? (
        <View style={styles.group}>
          <Row icon="construct-outline" label="Admin tools (schools & classes)" onPress={() => navigation.navigate("AdminTools")} styles={styles} P={P} />
        </View>
      ) : null}

      {/* Always here, for everyone (mockup P1): calm green, safe to tap. */}
      <NeedHelpRow onPress={() => setHelpOpen(true)} P={P} />

      {isParent ? (
        <>
          <Text style={styles.section}>MY CHILDREN</Text>
          <View style={styles.group}>
            {children.map((k) => (
              <View key={k.uid}>
                {/* A linked child has their own login: their week; a child on this phone: play here. */}
                <Row
                  icon="happy-outline"
                  label={k.ownLogin ? `See ${k.firstName || "your child"}'s week` : `Let ${k.firstName || "your child"} play on this phone`}
                  detail={k.waitingForTeacher ? "waiting for the teacher" : k.grade ? `Class ${k.grade}` : null}
                  onPress={() =>
                    k.ownLogin
                      ? navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "family" } })
                      : !userData?.hasParentPin
                      ? navigation.navigate("ParentPin", { mode: "set" })
                      : setPlayKid(k)
                  }
                  styles={styles}
                  P={P}
                />
                <View style={styles.divider} />
              </View>
            ))}
            <Row icon="person-add-outline" label="Add a child" onPress={() => navigation.navigate("AddChild")} styles={styles} P={P} />
          </View>
        </>
      ) : userData?.isChild ? (
        // Only a child profile played on a parent's phone can switch back (a student with their own login has no parent PIN).
        <View style={styles.group}>
          <Row icon="swap-horizontal-outline" label="Switch to parent (PIN)" onPress={() => navigation.navigate("ParentPin", { mode: "unlock" })} styles={styles} P={P} />
        </View>
      ) : null}

      {isTeacher ? (
        <>
          <Text style={styles.section}>MY CLASSES</Text>
          <View style={styles.group}>
            <Row icon="people-outline" label="Open my classes" detail={`${(userData?.teachesClassIds || []).length}`} onPress={() => navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "classes" } })} styles={styles} P={P} />
          </View>
        </>
      ) : null}

      {/* Stickers from teachers' Appreciate (2026-11-11): the stamp book kids show their friends. */}
      {(userData?.stickers || []).length ? (
        <>
          <Text style={styles.section}>MY STICKERS · {userData.stickerCount || userData.stickers.length}</Text>
          <View style={[styles.card, { gap: 8 }]}>
            <Text style={{ fontSize: 30, lineHeight: 40 }}>{userData.stickers.slice(-12).map((x) => x.emoji).join(" ")}</Text>
            {(() => {
              const last = userData.stickers[userData.stickers.length - 1];
              return <Text style={styles.soft}>From {last.from}: great work{last.topic ? ` on ${last.topic}` : ""}!</Text>;
            })()}
          </View>
        </>
      ) : null}

      {/* A student's own class: in it, or waiting for the teacher (T1: the kid sees "waiting for your teacher"). */}
      {myClasses.length + pendingClasses.length > 0 || isStudent ? (
        <>
          <Text style={styles.section}>MY CLASS</Text>
          <View style={styles.group}>
            {myClasses.map((c) => (
              <View key={c.id}>
                <Row icon="people-outline" label={`You're in ${classLabel(c)}`} detail={c.schoolName || null} onPress={() => {}} styles={styles} P={P} />
                <View style={styles.divider} />
              </View>
            ))}
            {pendingClasses.map((c) => (
              <View key={c.id}>
                <Row icon="time-outline" label={classLabel(c)} detail="waiting for your teacher" onPress={() => {}} styles={styles} P={P} />
                <View style={styles.divider} />
              </View>
            ))}
            {!myClasses.length && !pendingClasses.length ? (
              <Row icon="add-circle-outline" label="Join a class" onPress={() => navigation.navigate("PickClass")} styles={styles} P={P} />
            ) : null}
          </View>
        </>
      ) : null}

      <View style={styles.group}>
        <Row icon="chatbubble-ellipses-outline" label="Tell us what you think" onPress={() => navigation.navigate("cntct")} styles={styles} P={P} />
      </View>

      {/* Everything else, one tap away. */}
      <Pressable onPress={() => setMoreOpen(!moreOpen)} accessibilityRole="button" accessibilityState={{ expanded: moreOpen }} style={styles.more}>
        <Text style={styles.moreText}>{moreOpen ? "Less ▲" : "More: look, guides, reminders, sign out ▼"}</Text>
      </Pressable>

      {moreOpen ? (
        <>
          <View style={styles.group}>
            <Row icon="help-circle-outline" label="How to use Apprec8" onPress={openHelp} styles={styles} P={P} />
            <View style={styles.divider} />
            <Row
              icon="compass-outline"
              label="Guides"
              detail="Learn by doing"
              onPress={() => navigation.navigate("Guides", { isChild: !!userData?.isChild || Number.isInteger(userData?.grade) })}
              styles={styles}
              P={P}
            />
            <View style={styles.divider} />
            <Row icon="bulb-outline" label="I have an idea for Apprec8" onPress={() => setIdeaModalOpen(true)} styles={styles} P={P} />
            <View style={styles.divider} />
            <Row icon="alarm-outline" label="Reminders" detail={activeReminders ? String(activeReminders) : null} onPress={() => navigation.navigate("Tasks")} styles={styles} P={P} />
            <View style={styles.divider} />
            <Row icon="mail-outline" label="Messages" onPress={() => navigation.navigate("MessageCenter")} styles={styles} P={P} />
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

          <View style={styles.group}>
            {myClasses.length + pendingClasses.length > 0 && myClasses.length + pendingClasses.length < MAX_CLASSES ? (
              <>
                <Row icon="add-circle-outline" label="Join another class" onPress={() => navigation.navigate("PickClass")} styles={styles} P={P} />
                <View style={styles.divider} />
              </>
            ) : null}
            {!userData?.isChild ? (
              <>
                <Row icon="school-outline" label="Join as a teacher" onPress={() => navigation.navigate("JoinAsTeacher")} styles={styles} P={P} />
                <View style={styles.divider} />
              </>
            ) : null}
            {isParent ? (
              <>
                <Row icon="link-outline" label="Link my child's own account" detail="they already use the app" onPress={() => navigation.navigate("LinkChild")} styles={styles} P={P} />
                <View style={styles.divider} />
                <Row icon="keypad-outline" label={userData?.hasParentPin ? "Change parent PIN" : "Set parent PIN"} onPress={() => navigation.navigate("ParentPin", { mode: "set" })} styles={styles} P={P} />
                <View style={styles.divider} />
              </>
            ) : null}
            {/* A student with their own login links to a parent (decision 9). */}
            {!userData?.isChild && Number.isInteger(userData?.grade) && !(userData?.parentUids || []).length && !(userData?.childUids || []).length ? (
              <>
                <Row icon="link-outline" label="Link to my parent" detail="with a code from them" onPress={() => navigation.navigate("LinkParent")} styles={styles} P={P} />
                <View style={styles.divider} />
              </>
            ) : null}
            {isAdmin ? (
              <>
                <Row
                  icon={ownerExtras ? "eye-outline" : "eye-off-outline"}
                  label="Owner extras"
                  detail={ownerExtras ? "On" : "Off: you see what others see"}
                  onPress={() => setOwnerExtras(!ownerExtras)}
                  styles={styles}
                  P={P}
                />
                <View style={styles.divider} />
              </>
            ) : null}
            {typeof signoutHandler === "function" ? (
              <>
                <Row icon="log-out-outline" label="Sign out" onPress={() => setConfirmSignOut(true)} styles={styles} P={P} danger />
                {/* Play and DPDP: everyone with their own login can delete their account in the app. A "Play as" child
                    profile can't: its parent removes it (Me → the child → Remove). */}
                {!(userData?.isChild && !userData?.ownLogin) ? (
                  <>
                    <View style={styles.divider} />
                    <Row
                      icon="trash-outline"
                      label="Delete my account"
                      onPress={() => navigation.navigate("DeleteAccountConfirmation", { userEmail: authInstance.currentUser?.email || null })}
                      styles={styles}
                      P={P}
                      danger
                    />
                  </>
                ) : null}
              </>
            ) : null}
          </View>
        </>
      ) : null}

      <Text style={styles.version}>
        Apprec8 {version} · update {updateCode} · © {new Date().getFullYear()} Apprec8
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
      <HelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} P={P} />
      <IdeaModal visible={ideaModalOpen} onClose={() => setIdeaModalOpen(false)} entryPoint="me_idea" userGrade={userData?.grade} />
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
    more: { minHeight: 52, borderRadius: 16, backgroundColor: P.track, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
    moreText: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
  });
