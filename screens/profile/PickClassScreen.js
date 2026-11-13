// screens/profile/PickClassScreen.js: join a class inside the app (owner, 12 Nov: "a person wants to learn"). No link to
// come back to: pick your school, tap your class, and the same join screen as the WhatsApp link opens (JoinByLink with a
// classId). The teacher still approves every child, but the class course opens as soon as the child asks.
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { joinableClasses } from "../../services/joinApi";
import { listenToUserDocument } from "../../services/firestoreContentApi";
import { classesFor, firstSchool } from "../../utils/pickClass";

export default function PickClassScreen({ navigation, route }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState(null);
  const [error, setError] = useState("");
  const [schoolId, setSchoolId] = useState(undefined); // undefined = not chosen yet
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => listenToUserDocument((d) => setUser(d || null), () => {}), []);
  useEffect(() => {
    joinableClasses()
      .then(setSchools)
      .catch((e) => setError(e?.code === "functions/not-found" ? "This needs an update on our side. Please try again in a little while." : "Couldn't load the classes. Check the internet and try again."));
  }, []);
  // A parent joining a child's class passes the child's class (Home's join card); otherwise the person's own class.
  const forGrade = route?.params?.grade;
  const grade = Number.isInteger(forGrade) ? forGrade : Number.isInteger(user?.grade) && !(user?.childUids || []).length ? user.grade : null;
  useEffect(() => {
    if (schools && schoolId === undefined) {
      const first = firstSchool(schools, grade);
      if (first !== null) setSchoolId(first);
    }
  }, [schools, grade]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear the join screens off the Me tab first, or Me keeps showing "Join your class" (walk, 13 Nov).
  const learnAlone = () => {
    navigation.popToTop();
    navigation.navigate("Apprec8");
  };
  const pick = (c) => navigation.navigate("JoinByLink", { classId: c.classId });
  const school = (schools || []).find((x) => (x.schoolId ?? "none") === schoolId) || null;

  if (error) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.soft}>{error}</Text>
      </View>
    );
  }
  if (!schools) {
    return (
      <View style={[s.screen, s.center]}>
        <ActivityIndicator color={P.label} />
      </View>
    );
  }

  const names = (c) => [...new Set(c.teachers)]; // each teacher once (a teacher with two accounts showed twice)
  const ClassRow = ({ c }) => (
    <Pressable onPress={() => pick(c)} accessibilityRole="button" accessibilityLabel={`Join ${c.name}${c.teachers.length ? `, ${names(c).join(" and ")}` : ""}`} style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{c.name}</Text>
        {c.teachers.length ? <Text style={s.soft}>{names(c).join(", ")}</Text> : null}
      </View>
      <Text style={s.chev}>›</Text>
    </Pressable>
  );
  const split = school ? classesFor(school, grade) : null;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.h1}>Join your class</Text>
      <Text style={s.soft}>Your teacher lets you in. You can start learning straight away.</Text>

      {!school ? (
        <>
          <Text style={s.label}>YOUR SCHOOL</Text>
          {schools.map((sc) => (
            <Pressable key={sc.schoolId ?? "none"} onPress={() => setSchoolId(sc.schoolId ?? "none")} accessibilityRole="button" style={s.row}>
              <Text style={[s.rowTitle, { flex: 1 }]}>{sc.schoolName}</Text>
              <Text style={s.chev}>›</Text>
            </Pressable>
          ))}
        </>
      ) : (
        <>
          <Pressable onPress={() => (schools.length > 1 ? setSchoolId(null) : null)} accessibilityRole="button" style={s.schoolLine}>
            <Text style={s.label}>{school.schoolName.toUpperCase()}</Text>
            {schools.length > 1 ? <Text style={s.link}>Change</Text> : null}
          </Pressable>
          {grade ? <Text style={s.label}>CLASS {grade}</Text> : null}
          {split.mine.length ? split.mine.map((c) => <ClassRow key={c.classId} c={c} />) : <Text style={s.soft}>No Class {grade} here yet.</Text>}
          {split.others.length ? (
            <Pressable onPress={() => setShowOthers((v) => !v)} accessibilityRole="button" style={s.fold}>
              <Text style={s.link}>{showOthers ? "Hide other classes" : `Other classes (${split.others.length}) ›`}</Text>
            </Pressable>
          ) : null}
          {showOthers ? split.others.map((c) => <ClassRow key={c.classId} c={c} />) : null}
        </>
      )}

      <View style={s.alone}>
        <Text style={s.soft}>School not here? Ask your teacher to start a class on Apprec8. Everything for your class is already on Home.</Text>
        <Pressable onPress={learnAlone} accessibilityRole="button" style={s.button}>
          <Text style={s.buttonText}>START LEARNING</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    center: { alignItems: "center", justifyContent: "center", padding: 24 },
    content: { padding: 16, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32, gap: 10 },
    h1: { fontSize: 24, fontFamily: "nunitoBold", color: P.text },
    label: { fontSize: 12, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label, marginTop: 10 },
    soft: { fontSize: 14, fontFamily: "nunito", color: P.textSoft, lineHeight: 20 },
    link: { fontSize: 14, fontFamily: "nunitoBold", color: P.label },
    row: { flexDirection: "row", alignItems: "center", minHeight: 60, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, borderWidth: 1.5, borderColor: P.border, backgroundColor: P.card },
    rowTitle: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    chev: { fontSize: 24, color: P.label, marginLeft: 8 },
    schoolLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 36 },
    fold: { minHeight: 44, justifyContent: "center" },
    alone: { marginTop: 24, gap: 12 },
    button: { minHeight: 52, borderRadius: 16, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    buttonText: { fontSize: 16, fontFamily: "nunitoBold", color: P.onPrimary, letterSpacing: 1 },
  });
