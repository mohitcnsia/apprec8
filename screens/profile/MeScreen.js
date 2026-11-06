// screens/profile/MeScreen.js
// Me tab (mockup Z4, owner-approved 2026-11-06):
// Simpler Me screen: content sits low. Shows 4 primary rows:
// Need help? (green row) + My class + My children + Guides,
// then one "More" row opening a sheet with everything else
// (reminders, messages, join a class, link parent, edit profile, delete account, sign out...).
// Nothing deleted. ADMIN section stays for the owner.

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import firestore from "@react-native-firebase/firestore";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import Sheet from "../../components/common/Sheet";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { helpTopics } from "../../data/app-topic-data";
import { TasksContext } from "../../store/tasks-context";
import { getClasses } from "../../services/classesApi";
import { myChildren } from "../../services/familyApi";
import PlayAsChildSheet from "./PlayAsChildSheet";
import HelpSheet, { NeedHelpRow } from "../../components/safety/HelpSheet";
import { classLabel, MAX_CLASSES } from "../../utils/classes";
import { listenDecisions } from "../../services/decisionsApi";
import { useOwnerExtras, setOwnerExtras } from "../../services/ownerView";
import { inbox } from "../../utils/decisions";

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

function Row({ icon, label, detail, sublabel, onPress, styles, P, danger = false }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.rowIcon, danger && { backgroundColor: P.wrongBg }]}>
        <Ionicons name={icon} size={20} color={danger ? P.wrongText : P.selectedText} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowText, danger && { color: P.wrongText }]}>{label}</Text>
        {sublabel ? <Text style={styles.rowSublabel}>{sublabel}</Text> : null}
      </View>
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
  const [helpOpen, setHelpOpen] = useState(false); // "Need help?" (mockup P1–P2)
  const [moreOpen, setMoreOpen] = useState(false); // "More" sheet (mockup Z4)
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

  const isTeacher = (userData?.teachesClassIds || []).length > 0;
  const isParent = children.length > 0 || (userData?.childUids || []).length > 0;
  const isStudent = Number.isInteger(userData?.grade);

  // Role subtitle for the profile card
  const roleSubtitle = useMemo(() => {
    if (userData?.isChild || isStudent) {
      return userData?.grade ? `Class ${userData.grade}` : "Student";
    }
    const roles = [];
    if (isTeacher) roles.push("Teacher");
    if (isParent) roles.push("Parent");
    if (roles.length > 0) return roles.join(" · ");
    return auth?.email || "";
  }, [userData?.isChild, isStudent, userData?.grade, isTeacher, isParent, auth?.email]);

  const editProfile = () => {
    setMoreOpen(false);
    navigation.navigate("EditProfile", {
      currentFirstName: userData?.firstName || "",
      currentLastName: userData?.lastName || "",
      currentPhotoURL: userData?.photoURL || "",
      currentProfileLastSavedAt: userData?.profileLastSavedAt || null,
      currentGrade: userData?.grade ?? null,
    });
  };

  const openHelp = () => {
    setMoreOpen(false);
    navigation.navigate("LinkScreen", {
      data: helpTopics,
      title: "Help & Support",
      userEmail: userData?.email || auth?.email || "",
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Top breathing room to anchor content low */}
      <View style={styles.topSpacer} />

      {/* Profile summary card */}
      <View style={styles.profileCard}>
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
            {roleSubtitle ? <Text style={styles.soft}>{roleSubtitle}</Text> : null}
          </View>
        </View>
      </View>

      {/* Row 1: Need help? Talk to someone (green row, mockup P1/Z4) */}
      <NeedHelpRow onPress={() => setHelpOpen(true)} P={P} />

      {/* Primary 3 rows (mockup Z4) */}
      <View style={styles.group}>
        {/* Row 2: My class (if teacher or student has classes, or allows quick tap) */}
        {isTeacher || myClasses.length > 0 ? (
          <>
            <Row
              icon="school-outline"
              label="My class"
              detail={myClasses.length > 0 ? `${classLabel(myClasses[0])} ›` : isTeacher ? "Classes ›" : "Join ›"}
              onPress={() => {
                if (isTeacher) {
                  navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "classes" } });
                } else if (myClasses.length > 0) {
                  navigation.navigate("JoinClass");
                } else {
                  navigation.navigate("JoinClass");
                }
              }}
              styles={styles}
              P={P}
            />
            <View style={styles.divider} />
          </>
        ) : null}

        {/* Row 3: My children (if parent has linked children) */}
        {isParent ? (
          <>
            <Row
              icon="happy-outline"
              label="My children"
              detail={children[0]?.firstName ? `${children[0].firstName} ›` : "Children ›"}
              onPress={() => {
                navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "family" } });
              }}
              styles={styles}
              P={P}
            />
            <View style={styles.divider} />
          </>
        ) : null}

        {/* Row 4: Guides (learn by doing) */}
        <Row
          icon="compass-outline"
          label="Guides"
          detail="Learn by doing"
          onPress={() => navigation.navigate("Guides", { isChild: !!userData?.isChild || isStudent })}
          styles={styles}
          P={P}
        />

        <View style={styles.divider} />

        {/* Row 5: More (reminders, messages, edit profile, delete account ›) */}
        <Row
          icon="ellipsis-horizontal-circle-outline"
          label="More"
          sublabel="reminders, messages, edit profile, delete account ›"
          onPress={() => setMoreOpen(true)}
          styles={styles}
          P={P}
        />
      </View>

      {/* ADMIN section (stays for the owner, mockup Z4) */}
      {isAdmin ? (
        <>
          <Text style={styles.section}>ADMIN</Text>
          <View style={styles.group}>
            <Row
              icon="checkmark-done-outline"
              label="Decisions"
              detail={decisionsWaiting ? String(decisionsWaiting) : null}
              onPress={() => navigation.navigate("Decisions")}
              styles={styles}
              P={P}
            />
            <View style={styles.divider} />
            <Row
              icon={ownerExtras ? "eye-outline" : "eye-off-outline"}
              label="Owner extras"
              detail={ownerExtras ? "On" : "Off: you see what others see"}
              onPress={() => setOwnerExtras(!ownerExtras)}
              styles={styles}
              P={P}
            />
            <View style={styles.divider} />
            <Row
              icon="construct-outline"
              label="Admin tools"
              onPress={() => navigation.navigate("AdminTools")}
              styles={styles}
              P={P}
            />
          </View>
        </>
      ) : null}

      <Text style={styles.version}>
        Apprec8 {version} · © {new Date().getFullYear()} Apprec8
      </Text>

      {/* More Sheet: Folds everything else cleanly (mockup Z4) */}
      <Sheet visible={moreOpen} onClose={() => setMoreOpen(false)} title="More Settings" subtitle="Profile, account and app options" P={P}>
        {/* Profile Action */}
        <View style={styles.group}>
          <Row icon="person-outline" label="Edit profile" onPress={editProfile} styles={styles} P={P} />
        </View>

        {/* My Stuff: Reminders & Messages */}
        <Text style={styles.sheetSection}>MY STUFF</Text>
        <View style={styles.group}>
          <Row
            icon="alarm-outline"
            label="Reminders"
            detail={activeReminders ? String(activeReminders) : null}
            onPress={() => {
              setMoreOpen(false);
              navigation.navigate("Tasks");
            }}
            styles={styles}
            P={P}
          />
          <View style={styles.divider} />
          <Row
            icon="mail-outline"
            label="Messages"
            onPress={() => {
              setMoreOpen(false);
              navigation.navigate("MessageCenter");
            }}
            styles={styles}
            P={P}
          />
        </View>

        {/* Classes & School */}
        <Text style={styles.sheetSection}>CLASSES & SCHOOL</Text>
        <View style={styles.group}>
          {myClasses.map((c) => (
            <View key={c.id}>
              <Row
                icon="people-outline"
                label={classLabel(c)}
                detail={c.schoolName || null}
                onPress={() => {}}
                styles={styles}
                P={P}
              />
              <View style={styles.divider} />
            </View>
          ))}
          {pendingClasses.map((c) => (
            <View key={c.id}>
              <Row
                icon="time-outline"
                label={classLabel(c)}
                detail="waiting for teacher"
                onPress={() => {}}
                styles={styles}
                P={P}
              />
              <View style={styles.divider} />
            </View>
          ))}
          {myClasses.length + pendingClasses.length < MAX_CLASSES ? (
            <>
              <Row
                icon="add-circle-outline"
                label="Join a class (with a parent)"
                onPress={() => {
                  setMoreOpen(false);
                  navigation.navigate("JoinClass");
                }}
                styles={styles}
                P={P}
              />
              <View style={styles.divider} />
            </>
          ) : null}
          {!userData?.isChild ? (
            <Row
              icon="school-outline"
              label="Join as a teacher"
              onPress={() => {
                setMoreOpen(false);
                navigation.navigate("JoinAsTeacher");
              }}
              styles={styles}
              P={P}
            />
          ) : null}
        </View>

        {/* Family & Children Actions */}
        {!userData?.isChild && !isStudent ? (
          <>
            <Text style={styles.sheetSection}>FAMILY</Text>
            <View style={styles.group}>
              {children.map((k) => (
                <View key={k.uid}>
                  <Row
                    icon="happy-outline"
                    label={k.ownLogin ? `${k.firstName || "Child"}'s week` : `Play as ${k.firstName || "child"}`}
                    detail={k.grade ? `Class ${k.grade}` : null}
                    onPress={() => {
                      setMoreOpen(false);
                      if (k.ownLogin) {
                        navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "family" } });
                      } else if (!userData?.hasParentPin) {
                        navigation.navigate("ParentPin", { mode: "set" });
                      } else {
                        setPlayKid(k);
                      }
                    }}
                    styles={styles}
                    P={P}
                  />
                  <View style={styles.divider} />
                </View>
              ))}
              <Row
                icon="person-add-outline"
                label="Add a child"
                onPress={() => {
                  setMoreOpen(false);
                  navigation.navigate("AddChild");
                }}
                styles={styles}
                P={P}
              />
              <View style={styles.divider} />
              <Row
                icon="link-outline"
                label="Link my child's own account"
                detail="they already use the app"
                onPress={() => {
                  setMoreOpen(false);
                  navigation.navigate("LinkChild");
                }}
                styles={styles}
                P={P}
              />
              <View style={styles.divider} />
              <Row
                icon="keypad-outline"
                label={userData?.hasParentPin ? "Change parent PIN" : "Set parent PIN"}
                onPress={() => {
                  setMoreOpen(false);
                  navigation.navigate("ParentPin", { mode: "set" });
                }}
                styles={styles}
                P={P}
              />
            </View>
          </>
        ) : null}

        {/* Link to my parent (for students with own login) */}
        {!userData?.isChild && isStudent && !(userData?.parentUids || []).length ? (
          <View style={styles.group}>
            <Row
              icon="link-outline"
              label="Link to my parent"
              detail="with a code from them"
              onPress={() => {
                setMoreOpen(false);
                navigation.navigate("LinkParent");
              }}
              styles={styles}
              P={P}
            />
          </View>
        ) : null}

        {/* Look / Theme Selection */}
        <Text style={styles.sheetSection}>LOOK</Text>
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

        {/* Help & Feedback */}
        <Text style={styles.sheetSection}>HELP</Text>
        <View style={styles.group}>
          <Row icon="help-circle-outline" label="Help" onPress={openHelp} styles={styles} P={P} />
          <View style={styles.divider} />
          <Row
            icon="chatbubble-ellipses-outline"
            label="Tell us what you think"
            onPress={() => {
              setMoreOpen(false);
              navigation.navigate("cntct");
            }}
            styles={styles}
            P={P}
          />
        </View>

        {/* Account & Sign out */}
        {typeof signoutHandler === "function" ? (
          <View style={styles.group}>
            <Row
              icon="log-out-outline"
              label="Sign out"
              onPress={() => {
                setMoreOpen(false);
                setConfirmSignOut(true);
              }}
              styles={styles}
              P={P}
              danger
            />
            {!(userData?.isChild && !userData?.ownLogin) ? (
              <>
                <View style={styles.divider} />
                <Row
                  icon="trash-outline"
                  label="Delete my account"
                  onPress={() => {
                    setMoreOpen(false);
                    navigation.navigate("DeleteAccountConfirmation", { userEmail: authInstance.currentUser?.email || null });
                  }}
                  styles={styles}
                  P={P}
                  danger
                />
              </>
            ) : null}
          </View>
        ) : null}
      </Sheet>

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
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: {
      paddingTop: insets.top + 8,
      paddingHorizontal: 18,
      paddingBottom: 32,
      gap: 12,
    },
    topSpacer: { height: 16 },
    profileCard: {
      padding: 18,
      borderRadius: 22,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      alignItems: "center",
      justifyContent: "center",
    },
    profileRow: { alignItems: "center", gap: 10 },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: P.track,
      borderWidth: 3,
      borderColor: P.selectedBorder,
    },
    avatarLetter: { alignItems: "center", justifyContent: "center", backgroundColor: P.primary },
    avatarText: { fontSize: 44, fontFamily: "nunitoBold", color: P.onPrimary },
    name: { fontSize: 24, lineHeight: 30, fontFamily: "nunitoBold", color: P.text, textAlign: "center" },
    soft: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    section: { fontSize: 13, fontFamily: "nunitoBold", color: P.label, letterSpacing: 1, marginTop: 8 },
    sheetSection: { fontSize: 12, fontFamily: "nunitoBold", color: P.label, letterSpacing: 1, marginTop: 6 },
    group: { borderRadius: 18, backgroundColor: P.card, borderWidth: 2, borderColor: P.border, overflow: "hidden" },
    row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, minHeight: 56 },
    rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: P.selectedBg, alignItems: "center", justifyContent: "center" },
    rowText: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    rowSublabel: { fontSize: 12, fontFamily: "nunito", color: P.textSoft, marginTop: 1 },
    rowDetail: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    divider: { height: 2, backgroundColor: P.border, marginLeft: 60 },
    segment: { flexDirection: "row", gap: 4, padding: 4, borderRadius: 16, backgroundColor: P.track },
    segmentItem: { flex: 1, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    segmentOn: { backgroundColor: P.card },
    segmentText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    segmentTextOn: { color: P.selectedText },
    version: { textAlign: "center", fontSize: 12, fontFamily: "nunitoBold", color: P.dimText, marginTop: 14 },
  });
