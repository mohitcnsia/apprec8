// screens/profile/JoinByLinkScreen.js: the parent's one screen after tapping the teacher's class link (mockup
// "Parent joins a class", screen 3; doc "Simpler sign-up: one WhatsApp link", 2026-11-11). No codes: the link says
// which class. The parent picks or names the child, adds a roll number, their mobile (how the teacher calls them and,
// from stage 2, how the child finds them), Mother / Father / Guardian, and agrees to the consent form.
// Opened by hooks/useJoinLink.js with route.params.token.

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { listenToUserDocument } from "../../services/firestoreContentApi";
import { myChildren } from "../../services/familyApi";
import { classLinkInfo, joinClassByLink, studentJoinByLink } from "../../services/joinApi";
import { CHILD_CONSENT_TEXT, CHILD_CONSENT_VERSION } from "../../utils/family";
import { CONSENT_TEXT, CONSENT_VERSION } from "../../utils/classes";
import { formatMobile, normalizeMobile, normalizeRoll, joinPayload } from "../../utils/joinLink";
import ConsentListenButton from "../../components/common/ConsentListenButton";
import { showAlert } from "../../services/dialog";

const RELATIONS = [
  ["mother", "Mother · माँ"],
  ["father", "Father · पिता"],
  ["guardian", "Guardian · अभिभावक"],
];
const NEW = "new";

