// services/guideFacts.js
// Facts for the guide quests (utils/guides.js): small one-time reads of the same data the target screens already read,
// done only when the Guide screen opens. Marks are saved on this phone (AsyncStorage), never in Firestore.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { listSchools, listClassesOfSchool, classMembers, myTeachingClasses } from "./classesApi";
import { listAssignments } from "./assignmentsApi";
import { db, authInstance } from "../config/firebaseConfig";

const QUESTS = ["english-quest", "science-quest", "word-power", "word-bank"];

const MARKS_KEY = "guideMarks:v1";

export async function guideMarks() {
  try {
    return JSON.parse((await AsyncStorage.getItem(MARKS_KEY)) || "{}") || {};
  } catch {
    return {};
  }
}

/** Saves that something happened (e.g. "admin.invite"). Never throws. */
export async function markGuide(key) {
  try {
    const m = await guideMarks();
    if (m[key]) return;
    m[key] = Date.now();
    await AsyncStorage.setItem(MARKS_KEY, JSON.stringify(m));
  } catch {
    // a lost mark only means the step ticks a little later (from data)
  }
}

const countMembers = async (classes) => {
  let kids = 0;
  let approvedKids = 0;
  for (const c of classes.slice(0, 20)) {
    const ms = await classMembers(c.id).catch(() => []);
    kids += ms.length;
    approvedKids += ms.filter((m) => m.status === "approved").length;
  }
  return { kids, approvedKids };
};

/** Facts for one guide. Reads stay small: an admin's schools (a handful), a teacher's own classes. */
export async function loadGuideFacts(guideId) {
  const marks = await guideMarks();
  if (guideId === "admin-school") {
    const schools = await listSchools().catch(() => []);
    const classes = (await Promise.all(schools.slice(0, 20).map((s) => listClassesOfSchool(s.id).catch(() => [])))).flat();
    const teachers = classes.filter((c) => (c.teacherIds || []).length > 0).length;
    return { schools: schools.length, classes: classes.length, teachers, ...(await countMembers(classes)), marks };
  }
  if (guideId === "teacher-class") {
    const teaching = await myTeachingClasses().catch(() => []);
    let assignments = 0;
    for (const c of teaching.slice(0, 20)) assignments += (await listAssignments(c.id).catch(() => [])).length;
    return { teaching: teaching.length, assignments, ...(await countMembers(teaching)), marks };
  }
  const uid = authInstance.currentUser?.uid;
  if (guideId === "parent" && uid) {
    const me = await db.collection("users").doc(uid).get().catch(() => null);
    const d = (me && me.data && me.data()) || {};
    return { children: (d.childUids || []).length, pushParent: !!d.pushOptIn?.parent, marks };
  }
  if (guideId === "kid-first-day" && uid) {
    // The same 4 progress docs the Progress tab reads.
    const docs = await Promise.all(QUESTS.map((q) => db.collection("users").doc(uid).collection("questProgress").doc(q).get().catch(() => null)));
    const data = docs.map((s) => (s && s.data && s.data()) || null).filter(Boolean);
    const topicsDone = data.reduce((n, d) => n + Object.values(d.nodes || {}).filter((x) => x?.status === "completed").length, 0);
    return { questsStarted: data.length, topicsDone, marks };
  }
  return { marks };
}
