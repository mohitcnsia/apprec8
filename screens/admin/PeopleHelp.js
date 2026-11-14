// screens/admin/PeopleHelp.js: Help buttons on one person's card in People (owner 13-14 Nov: "go ahead"; mockup in the
// sign-ups doc). Put in a class (the teacher still confirms) · Make a teacher · Delete account (owner only, type DELETE).
// The server checks and logs every help: functions/callable/peopleActions.js helpPerson.
import React, { useState } from "react";
import { ActivityIndicator, Linking, Pressable, Text, TextInput, View } from "react-native";
import functions from "@react-native-firebase/functions";
import { DEFAULT_MESSAGES, MESSAGE_SITUATIONS, messageSituation, fillMessage, toTemplate, whatsappUrl, emailUrl } from "../../utils/people";

const SUBJECTS = [
  ["english", "English"],
  ["science", "Science"],
  ["wordpower", "Word Power"],
  ["maths", "Maths"],
];

let classesPromise = null; // one read per app session, shared by every card
const loadClasses = () => {
  if (!classesPromise) classesPromise = functions().httpsCallable("joinableClasses")({}).then((r) => r.data?.schools || []).catch((e) => ((classesPromise = null), Promise.reject(e)));
  return classesPromise;
};

export default function PeopleHelp({ person: p, isOwner, schoolIds, messages = {}, s, P, onDone }) {
  const situation = messageSituation(p);
  const [text, setText] = useState(() => fillMessage(messages[situation] || DEFAULT_MESSAGES[situation], p));
  const [msgNote, setMsgNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(null); // "class" | "teacher" | "delete"
  const [schools, setSchools] = useState(null);
  const [classId, setClassId] = useState(null);
  const [subjects, setSubjects] = useState(["english"]);
  const [name, setName] = useState("");
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const kind = p.baseKind || p.kind; // a TEST account still gets the buttons for what it really is
  const learner = ["student", "child", "none"].includes(kind);
  const adult = ["none", "parent", "student", "learner"].includes(kind);
  const canDelete = isOwner && p.kind !== "robot";
  if (p.kind === "robot") return null;

  const saveTemplate = () => {
    setSaving(true);
    setMsgNote("");
    functions()
      .httpsCallable("saveHelpMessage")({ key: situation, text: toTemplate(text, p) })
      .then(() => {
        messages[situation] = toTemplate(text, p); // other cards on this screen use it at once
        setMsgNote(`✓ Saved. Everyone "${MESSAGE_SITUATIONS[situation].toLowerCase()}" gets this message now.`);
      })
      .catch((e) => setMsgNote(e?.code === "functions/not-found" ? "Deploy saveHelpMessage first (see My notes)." : e?.message || "Couldn't save."))
      .finally(() => setSaving(false));
  };

  const open = (m) => {
    setMode(mode === m ? null : m);
    setMsg("");
    setClassId(null);
    if ((m === "class" || m === "teacher") && !schools) {
      loadClasses()
        .then((all) => setSchools(schoolIds ? all.filter((sc) => schoolIds.includes(sc.schoolId)) : all))
        .catch(() => setMsg("Couldn't load classes. Try again."));
    }
  };

  const run = (payload) => {
    setBusy(true);
    setMsg("");
    functions()
      .httpsCallable("helpPerson")({ uid: p.uid, ...payload })
      .then((r) => {
        setMsg(`✓ ${r.data?.message || "Done."}`);
        setMode(null);
        onDone?.();
      })
      .catch((e) => setMsg(e?.code === "functions/not-found" && /helpPerson/.test(e?.message || "") ? "Deploy helpPerson first (see My notes)." : e?.message || "Couldn't do it. Try again."))
      .finally(() => setBusy(false));
  };

  const chip = (key, label, on, onPress) => (
    <Pressable key={key} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: on }} style={[s.chipBtn, on && s.tabOn]}>
      <Text style={[s.chipBtnText, on && s.tabTextOn]}>{label}</Text>
    </Pressable>
  );

  const classPicker = () =>
    !schools ? (
      <ActivityIndicator color={P.label} />
    ) : schools.length ? (
      schools.map((sc) => (
        <View key={sc.schoolId || sc.schoolName} style={{ gap: 6 }}>
          <Text style={s.small}>{sc.schoolName}</Text>
          <View style={s.tabs}>{sc.classes.map((c) => chip(c.classId, `${c.name}${c.grade ? ` · Class ${c.grade}` : ""}`, classId === c.classId, () => setClassId(c.classId)))}</View>
        </View>
      ))
    ) : (
      <Text style={s.small}>No classes you can manage.</Text>
    );

  const mainBtn = (label, enabled, onPress) => (
    <Pressable onPress={onPress} disabled={!enabled || busy} accessibilityRole="button" style={[s.action, (!enabled || busy) && { opacity: 0.4 }]}>
      {busy ? <ActivityIndicator color={P.selectedText} /> : <Text style={s.actionText}>{label}</Text>}
    </Pressable>
  );

  return (
    <View style={{ gap: 8, marginTop: 6 }}>
      <Text style={s.helpTitle}>MESSAGE · {MESSAGE_SITUATIONS[situation].toUpperCase()}</Text>
      <TextInput value={text} onChangeText={setText} multiline style={[s.search, { minHeight: 120, paddingTop: 10, textAlignVertical: "top" }]} accessibilityLabel="Message to send" />
      <View style={s.tabs}>
        {chip("wa", "WhatsApp", false, () => Linking.openURL(whatsappUrl(text)).catch(() => {}))}
        {p.email ? chip("em", "Email", false, () => Linking.openURL(emailUrl(p.email, text)).catch(() => {})) : null}
        {chip("save", saving ? "Saving…" : "Save for everyone like this", false, () => !saving && saveTemplate())}
      </View>
      <Text style={s.small}>WhatsApp opens with this message ready; pick {p.name || "them"} from your contacts.</Text>
      {msgNote ? <Text style={msgNote.startsWith("✓") ? s.small : s.warn}>{msgNote}</Text> : null}

      {learner || adult || canDelete ? <Text style={s.helpTitle}>HELP (nothing here deletes, except Delete)</Text> : null}
      <View style={s.tabs}>
        {learner ? chip("class", "Put in a class", mode === "class", () => open("class")) : null}
        {adult ? chip("teacher", "Make a teacher", mode === "teacher", () => open("teacher")) : null}
        {canDelete ? chip("delete", "Delete account…", mode === "delete", () => open("delete")) : null}
      </View>

      {mode === "class" ? (
        <View style={s.helpBox}>
          <Text style={s.small}>They go on the class's waiting list; the teacher still confirms every child.</Text>
          {!p.name ? <TextInput value={name} onChangeText={setName} placeholder="Their first name" placeholderTextColor={P.dimText} style={s.search} /> : null}
          {classPicker()}
          {mainBtn("Put on the waiting list", !!classId && (p.name || name.trim().length >= 2), () => run({ action: "class", classId, firstName: name.trim() }))}
        </View>
      ) : null}

      {mode === "teacher" ? (
        <View style={s.helpBox}>
          <Text style={s.small}>Pick the class and what they teach.</Text>
          {classPicker()}
          <View style={s.tabs}>{SUBJECTS.map(([id, label]) => chip(id, label, subjects.includes(id), () => setSubjects((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]))))}</View>
          {mainBtn("Make a teacher", !!classId && subjects.length > 0, () => run({ action: "teacher", classId, subjects }))}
        </View>
      ) : null}

      {mode === "delete" ? (
        <View style={s.helpBox}>
          <Text style={s.warn}>Erases {p.name || "this account"}'s account and everything in it: progress, answers, class places. It can't be undone.</Text>
          <Text style={s.small}>Use it when they asked to be deleted, or for our own test accounts. Type DELETE to confirm.</Text>
          <TextInput value={typed} onChangeText={setTyped} placeholder="DELETE" placeholderTextColor={P.dimText} autoCapitalize="characters" autoCorrect={false} style={s.search} />
          {mainBtn("Delete for ever", typed.trim() === "DELETE", () => run({ action: "delete", typed: typed.trim() }))}
        </View>
      ) : null}

      {msg ? <Text style={msg.startsWith("✓") ? s.small : s.warn}>{msg}</Text> : null}
    </View>
  );
}