export default function JoinByLinkScreen({ route, navigation }) {
  const token = route?.params?.token || null;
  const classId = route?.params?.classId || null; // a class picked in the app (PickClassScreen), owner 12 Nov
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [user, setUser] = useState(undefined);
  const [info, setInfo] = useState(null); // { className, schoolName, grade, teacherNames }
  const [loadError, setLoadError] = useState(null);
  const [kids, setKids] = useState([]);
  const [pick, setPick] = useState(NEW); // a child's uid, or NEW
  const [firstName, setFirstName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [relation, setRelation] = useState(null);
  const [lang, setLang] = useState("en");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null); // { firstName, className, student }
  const [asStudent, setAsStudent] = useState(null); // null = guess from the account; true / false = the person chose

  useEffect(() => listenToUserDocument((d) => setUser(d || null), () => setUser(null)), []);
  useEffect(() => {
    if (!token && !classId) return setLoadError("This class link doesn't work. Ask the teacher to share it again.");
    classLinkInfo(token, classId)
      .then(setInfo)
      .catch((e) => setLoadError(e?.message || "Couldn't open this class. Check the internet and try again."));
  }, [token, classId]);
  const childKey = (user?.childUids || []).join(",");
  useEffect(() => {
    if (!childKey) return;
    myChildren(childKey.split(","))
      .then((list) => {
        setKids(list);
        if (list.length === 1) setPick(list[0].uid); // one child: most likely that one
      })
      .catch(() => {});
  }, [childKey]);
  useEffect(() => {
    if (user?.parentMobile && !mobile) setMobile(formatMobile(user.parentMobile));
  }, [user?.parentMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  const isNew = pick === NEW;
  const t = isNew ? CHILD_CONSENT_TEXT[lang] : CONSENT_TEXT[lang];
  const version = isNew ? CHILD_CONSENT_VERSION : CONSENT_VERSION;
  const childName = isNew ? firstName.trim().split(/\s+/)[0] : kids.find((k) => k.uid === pick)?.firstName || "your child";
  const className = info?.className || "the class";
  const teacher = info?.teacherNames?.length ? info.teacherNames.join(", ") : null;
  const form = { token, classId, kidUid: isNew ? null : pick, firstName, rollNo, mobile, relation, agreed, language: lang, version };
  let ready = false;
  try {
    joinPayload(form);
    ready = true;
  } catch {}

  const send = async () => {
    setBusy(true);
    try {
      const r = await joinClassByLink(form);
      setDone({ firstName: r.firstName, className: r.className });
    } catch (e) {
      showAlert("Couldn't join", e?.message || "Please try again.");
    }
    setBusy(false);
  };
  // A number typed by hand is read back once before it is saved (no text messages, so we check with the parent).
  const join = () => {
    const m = normalizeMobile(mobile);
    if (m && m === user?.parentMobile) return send();
    showAlert("Is this your number?", `${formatMobile(m)}\n\nYour child's teacher calls you on it, and your child finds you by it.`, [
      { text: "Change", style: "cancel" },
      { text: "Yes, it's right", onPress: send },
    ]);
  };

  // Who opened the link? A parent's account (has children) gets the parent's screen; a student's own account (a class,
  // or a linked parent) gets the student's screen (owner, 2026-11-11: Class 10 joins from their own phones).
  const parentAccount = (user?.childUids || []).length > 0 || !!user?.isParent;
  const studentGuess = !parentAccount && (!!user?.isChild || (user?.parentUids || []).length > 0 || Number.isInteger(user?.grade));
  const student = asStudent === null ? studentGuess : asStudent;
  const studentReady = !!normalizeMobile(mobile) && normalizeRoll(rollNo) !== null;
  const sendStudent = async () => {
    setBusy(true);
    try {
      const r = await studentJoinByLink({ token, classId, rollNo, parentMobile: mobile });
      setDone({ firstName: user?.firstName, className: r.className, student: true });
    } catch (e) {
      showAlert("Couldn't ask to join", e?.message || "Please try again.");
    }
    setBusy(false);
  };
  const joinStudent = () =>
    showAlert("Is this your parent's number?", `${formatMobile(normalizeMobile(mobile))}\n\nYour teacher calls this number to ask your parent.`, [
      { text: "Change", style: "cancel" },
      { text: "Yes, it's right", onPress: sendStudent },
    ]);

  if (done?.student) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.bigTitle}>You joined {done.className} ✓</Text>
        <Text style={s.softCenter}>Your class's lessons are on Home now. Start learning!</Text>
        <Text style={s.softCenter}>{teacher || "Your teacher"} will check with your parent, then you'll see your classmates too.</Text>
        <View style={[s.footer, s.footerAbs]}>
          <Pressable onPress={() => navigation.navigate("Apprec8")} style={s.button} accessibilityRole="button">
            <Text style={s.buttonText}>START LEARNING</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  if (done) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.bigTitle}>{done.firstName} joined {done.className} ✓</Text>
        <Text style={s.softCenter}>{done.firstName}'s class lessons are open now: Me → My children → Play as {done.firstName}.</Text>
        <Text style={s.softCenter}>{teacher || "The teacher"} will confirm, then {done.firstName} sees classmates too.</Text>
        <View style={[s.footer, s.footerAbs]}>
          <Pressable onPress={() => navigation.navigate("ProfileScreen")} style={s.button} accessibilityRole="button">
            <Text style={s.buttonText}>DONE</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  if (loadError || user === null) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.bigTitle}>This link didn't work</Text>
        <Text style={s.softCenter}>{loadError || "Please sign in and tap the link again."}</Text>
        <View style={[s.footer, s.footerAbs]}>
          <Pressable onPress={() => navigation.navigate("ProfileScreen")} style={s.button} accessibilityRole="button">
            <Text style={s.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  if (!info || user === undefined) {
    return (
      <View style={[s.screen, s.center]}>
        <ActivityIndicator color={P.label} />
      </View>
    );
  }
  if (student) {
    return (
      <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <Text style={s.label}>JOIN A CLASS</Text>
          <View style={s.classCard}>
            <Text style={s.classTitle}>{[info.className, info.schoolName].filter(Boolean).join(" · ")}</Text>
            {teacher ? <Text style={s.soft}>Teacher: {teacher}</Text> : null}
          </View>
          <Text style={s.soft}>
            You're joining as {user?.firstName || "you"}
            {Number.isInteger(user?.grade) ? `, Class ${user.grade}` : ""}.
          </Text>
          <Text style={s.label}>YOUR ROLL NUMBER</Text>
          <TextInput value={rollNo} onChangeText={setRollNo} placeholder="23" placeholderTextColor={P.dimText} style={s.input} autoCapitalize="characters" autoCorrect={false} maxLength={6} accessibilityLabel="Your roll number" />
          <Text style={s.label}>YOUR PARENT'S MOBILE NUMBER</Text>
          <TextInput value={mobile} onChangeText={setMobile} placeholder="98765 43210" placeholderTextColor={P.dimText} style={s.input} keyboardType="phone-pad" maxLength={16} accessibilityLabel="Your parent's mobile number" />
          <Text style={s.small}>
            {teacher || "Your teacher"} asks your parent to say yes, then lets you in. Only your teacher and Apprec8 see this number.
          </Text>
          <Pressable onPress={() => setAsStudent(false)} hitSlop={8} style={{ alignSelf: "center", minHeight: 44, justifyContent: "center" }} accessibilityRole="button">
            <Text style={s.small}>I'm a parent ›</Text>
          </Pressable>
        </ScrollView>
        <View style={s.footer}>
          <Pressable onPress={joinStudent} disabled={!studentReady || busy} style={[s.button, (!studentReady || busy) && s.buttonOff]} accessibilityRole="button">
            {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.buttonText}>ASK TO JOIN {String(className).toUpperCase()}</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.label}>JOIN A CLASS</Text>
        <View style={s.classCard}>
          <Text style={s.classTitle}>{[info.className, info.schoolName].filter(Boolean).join(" · ")}</Text>
          {teacher ? <Text style={s.soft}>Teacher: {teacher}</Text> : null}
        </View>

        {kids.length ? (
          <>
            <Text style={s.label}>WHO IS JOINING?</Text>
            <View style={s.chips}>
              {kids.map((k) => (
                <Pressable key={k.uid} onPress={() => setPick(k.uid)} style={[s.chip, pick === k.uid && s.chipOn]} accessibilityRole="radio" accessibilityState={{ selected: pick === k.uid }}>
                  <Text style={[s.chipText, pick === k.uid && { color: P.selectedText }]}>{k.firstName}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setPick(NEW)} style={[s.chip, isNew && s.chipOn]} accessibilityRole="radio" accessibilityState={{ selected: isNew }}>
                <Text style={[s.chipText, isNew && { color: P.selectedText }]}>+ Another child</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        {isNew ? (
          <>
            <Text style={s.label}>CHILD'S FIRST NAME</Text>
            <TextInput value={firstName} onChangeText={setFirstName} placeholder="Riya" placeholderTextColor={P.dimText} style={s.input} autoCapitalize="words" autoCorrect={false} maxLength={30} accessibilityLabel="Child's first name" />
          </>
        ) : null}

        <Text style={s.label}>ROLL NUMBER (IF THE SCHOOL GIVES ONE)</Text>
        <TextInput value={rollNo} onChangeText={setRollNo} placeholder="23" placeholderTextColor={P.dimText} style={s.input} autoCapitalize="characters" autoCorrect={false} maxLength={6} accessibilityLabel="Roll number" />

        <Text style={s.label}>YOUR MOBILE NUMBER</Text>
        <TextInput value={mobile} onChangeText={setMobile} placeholder="98765 43210" placeholderTextColor={P.dimText} style={s.input} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" maxLength={16} accessibilityLabel="Your mobile number" />
        <Text style={s.small}>Only {teacher || "the teacher"} and Apprec8 see it. No text messages.</Text>

        <Text style={s.label}>I AM {childName ? `${String(childName).toUpperCase()}'S` : "THE CHILD'S"}</Text>
        <View style={s.chips}>
          {RELATIONS.map(([id, name]) => (
            <Pressable key={id} onPress={() => setRelation(id)} style={[s.chip, relation === id && s.chipOn]} accessibilityRole="radio" accessibilityState={{ selected: relation === id }}>
              <Text style={[s.chipText, relation === id && { color: P.selectedText }]}>{name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.segment}>
          {[
            ["en", "English"],
            ["hi", "हिंदी"],
          ].map(([id, name]) => (
            <Pressable key={id} onPress={() => setLang(id)} style={[s.segmentItem, lang === id && s.segmentOn]} accessibilityRole="tab" accessibilityState={{ selected: lang === id }}>
              <Text style={[s.segmentText, lang === id && { color: P.selectedText }]}>{name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={s.consentCard}>
          <View style={s.consentHeader}>
            <Text style={s.consentTitle}>{t.title}</Text>
            <ConsentListenButton text={t} lang={lang} P={P} />
          </View>
          <Text style={s.consentBody}>{t.body}</Text>
        </View>
        <Pressable onPress={() => setAgreed((a) => !a)} style={s.agreeRow} accessibilityRole="checkbox" accessibilityState={{ checked: agreed }}>
          <View style={[s.box, agreed && s.boxOn]}>{agreed ? <Text style={s.tick}>✓</Text> : null}</View>
          <Text style={s.agreeText}>{t.confirm}</Text>
        </Pressable>
        {!parentAccount ? (
          <Pressable onPress={() => setAsStudent(true)} hitSlop={8} style={{ alignSelf: "center", minHeight: 44, justifyContent: "center" }} accessibilityRole="button">
            <Text style={s.small}>I'm the student ›</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      {/* Thumb zone (design rule 2) */}
      <View style={s.footer}>
        <Pressable onPress={join} disabled={!ready || busy} style={[s.button, (!ready || busy) && s.buttonOff]} accessibilityRole="button">
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.buttonText}>JOIN {String(className).toUpperCase()}</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    center: { justifyContent: "center", paddingHorizontal: 24, gap: 12 },
    content: { paddingTop: insets.top + 24, paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
    label: { fontSize: 13, letterSpacing: 1.2, fontFamily: "nunitoBold", color: P.label, marginTop: 6 },
    soft: { fontSize: 15, lineHeight: 21, fontFamily: "nunitoBold", color: P.textSoft },
    softCenter: { fontSize: 16, lineHeight: 23, fontFamily: "nunitoBold", color: P.textSoft, textAlign: "center" },
    small: { fontSize: 13, lineHeight: 18, fontFamily: "nunitoBold", color: P.textSoft },
    bigTitle: { fontSize: 24, fontFamily: "nunitoBold", color: P.text, textAlign: "center" },
    classCard: { padding: 16, borderRadius: 20, backgroundColor: P.selectedBg, gap: 4 },
    classTitle: { fontSize: 21, fontFamily: "nunitoBold", color: P.selectedText },
    input: { height: 54, borderRadius: 14, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, color: P.text, fontSize: 17, paddingHorizontal: 14, fontFamily: "nunitoBold" },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { minHeight: 44, justifyContent: "center", paddingHorizontal: 14, borderRadius: 22, borderWidth: 1, borderColor: P.border, backgroundColor: P.card },
    chipOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    chipText: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    segment: { flexDirection: "row", gap: 4, padding: 4, borderRadius: 16, backgroundColor: P.track, marginTop: 8 },
    segmentItem: { flex: 1, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    segmentOn: { backgroundColor: P.card },
    segmentText: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
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
    footerAbs: { position: "absolute", left: 0, right: 0, bottom: 0 },
    button: { height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center" },
    buttonOff: { opacity: 0.45 },
    buttonText: { color: P.onPrimary, fontSize: 17, fontFamily: "nunitoBold", letterSpacing: 1 },
  });
