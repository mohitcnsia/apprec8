// screens/guides/TeacherStartScreen.js: Me → Guides → "For teachers: start here" (and Admin tools). The teachers'
// one-pager in plain words (data/teacherStart.js), with a SHARE button for WhatsApp. Owner 2026-11-06.
// G54: interactive with a small "DO IT ▶" button under each of the 4 jobs that starts the matching guide step.

import React, { useMemo } from "react";
import { Linking, Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "../admin/schoolUi";
import { markdownStyles } from "../admin/OwnerNotesScreen";
import {
  TEACHER_JOBS,
  TEACHER_START_INTRO_MD,
  TEACHER_START_REST_MD,
  TEACHER_START_SHARE,
} from "../../data/teacherStart";
import { guideById } from "../../utils/guides";
import { setActiveGuide } from "../../services/guideActive";
import { markGuide } from "../../services/guideFacts";

export default function TeacherStartScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const md = useMemo(
    () => ({
      ...markdownStyles(P),
      heading1: { color: P.text, fontFamily: "nunitoBold", fontSize: 26, marginBottom: 6 },
      heading2: { color: P.text, fontFamily: "nunitoBold", fontSize: 20, marginTop: 18, marginBottom: 4 },
      em: { color: P.selectedText, fontStyle: "normal", fontFamily: "nunitoBold" },
    }),
    [P]
  );
  const share = () => Share.share({ message: TEACHER_START_SHARE }).catch(() => {});

  const doJobStep = (stepId) => {
    const guide = guideById("teacher-class");
    if (!guide) return;
    const stepIndex = guide.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) return;
    const s = guide.steps[stepIndex];
    setActiveGuide({
      guideId: guide.id,
      stepId: s.id,
      n: stepIndex + 1,
      total: guide.steps.length,
      hint: s.hint,
    });
    markGuide(`${guide.id}.${s.id}.visited`);
    if (s.go.tab) {
      navigation.navigate(s.go.tab, {
        screen: s.go.screen || "ProgressScreen",
        params: s.go.params || { view: s.go.view || "classes" },
      });
    } else {
      navigation.navigate(s.go.screen, s.go.params);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>FOR TEACHERS · START HERE</Text>
        <Markdown style={md} onLinkPress={(u) => (/^https?:/.test(u) && Linking.openURL(u).catch(() => {}), false)}>
          {TEACHER_START_INTRO_MD}
        </Markdown>

        {TEACHER_JOBS.map((job) => (
          <View key={job.stepId} style={{ gap: 8, marginVertical: 4 }}>
            <Markdown style={md} onLinkPress={(u) => (/^https?:/.test(u) && Linking.openURL(u).catch(() => {}), false)}>
              {`**${job.title}**\n${job.body}`}
            </Markdown>
            <Pressable
              onPress={() => doJobStep(job.stepId)}
              accessibilityRole="button"
              accessibilityLabel={`Do step: ${job.title}`}
              style={[
                styles.smallButton,
                { alignSelf: "flex-start", paddingHorizontal: 16, marginTop: 2, marginBottom: 6 },
              ]}
            >
              <Text style={styles.smallButtonText}>DO IT ▶</Text>
            </Pressable>
          </View>
        ))}

        <Markdown style={md} onLinkPress={(u) => (/^https?:/.test(u) && Linking.openURL(u).catch(() => {}), false)}>
          {TEACHER_START_REST_MD}
        </Markdown>
      </ScrollView>
      <View style={styles.footer}>
        <MainButton label="SHARE WITH A TEACHER" onPress={share} styles={styles} P={P} />
      </View>
    </View>
  );
}
