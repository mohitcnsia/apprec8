// screens/profile/ParentPinScreen.js
// One phone, several profiles (owner 2026-11-04: kids use the parent's phone).
// mode "set": the parent chooses a 4-digit PIN (twice). mode "unlock": in a child's profile, the parent types the PIN
// to switch the phone back to the parent's account.

import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { setParentPin, backToParent } from "../../services/familyApi";

export default function ParentPinScreen({ route, navigation }) {
  const mode = route?.params?.mode || "set";
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const [pin, setPin] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);

  const ok = /^\d{4}$/.test(pin) && (mode === "unlock" || pin === again);
  const submit = async () => {
    setBusy(true);
    try {
      if (mode === "set") {
        await setParentPin(pin);
        Alert.alert("PIN saved", "Now you can tap \"Play as …\" for your child. Your child needs this PIN to switch back to you.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await backToParent(pin); // the app reloads as the parent
      }
    } catch (e) {
      Alert.alert(mode === "set" ? "Couldn't save" : "Couldn't switch", e?.message || String(e));
    }
    setBusy(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.label}>{mode === "set" ? "PARENT PIN" : "SWITCH TO PARENT"}</Text>
        <Text style={styles.soft}>
          {mode === "set"
            ? "Choose 4 numbers. Keep them secret from your child: they protect your account and parent settings."
            : "Parent: type your 4-number PIN. / माता-पिता: अपना 4 अंकों का PIN लिखें।"}
        </Text>
        <TextInput value={pin} onChangeText={(v) => setPin(v.replace(/\D/g, "").slice(0, 4))} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="••••" placeholderTextColor={P.dimText} style={styles.pin} accessibilityLabel="PIN" />
        {mode === "set" ? (
          <TextInput value={again} onChangeText={(v) => setAgain(v.replace(/\D/g, "").slice(0, 4))} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="Again" placeholderTextColor={P.dimText} style={styles.pin} accessibilityLabel="PIN again" />
        ) : null}
      </View>
      <View style={styles.footer}>
        <Pressable onPress={submit} disabled={!ok || busy} style={[styles.button, (!ok || busy) && { opacity: 0.45 }]}>
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{mode === "set" ? "SAVE PIN" : "SWITCH"}</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { flex: 1, paddingTop: insets.top + 32, paddingHorizontal: 24, gap: 14 },
    label: { fontSize: 13, letterSpacing: 1.2, fontFamily: "nunitoBold", color: P.label },
    soft: { fontSize: 15, lineHeight: 22, fontFamily: "nunitoBold", color: P.textSoft },
    pin: { height: 70, borderRadius: 18, borderWidth: 2, borderColor: P.selectedBorder, backgroundColor: P.card, color: P.text, fontSize: 32, letterSpacing: 16, textAlign: "center", fontFamily: "nunitoBold" },
    footer: { paddingHorizontal: 20, paddingBottom: Math.max(22, insets.bottom + 14) },
    button: { height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center" },
    buttonText: { color: P.onPrimary, fontSize: 17, fontFamily: "nunitoBold", letterSpacing: 1 },
  });
