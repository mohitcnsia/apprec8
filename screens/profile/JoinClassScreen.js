// screens/profile/JoinClassScreen.js
// RB-2 phase A: a kid joins a class with the code from their teacher, WITH a parent: the parent reads the consent
// (English or Hindi), writes their name, and agrees. Stored as a consent record (utils/classes.js). Me → Join a class.

import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { listenToUserDocument } from "../../services/firestoreContentApi";
import { findClassByCode, joinClass } from "../../services/classesApi";
import { CONSENT_TEXT, canJoin, classLabel } from "../../utils/classes";
import { showAlert } from "../../services/dialog";

const RELATIONS = [
  ["mother", "Mother · माँ"],
  ["father", "Father · पिता"],
  ["guardian", "Guardian · अभिभावक"],
];

export default function JoinClassScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [user, setUser] = useState(null);
  const [code, setCode] = useState("");
  const [found, setFound] = useState(null);
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState("en");
  const [parentName, setParentName] = useState("");
  const [relation, setRelation] = useState(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => listenToUserDocument(setUser, () => {}), []);
  const myClassIds = [...(user?.classIds || []), ...(user?.pendingClassIds || [])]; // waiting ones count too
  const t = CONSENT_TEXT[lang];

  const lookUp = async () => {
    setBusy(true);
    try {
      const f = await findClassByCode(code);
      if (!f) showAlert("Not found", "That code doesn't match a class. Check it with your teacher (6 letters and numbers).");
      else {
        const check = canJoin(myClassIds, f.classId);
        if (!check.ok) showAlert("Can't join", check.reason);
        else setFound(f);
      }
    } catch (e) {
      showAlert("Error", e.message);
    }
    setBusy(false);
  };

  const join = async () => {
    setBusy(true);
    try {
      await joinClass({ found, myClassIds, firstName: user?.firstName, grade: user?.grade, parentName, relation, language: lang });
      showAlert("Request sent ✉️", `Your teacher will check and approve ${classLabel(found.class)}. You'll see it in Me → My classes.`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      showAlert("Couldn't join", e.message);
    }
    setBusy(false);
  };

  const canSubmit = found && parentName.trim().length >= 2 && relation && agreed && !busy;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>JOIN A CLASS</Text>
        {!found ? (
          <>
            <Text style={styles.soft}>Type the 6-letter code from your teacher.</Text>
            <TextInput
              value={code}
              onChangeText={(v) => setCode(v.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
              placeholder="ABC234"
              placeholderTextColor={P.dimText}
              style={styles.codeInput}
              accessibilityLabel="Class code"
            />
          </>
        ) : (
          <>
            <View style={styles.classCard}>
              <Text style={styles.classTitle}>{classLabel(found.class)}</Text>
              <Text style={styles.soft}>{found.class.schoolName || "School"} · Class {found.class.grade}</Text>
            </View>

            <View style={styles.segment}>
              {[
                ["en", "English"],
                ["hi", "हिंदी"],
              ].map(([id, name]) => (
                <Pressable key={id} onPress={() => setLang(id)} style={[styles.segmentItem, lang === id && styles.segmentOn]} accessibilityRole="tab" accessibilityState={{ selected: lang === id }}>
                  <Text style={[styles.segmentText, lang === id && { color: P.selectedText }]}>{name}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.consentCard}>
              <Text style={styles.consentTitle}>{t.title}</Text>
              <Text style={styles.consentBody}>{t.body}</Text>
            </View>

            <TextInput
              value={parentName}
              onChangeText={setParentName}
              placeholder={lang === "hi" ? "माता-पिता / अभिभावक का नाम" : "Parent or guardian's name"}
              placeholderTextColor={P.dimText}
              style={styles.input}
              accessibilityLabel="Parent or guardian's name"
            />
            <View style={styles.chips}>
              {RELATIONS.map(([id, name]) => (
                <Pressable key={id} onPress={() => setRelation(id)} style={[styles.chip, relation === id && styles.chipOn]} accessibilityRole="radio" accessibilityState={{ selected: relation === id }}>
                  <Text style={[styles.chipText, relation === id && { color: P.selectedText }]}>{name}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={() => setAgreed((a) => !a)} style={styles.agreeRow} accessibilityRole="checkbox" accessibilityState={{ checked: agreed }}>
              <View style={[styles.box, agreed && styles.boxOn]}>{agreed ? <Text style={styles.tick}>✓</Text> : null}</View>
              <Text style={styles.agreeText}>{t.confirm}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Thumb zone (design rule 2) */}
      <View style={styles.footer}>
        <Pressable
          onPress={found ? join : lookUp}
          disabled={found ? !canSubmit : code.trim().length < 6 || busy}
          style={[styles.button, (found ? !canSubmit : code.trim().length < 6 || busy) && styles.buttonOff]}
          accessibilityRole="button"
        >
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{found ? (lang === "hi" ? "सहमत हूँ · JOIN" : "AGREE AND JOIN") : "FIND MY CLASS"}</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 24, paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
    label: { fontSize: 13, letterSpacing: 1.2, fontFamily: "nunitoBold", color: P.label },
    soft: { fontSize: 15, lineHeight: 21, fontFamily: "nunitoBold", color: P.textSoft },
    codeInput: { height: 70, borderRadius: 18, borderWidth: 2, borderColor: P.selectedBorder, backgroundColor: P.card, color: P.text, fontSize: 32, letterSpacing: 8, textAlign: "center", fontFamily: "nunitoBold" },
    classCard: { padding: 16, borderRadius: 20, backgroundColor: P.selectedBg, gap: 4 },
    classTitle: { fontSize: 22, fontFamily: "nunitoBold", color: P.selectedText },
    segment: { flexDirection: "row", gap: 4, padding: 4, borderRadius: 16, backgroundColor: P.track },
    segmentItem: { flex: 1, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    segmentOn: { backgroundColor: P.card },
    segmentText: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    consentCard: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, gap: 8 },
    consentTitle: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    consentBody: { fontSize: 15, lineHeight: 23, fontFamily: "nunito", color: P.text },
    input: { height: 54, borderRadius: 14, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, color: P.text, fontSize: 16, paddingHorizontal: 14, fontFamily: "nunitoBold" },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: P.border, backgroundColor: P.card },
    chipOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    chipText: { fontSize: 14, fontFamily: "nunitoBold", color: P.text },
    agreeRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6 },
    box: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: P.selectedBorder, alignItems: "center", justifyContent: "center" },
    boxOn: { backgroundColor: P.primary, borderColor: P.primary },
    tick: { color: "#FFFFFF", fontSize: 18, fontFamily: "nunitoBold" },
    agreeText: { flex: 1, fontSize: 15, lineHeight: 21, fontFamily: "nunitoBold", color: P.text },
    footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: Math.max(22, insets.bottom + 14) },
    button: { height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center" },
    buttonOff: { opacity: 0.45 },
    buttonText: { color: P.onPrimary, fontSize: 17, fontFamily: "nunitoBold", letterSpacing: 1 },
  });
