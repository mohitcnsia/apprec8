// screens/admin/SchoolsScreen.js
// RB-2 phase A (2026-11-04): app admins (owner, Seema) create schools and classes; school admins and app admins add
// teachers (by email, with subjects). Each class gets a join code that the teacher gives to parents. Admin tools → Schools.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { createSchool, listSchools, listClassesOfSchool, createClass, findUserByEmail, setTeacher, addSchoolAdmin } from "../../services/classesApi";
import { SUBJECTS, SUBJECT_NAMES, classLabel } from "../../utils/classes";

export default function SchoolsScreen() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [schools, setSchools] = useState(null);
  const [school, setSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [busy, setBusy] = useState(false);
  const [newSchool, setNewSchool] = useState("");
  const [newCity, setNewCity] = useState("");
  const [className, setClassName] = useState("");
  const [classGrade, setClassGrade] = useState(5);
  const [kind, setKind] = useState("school");
  const [openClass, setOpenClass] = useState(null);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [subjects, setSubjects] = useState(["english"]);
  const [adminEmail, setAdminEmail] = useState("");

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      Alert.alert("Couldn't do that", e?.message || String(e));
    }
    setBusy(false);
  };

  const loadSchools = useCallback(() => run(async () => setSchools(await listSchools())), []);
  useEffect(() => {
    loadSchools();
  }, [loadSchools]);
  const loadClasses = (s) => run(async () => setClasses(await listClassesOfSchool(s.id)));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>SCHOOLS</Text>
      {schools === null ? <ActivityIndicator color={P.label} /> : null}
      {(schools || []).map((s) => (
        <Pressable key={s.id} onPress={() => { setSchool(s); loadClasses(s); }} style={[styles.row, school?.id === s.id && styles.rowOn]} accessibilityRole="button">
          <Text style={styles.rowTitle}>{s.name}</Text>
          <Text style={styles.soft}>{s.city || ""}</Text>
        </Pressable>
      ))}
      <View style={styles.card}>
        <TextInput value={newSchool} onChangeText={setNewSchool} placeholder="New school name" placeholderTextColor={P.dimText} style={styles.input} />
        <TextInput value={newCity} onChangeText={setNewCity} placeholder="Town / city (e.g. Banbasa)" placeholderTextColor={P.dimText} style={styles.input} />
        <Pressable disabled={busy} onPress={() => run(async () => { await createSchool({ name: newSchool, city: newCity }); setNewSchool(""); setNewCity(""); await loadSchools(); })} style={styles.button}>
          <Text style={styles.buttonText}>+ ADD SCHOOL</Text>
        </Pressable>
      </View>

      {school ? (
        <>
          <Text style={styles.label}>{school.name.toUpperCase()} · CLASSES</Text>
          {classes.map((c) => (
            <View key={c.id} style={styles.card}>
              <Pressable onPress={() => setOpenClass(openClass === c.id ? null : c.id)} accessibilityRole="button">
                <Text style={styles.rowTitle}>{classLabel(c)} {c.kind === "tuition" ? "· tuition" : ""}</Text>
                <Text style={styles.soft}>Class {c.grade} · code <Text style={styles.code}>{c.joinCode}</Text> · {c.teacherIds?.length || 0} teacher(s)</Text>
              </Pressable>
              {openClass === c.id ? (
                <View style={{ gap: 8, marginTop: 8 }}>
                  <TextInput value={teacherEmail} onChangeText={setTeacherEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Teacher's email (they sign in once first)" placeholderTextColor={P.dimText} style={styles.input} />
                  <View style={styles.chips}>
                    {SUBJECTS.map((sub) => {
                      const on = subjects.includes(sub);
                      return (
                        <Pressable key={sub} onPress={() => setSubjects((l) => (on ? l.filter((x) => x !== sub) : [...l, sub]))} style={[styles.chip, on && styles.chipOn]}>
                          <Text style={styles.chipText}>{SUBJECT_NAMES[sub]}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Pressable
                    disabled={busy}
                    onPress={() =>
                      run(async () => {
                        const t = await findUserByEmail(teacherEmail, school.id);
                        await setTeacher({ classId: c.id, teacherUid: t.uid, subjects });
                        setTeacherEmail("");
                        Alert.alert("Teacher added", `${t.firstName} now teaches ${subjects.map((x) => SUBJECT_NAMES[x]).join(", ")} in ${c.name}.`);
                        await loadClasses(school);
                      })
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>+ ADD TEACHER</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          ))}
          <View style={styles.card}>
            <TextInput value={className} onChangeText={setClassName} placeholder="Class name (e.g. 5-B, or Sharma tuition)" placeholderTextColor={P.dimText} style={styles.input} />
            <View style={styles.chips}>
              {[3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                <Pressable key={g} onPress={() => setClassGrade(g)} style={[styles.chip, classGrade === g && styles.chipOn]}>
                  <Text style={styles.chipText}>{g}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.chips}>
              {[
                ["school", "School class"],
                ["tuition", "Tuition"],
              ].map(([id, name]) => (
                <Pressable key={id} onPress={() => setKind(id)} style={[styles.chip, kind === id && styles.chipOn]}>
                  <Text style={styles.chipText}>{name}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              disabled={busy}
              onPress={() =>
                run(async () => {
                  const r = await createClass({ school, name: className, grade: classGrade, kind });
                  setClassName("");
                  Alert.alert("Class created", `Join code: ${r.code}\nGive it to the teacher; parents type it in Me → Join a class.`);
                  await loadClasses(school);
                })
              }
              style={styles.button}
            >
              <Text style={styles.buttonText}>+ ADD CLASS</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>SCHOOL ADMINS (can add teachers and classes here)</Text>
          <View style={styles.card}>
            <TextInput value={adminEmail} onChangeText={setAdminEmail} autoCapitalize="none" keyboardType="email-address" placeholder="School admin's email" placeholderTextColor={P.dimText} style={styles.input} />
            <Pressable
              disabled={busy}
              onPress={() =>
                run(async () => {
                  const u = await findUserByEmail(adminEmail, school.id);
                  await addSchoolAdmin({ schoolId: school.id, uid: u.uid });
                  setAdminEmail("");
                  Alert.alert("Done", `${u.firstName} is now an admin of ${school.name}.`);
                })
              }
              style={styles.button}
            >
              <Text style={styles.buttonText}>+ ADD SCHOOL ADMIN</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 20, paddingHorizontal: 18, paddingBottom: insets.bottom + 30, gap: 10 },
    label: { fontSize: 13, letterSpacing: 1.2, fontFamily: "nunitoBold", color: P.label, marginTop: 8 },
    soft: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    row: { padding: 14, borderRadius: 16, borderWidth: 1, borderColor: P.border, backgroundColor: P.card },
    rowOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    rowTitle: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    code: { fontFamily: "nunitoBold", color: P.selectedText, letterSpacing: 2 },
    card: { padding: 14, borderRadius: 16, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, gap: 8 },
    input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: P.border, backgroundColor: P.bg, color: P.text, fontSize: 15, paddingHorizontal: 12, fontFamily: "nunitoBold" },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: P.border },
    chipOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    chipText: { fontSize: 14, fontFamily: "nunitoBold", color: P.text },
    button: { height: 48, borderRadius: 14, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    buttonText: { color: P.onPrimary, fontSize: 15, fontFamily: "nunitoBold", letterSpacing: 0.5 },
  });
