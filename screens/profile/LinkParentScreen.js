// screens/profile/LinkParentScreen.js
// Child: type the code from your parent to link your own account (product decision 9). Your login and progress stay.

import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "../admin/schoolUi";
import { redeemParentLinkCode } from "../../services/familyApi";
import { showAlert } from "../../services/dialog";

export default function LinkParentScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const tidy = code.toUpperCase().replace(/[\s-]/g, "");

  const link = async () => {
    setBusy(true);
    try {
      setDone(await redeemParentLinkCode(tidy));
    } catch (e) {
      showAlert("Couldn't link", e?.message || String(e));
    }
    setBusy(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: "flex-end" }]} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Link to my parent</Text>
        {done ? (
          <View style={styles.card}>
            <Text style={styles.title}>Linked ✓</Text>
            <Text style={styles.soft}>{done.parentName} can now see how you're doing. Your login, stars and progress stay exactly the same.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.soft}>Ask your parent for the code from their phone (Me → Link my child's own account).</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
              placeholder="K7P42M"
              placeholderTextColor={P.dimText}
              accessibilityLabel="Code from your parent"
              style={[styles.input, { height: 64, fontSize: 28, letterSpacing: 6, textAlign: "center" }]}
            />
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        {done ? (
          <MainButton label="DONE" onPress={() => navigation.goBack()} styles={styles} P={P} />
        ) : (
          <MainButton label="LINK" onPress={link} busy={busy} disabled={tidy.length !== 6} styles={styles} P={P} />
        )}
      </View>
    </View>
  );
}
