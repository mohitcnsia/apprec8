// screens/admin/InviteTeacherScreen.js
// Invite a teacher without email (mockup L4, owner-approved 2026-11-05): pick subjects → SHARE INVITE makes a one-time
// code (7 days) and opens the phone's share menu with a ready message. The teacher enters it under Me → Join as a
// teacher; the request then waits on the class page for approval. "Add by email" stays as a folded fallback.

import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, Chip, MainButton, Field } from "./schoolUi";
import { createTeacherInvite, findUserByEmail, setTeacher } from "../../services/classesApi";
import { SUBJECTS, SUBJECT_NAMES, teacherInviteMessage } from "../../utils/classes";

export default function InviteTeacherScreen({ route, navigation }) {
  const { classId, className, schoolName, subjects: classSubs = [] } = route.params || {};
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);

  const [subjects, setSubjects] = useState(classSubs.length ? [classSubs[0]] : ["english"]);
  const [invite, setInvite] = useState(null); // { code, subjectsKey }
  const [busy, setBusy] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");

  const key = [...subjects].sort().join(",");
  const code = invite && invite.subjectsKey === key ? invite.code : null;
  const message = teacherInviteMessage({ className, schoolName, subjects, code: code || "······" });
  const toggle = (s) => setSubjects((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const share = async () => {
    if (!subjects.length) return Alert.alert("Pick a subject", "Which subjects will they teach?");
    setBusy(true);
    try {
      let c = code;
      if (!c) {
        const r = await createTeacherInvite({ classId, subjects });
        c = r.code;
        setInvite({ code: c, subjectsKey: key });
      }
      await Share.share({ message: teacherInviteMessage({ className, schoolName, subjects, code: c }) });
    } catch (e) {
      Alert.alert("Couldn't make the invite", e?.message || String(e));
    }
    setBusy(false);
  };

  const addByEmail = async () => {
    setBusy(true);
    try {
      const t = await findUserByEmail(email);
      await setTeacher({ classId, teacherUid: t.uid, subjects });
      Alert.alert("Added", `${t.firstName} now teaches ${subjects.map((s) => SUBJECT_NAMES[s]).join(", ")} in ${className}.`);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Couldn't add", e?.message || String(e));
    }
    setBusy(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.h1}>Invite a teacher</Text>
          <Text style={styles.soft}>to {className} · no email needed</Text>
        </View>

        <Text style={styles.label}>THEY WILL TEACH</Text>
        <View style={styles.chips}>
          {SUBJECTS.map((s) => (
            <Chip key={s} label={SUBJECT_NAMES[s]} on={subjects.includes(s)} onPress={() => toggle(s)} styles={styles} />
          ))}
        </View>

        <Text style={styles.label}>THE MESSAGE (YOU PICK WHATSAPP, SMS…)</Text>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText} selectable>
            {message}
          </Text>
        </View>

        <View style={[styles.card, { flexDirection: "row", gap: 12, alignItems: "flex-start" }]}>
          <Ionicons name="shield-checkmark-outline" size={22} color={P.label} />
          <Text style={[styles.small, { flex: 1 }]}>
            When they enter the code, you see their request on the class page. Nothing opens until you approve.
          </Text>
        </View>

        {!showEmail ? (
          <Pressable onPress={() => setShowEmail(true)} accessibilityRole="button" style={styles.link}>
            <Text style={[styles.linkText, { fontSize: 15 }]}>They already use Apprec8? Add by email</Text>
          </Pressable>
        ) : (
          <View style={{ gap: 8 }}>
            <Field label="THEIR GOOGLE EMAIL" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="name@gmail.com" styles={styles} P={P} />
            <Pressable onPress={addByEmail} disabled={!email.includes("@") || busy} accessibilityRole="button" style={[styles.smallButton, { alignSelf: "flex-start" }]}>
              <Text style={styles.smallButtonText}>Add teacher</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <MainButton label="SHARE INVITE" onPress={share} busy={busy} styles={styles} P={P} />
      </View>
    </View>
  );
}
