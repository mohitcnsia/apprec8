// screens/profile/JoinAsTeacherScreen.js
// A teacher enters the one-time code from the school's invite (mockup L4, owner-approved 2026-11-05). This files a
// request; the school's admin approves it on the class page. Me → Join as a teacher (not shown on child profiles).

import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "../admin/schoolUi";
import { redeemTeacherInvite } from "../../services/classesApi";
import { SUBJECT_NAMES } from "../../utils/classes";

export default function JoinAsTeacherScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const tidy = code.toUpperCase().replace(/[\s-]/g, "");
  const join = async () => {
    setBusy(true);
    try {
      setDone(await redeemTeacherInvite(tidy));
    } catch (e) {
      Alert.alert("Couldn't join", e?.message || String(e));
    }
    setBusy(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Join as a teacher</Text>
        {done ? (
          <View style={styles.card}>
            <Text style={styles.title}>Request sent ✓</Text>
            <Text style={styles.soft}>
              You asked to teach {(done.subjects || []).map((s) => SUBJECT_NAMES[s] || s).join(", ")} in {done.className}
              {done.schoolName ? `, ${done.schoolName}` : ""}. The school will approve you soon. The class then appears in Progress.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.soft}>Enter the code from the school's message. It starts with T.</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
              placeholder="T4K9PX"
              placeholderTextColor={P.dimText}
              accessibilityLabel="Invite code"
              style={[styles.input, { height: 64, fontSize: 28, letterSpacing: 6, textAlign: "center" }]}
            />
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        {done ? (
          <MainButton label="DONE" onPress={() => navigation.goBack()} styles={styles} P={P} />
        ) : (
          <MainButton label="JOIN" onPress={join} busy={busy} disabled={tidy.length !== 6} styles={styles} P={P} />
        )}
      </View>
    </View>
  );
}
