// screens/guides/TeacherStartScreen.js: Me → Guides → "For teachers: start here" (and Admin tools). The teachers'
// one-pager in plain words (data/teacherStart.js), with a SHARE button for WhatsApp. Owner 2026-11-06.

import React, { useMemo } from "react";
import { Linking, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "../admin/schoolUi";
import { markdownStyles } from "../admin/OwnerNotesScreen";
import { TEACHER_START_MD, TEACHER_START_SHARE } from "../../data/teacherStart";

export default function TeacherStartScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const md = useMemo(() => ({ ...markdownStyles(P), heading1: { color: P.text, fontFamily: "nunitoBold", fontSize: 26, marginBottom: 6 }, heading2: { color: P.text, fontFamily: "nunitoBold", fontSize: 20, marginTop: 18, marginBottom: 4 }, em: { color: P.selectedText, fontStyle: "normal", fontFamily: "nunitoBold" } }), [P]);
  const share = () => Share.share({ message: TEACHER_START_SHARE }).catch(() => {});
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>FOR TEACHERS · START HERE</Text>
        <Markdown style={md} onLinkPress={(u) => (/^https?:/.test(u) && Linking.openURL(u).catch(() => {}), false)}>
          {TEACHER_START_MD}
        </Markdown>
      </ScrollView>
      <View style={styles.footer}>
        <MainButton label="SHARE WITH A TEACHER" onPress={share} styles={styles} P={P} />
      </View>
    </View>
  );
}
