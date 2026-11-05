// screens/profile/LinkChildScreen.js
// Parent: link a child's EXISTING account (product decision 9, owner 2026-11-05; same look as Add a child / Join as a
// teacher). The parent agrees (name + relation, English or Hindi), gets a one-time code (24 h) and the child types it
// on their own phone: Me → Link to my parent. The child keeps their login and progress.

import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton, Chip, Field } from "../admin/schoolUi";
import { createParentLinkCode } from "../../services/familyApi";
import { LINK_CONSENT_TEXT, LINK_CONSENT_VERSION } from "../../utils/family";
import { showAlert } from "../../services/dialog";

const RELATIONS = [
  ["mother", "Mother · माँ"],
  ["father", "Father · पिता"],
  ["guardian", "Guardian · अभिभावक"],
];

export default function LinkChildScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const [lang, setLang] = useState("en");
  const [parentName, setParentName] = useState("");
  const [relation, setRelation] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const t = LINK_CONSENT_TEXT[lang];
  const ok = parentName.trim().length >= 2 && relation && agreed;

  const make = async () => {
    setBusy(true);
    try {
      setResult(await createParentLinkCode({ parentName: parentName.trim(), relation, language: lang, version: LINK_CONSENT_VERSION }));
    } catch (e) {
      showAlert("Couldn't make the code", e?.message || String(e));
    }
    setBusy(false);
  };
  const share = () =>
    Share.share({ message: `Apprec8: open Me → "Link to my parent" and type this code: ${result.code} (works once, for ${result.hours} hours).` }).catch(() => {});

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>{t.title}</Text>
        {result ? (
          <>
            <View style={styles.codeCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>CODE FOR YOUR CHILD</Text>
                <Text style={styles.code} selectable>
                  {result.code}
                </Text>
              </View>
            </View>
            <Text style={styles.soft}>
              On your child's phone, signed in as your child: Me → Link to my parent → type this code. It works once, for {result.hours} hours.
            </Text>
          </>
        ) : (
          <>
            <View style={styles.chips}>
              {[
                ["en", "English"],
                ["hi", "हिंदी"],
              ].map(([id, label]) => (
                <Chip key={id} label={label} on={lang === id} onPress={() => setLang(id)} styles={styles} />
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.soft}>{t.body}</Text>
            </View>
            <Field label="YOUR NAME" value={parentName} onChangeText={setParentName} placeholder="e.g. Mohit" styles={styles} P={P} />
            <Text style={styles.label}>YOU ARE THE CHILD'S</Text>
            <View style={styles.chips}>
              {RELATIONS.map(([id, label]) => (
                <Chip key={id} label={label} on={relation === id} onPress={() => setRelation(id)} styles={styles} />
              ))}
            </View>
            <Pressable onPress={() => setAgreed((v) => !v)} accessibilityRole="checkbox" accessibilityState={{ checked: agreed }} style={[styles.row, { alignItems: "flex-start" }]}>
              <Text style={[styles.text, { color: agreed ? P.correctText : P.textSoft }]}>{agreed ? "☑" : "☐"}</Text>
              <Text style={[styles.soft, { flex: 1 }]}>{t.confirm}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        {result ? (
          <>
            <MainButton label="SHARE CODE" onPress={share} styles={styles} P={P} />
            <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" style={{ alignItems: "center", padding: 10 }}>
              <Text style={styles.soft}>Done</Text>
            </Pressable>
          </>
        ) : (
          <MainButton label="MAKE THE CODE" onPress={make} busy={busy} disabled={!ok} styles={styles} P={P} />
        )}
      </View>
    </View>
  );
}
