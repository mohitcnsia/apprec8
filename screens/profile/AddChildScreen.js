// screens/profile/AddChildScreen.js
// RB-6 parent-first accounts: a parent adds a child (first name, class, consent in English or Hindi) and gets a
// (no login code since 2026-11-12). Me → My children.
// With route.params.kid it only makes a NEW code for an existing child.

import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { addChild, newChildCode } from "../../services/familyApi";
import { CHILD_CONSENT_TEXT } from "../../utils/family";
import ConsentListenButton from "../../components/common/ConsentListenButton";
import { showAlert } from "../../services/dialog";

const RELATIONS = [
  ["mother", "Mother · माँ"],
  ["father", "Father · पिता"],
  ["guardian", "Guardian · अभिभावक"],
];

export default function AddChildScreen({ route, navigation }) {
  const existing = route?.params?.kid || null;
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [lang, setLang] = useState("en");
  const [firstName, setFirstName] = useState("");
  const [grade, setGrade] = useState(null);
  const [parentName, setParentName] = useState("");
  const [relation, setRelation] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { code, hours, name }
  const t = CHILD_CONSENT_TEXT[lang];

  const submit = async () => {
    setBusy(true);
    try {
      if (existing) {
        const r = await newChildCode(existing.uid);
        setResult({ ...r, name: existing.firstName });
      } else {
        const r = await addChild({ firstName, grade, parentName, relation, language: lang });
        setResult({ ...r, name: firstName.trim().split(/\s+/)[0] });
      }
    } catch (e) {
      showAlert("Couldn't do that", e?.message || String(e));
    }
    setBusy(false);
  };

  // No login code any more (owner, 2026-11-12: the sign-up doc drops the codes). The child plays on this phone, and joins a
  // class when the parent taps the teacher's class link.
  if (result) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Text style={styles.label}>ADDED</Text>
        <Text style={styles.bigCode}>{result.name} ✓</Text>
        <Text style={styles.soft}>
          {result.name} plays on this phone: Home → "Let {result.name} play on this phone". To join a school class: Home → "Join {result.name}'s class".
        </Text>
        <Text style={styles.soft}>
          {result.name} इसी फ़ोन पर खेल सकते हैं: Home → "Let {result.name} play on this phone"। स्कूल की कक्षा से जुड़ने के लिए: Home → "Join {result.name}'s class"।
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>DONE</Text>
        </Pressable>
      </View>
    );
  }

  const canSubmit = existing || (firstName.trim().length >= 2 && grade && parentName.trim().length >= 2 && relation && agreed);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>{existing ? `NEW LOGIN CODE FOR ${String(existing.firstName).toUpperCase()}` : "ADD A CHILD"}</Text>
        {existing ? (
          <Text style={styles.soft}>Make a new one-time code to sign {existing.firstName} in on another phone.</Text>
        ) : (
          <>
            <TextInput value={firstName} onChangeText={setFirstName} placeholder="Child's first name" placeholderTextColor={P.dimText} style={styles.input} />
            <Text style={styles.soft}>Class (it can only be changed by a parent, teacher or admin later)</Text>
            <View style={styles.chips}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                <Pressable key={g} onPress={() => setGrade(g)} style={[styles.gradeChip, grade === g && styles.chipOn]}>
                  <Text style={styles.chipText}>{g}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.segment}>
              {[
                ["en", "English"],
                ["hi", "हिंदी"],
              ].map(([id, name]) => (
                <Pressable key={id} onPress={() => setLang(id)} style={[styles.segmentItem, lang === id && styles.segmentOn]}>
                  <Text style={[styles.chipText, lang === id && { color: P.selectedText }]}>{name}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.consentCard}>
              <View style={styles.consentHeader}>
                <Text style={styles.consentTitle}>{t.title}</Text>
                <ConsentListenButton text={t} lang={lang} P={P} />
              </View>
              <Text style={styles.consentBody}>{t.body}</Text>
            </View>
            <TextInput value={parentName} onChangeText={setParentName} placeholder={lang === "hi" ? "आपका नाम" : "Your name"} placeholderTextColor={P.dimText} style={styles.input} />
            <View style={styles.chips}>
              {RELATIONS.map(([id, name]) => (
                <Pressable key={id} onPress={() => setRelation(id)} style={[styles.chip, relation === id && styles.chipOn]}>
                  <Text style={styles.chipText}>{name}</Text>
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
      <View style={styles.footer}>
        <Pressable onPress={submit} disabled={!canSubmit || busy} style={[styles.button, (!canSubmit || busy) && { opacity: 0.45 }]}>
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{existing ? "MAKE CODE" : lang === "hi" ? "सहमत हूँ · ADD" : "AGREE AND ADD"}</Text>}
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
    bigCode: { fontSize: 48, letterSpacing: 8, fontFamily: "nunitoBold", color: P.selectedText, textAlign: "center", paddingVertical: 18, borderRadius: 20, backgroundColor: P.selectedBg },
    input: { height: 54, borderRadius: 14, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, color: P.text, fontSize: 16, paddingHorizontal: 14, fontFamily: "nunitoBold" },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: P.border, backgroundColor: P.card },
    gradeChip: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: P.border, alignItems: "center", justifyContent: "center", backgroundColor: P.card },
    chipOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    chipText: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    segment: { flexDirection: "row", gap: 4, padding: 4, borderRadius: 16, backgroundColor: P.track },
    segmentItem: { flex: 1, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    segmentOn: { backgroundColor: P.card },
    consentCard: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, gap: 8 },
    consentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
    consentTitle: { flex: 1, fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    consentBody: { fontSize: 15, lineHeight: 23, fontFamily: "nunito", color: P.text },
    agreeRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6 },
    box: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: P.selectedBorder, alignItems: "center", justifyContent: "center" },
    boxOn: { backgroundColor: P.primary, borderColor: P.primary },
    tick: { color: "#FFFFFF", fontSize: 18, fontFamily: "nunitoBold" },
    agreeText: { flex: 1, fontSize: 15, lineHeight: 21, fontFamily: "nunitoBold", color: P.text },
    footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: Math.max(22, insets.bottom + 14) },
    button: { height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center" },
    buttonText: { color: P.onPrimary, fontSize: 17, fontFamily: "nunitoBold", letterSpacing: 1 },
  });
