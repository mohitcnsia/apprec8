// screens/admin/SchoolsScreen.js
// Schools & classes, list only (mockup L1, owner-approved 2026-11-05). No forms on the page: "+ New school" (thumb zone)
// and "Add a class" open sheets that close on save (L2). Tap a class → ClassDetail (code, approvals, teachers).
// Owner feedback 2026-11-04: forms between the list and the classes looked odd and stayed open; parents have no emails.

import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import Sheet from "../../components/common/Sheet";
import { makeSchoolStyles, Chip, MainButton, Field } from "./schoolUi";
import { createSchool, listSchools, listClassesOfSchool, createClass, classMembers, findUserByEmail, addSchoolAdmin } from "../../services/classesApi";
import { SUBJECTS, SUBJECT_NAMES, classSubjects } from "../../utils/classes";
import { showAlert } from "../../services/dialog";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function SchoolsScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const uid = authInstance.currentUser?.uid;
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && uid === APPREC8_TEAM_REVIEWER_UID;

  const [schools, setSchools] = useState(null); // [{ ...school, classes: [{ ...cls, waiting }] }]
  const [sheet, setSheet] = useState(null); // { type: "school" } | { type: "class", school } | { type: "settings", school }
  const [busy, setBusy] = useState(false);
  // form fields (reset whenever a sheet opens)
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [grade, setGrade] = useState(5);
  const [subjects, setSubjects] = useState(["english"]);
  const [tuition, setTuition] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const load = useCallback(async () => {
    try {
      const rawList = await listSchools();
      const list = isAdmin
        ? rawList
        : rawList.filter((s) => (Array.isArray(s.admins) && s.admins.includes(uid)) || s.createdBy === uid);
      const full = await Promise.all(
        list.map(async (s) => {
          const classes = await listClassesOfSchool(s.id);
          const withWaiting = await Promise.all(
            classes.map(async (c) => {
              try {
                const members = await classMembers(c.id);
                return { ...c, waiting: members.filter((m) => m.status === "pending").length };
              } catch {
                return { ...c, waiting: 0 };
              }
            })
          );
          return { ...s, classes: withWaiting.sort((a, b) => (a.grade || 0) - (b.grade || 0) || String(a.name).localeCompare(String(b.name))) };
        })
      );
      setSchools(full.sort((a, b) => String(a.name).localeCompare(String(b.name))));
    } catch (e) {
      setSchools([]);
      showAlert("Couldn't load schools", e?.message || String(e));
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const open = (s) => {
    setName("");
    setCity("");
    setGrade(5);
    setSubjects(["english"]);
    setTuition(false);
    setAdminEmail("");
    setSheet(s);
  };
  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      showAlert("Couldn't do that", e?.message || String(e));
    }
    setBusy(false);
  };
  const toggleSubject = (s) => setSubjects((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const saveSchool = () =>
    run(async () => {
      await createSchool({ name, city });
      setSheet(null);
      await load();
    });
  const saveClass = () =>
    run(async () => {
      if (!subjects.length) throw new Error("Pick at least one subject");
      const school = sheet.school;
      const { id } = await createClass({ school, name, grade, kind: tuition ? "tuition" : "school", subjects });
      setSheet(null);
      navigation.navigate("ClassDetail", { classId: id });
    });
  const saveAdmin = () =>
    run(async () => {
      const u = await findUserByEmail(adminEmail, sheet.school.id);
      await addSchoolAdmin({ schoolId: sheet.school.id, uid: u.uid });
      showAlert("Done", `${u.firstName} can now add classes and teachers for ${sheet.school.name}.`);
      setSheet(null);
    });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>SCHOOLS & CLASSES</Text>
        {schools === null ? <ActivityIndicator color={P.label} /> : null}
        {schools && schools.length === 0 ? <Text style={styles.soft}>No schools yet. Add your first one below.</Text> : null}

        {(schools || []).map((s) => (
          <View key={s.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{s.name}</Text>
                <Text style={styles.soft}>
                  {[s.city, `${s.classes.length} ${s.classes.length === 1 ? "class" : "classes"}`].filter(Boolean).join(" · ")}
                </Text>
              </View>
              <Pressable onPress={() => open({ type: "settings", school: s })} accessibilityRole="button" accessibilityLabel={`${s.name} settings`} style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={18} color={P.textSoft} />
              </Pressable>
            </View>

            {s.classes.map((c) => (
              <Pressable key={c.id} onPress={() => navigation.navigate("ClassDetail", { classId: c.id })} accessibilityRole="button" style={styles.classRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text}>
                    {c.name}
                    {c.kind === "tuition" ? " · tuition" : ""}
                  </Text>
                  <Text style={styles.small}>
                    {[`Class ${c.grade}`, classSubjects(c).map((x) => SUBJECT_NAMES[x] || x).join(", "), `${(c.teacherIds || []).length} teacher${(c.teacherIds || []).length === 1 ? "" : "s"}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                </View>
                {c.waiting ? <Text style={styles.pill}>{c.waiting} waiting</Text> : null}
                <Ionicons name="chevron-forward" size={18} color={P.textSoft} />
              </Pressable>
            ))}

            <Pressable onPress={() => open({ type: "class", school: s })} accessibilityRole="button" style={styles.link}>
              <Ionicons name="add" size={20} color={P.selectedText} />
              <Text style={styles.linkText}>Add a class</Text>
            </Pressable>
          </View>
        ))}

        {schools && schools.length ? <Text style={styles.dim}>Tap a class to share its code, approve parents and invite teachers.</Text> : null}
        {schools && schools.length === 0 ? <Text style={styles.soft}>No schools found for your account.</Text> : null}
      </ScrollView>

      {isAdmin ? (
        <View style={styles.footer}>
          <MainButton label="+ NEW SCHOOL" onPress={() => open({ type: "school" })} styles={styles} P={P} />
        </View>
      ) : null}

      {/* New school */}
      <Sheet visible={sheet?.type === "school"} onClose={() => setSheet(null)} title="New school" P={P}>
        <Field label="NAME" value={name} onChangeText={setName} placeholder="e.g. Glorious Academy" styles={styles} P={P} />
        <Field label="TOWN / CITY" value={city} onChangeText={setCity} placeholder="e.g. Banbasa" styles={styles} P={P} />
        <MainButton label="CREATE SCHOOL" onPress={saveSchool} busy={busy} disabled={name.trim().length < 2} styles={styles} P={P} />
      </Sheet>

      {/* New class */}
      <Sheet visible={sheet?.type === "class"} onClose={() => setSheet(null)} title="New class" subtitle={sheet?.school ? `in ${sheet.school.name}` : null} P={P}>
        <Field label="NAME" value={name} onChangeText={setName} placeholder="e.g. 5-B, or Sharma tuition" styles={styles} P={P} />
        <Text style={styles.label}>WHICH CLASS?</Text>
        <View style={styles.gradeGrid}>
          {GRADES.map((g) => (
            <Chip key={g} grade label={String(g)} on={grade === g} onPress={() => setGrade(g)} styles={styles} />
          ))}
        </View>
        <Text style={styles.label}>SUBJECTS</Text>
        <View style={styles.chips}>
          {SUBJECTS.map((s) => (
            <Chip key={s} label={SUBJECT_NAMES[s]} on={subjects.includes(s)} onPress={() => toggleSubject(s)} styles={styles} />
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 }}>
          <Text style={[styles.soft, { flex: 1 }]}>It's a tuition group, not a school class</Text>
          <Switch value={tuition} onValueChange={setTuition} accessibilityLabel="Tuition group" trackColor={{ true: P.primary, false: P.border }} thumbColor={tuition ? P.selectedText : P.textSoft} />
        </View>
        <Text style={styles.dim}>Next you get the class code to share.</Text>
        <MainButton label="CREATE CLASS" onPress={saveClass} busy={busy} disabled={!name.trim()} styles={styles} P={P} />
      </Sheet>

      {/* School settings: school admins (folded here; by email for now) */}
      <Sheet visible={sheet?.type === "settings"} onClose={() => setSheet(null)} title={sheet?.school?.name || "School"} subtitle="School admins can add classes and invite teachers." P={P}>
        <Field label="ADD A SCHOOL ADMIN BY EMAIL" value={adminEmail} onChangeText={setAdminEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Their Google email (they sign in once first)" styles={styles} P={P} />
        <MainButton label="ADD SCHOOL ADMIN" onPress={saveAdmin} busy={busy} disabled={!adminEmail.includes("@")} styles={styles} P={P} />
      </Sheet>
    </View>
  );
}
