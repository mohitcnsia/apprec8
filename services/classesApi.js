// services/classesApi.js
// RB-2 phase A (2026-11-04): schools, classes, join codes, teachers. Firestore rules (DR-9) enforce who can do what;
// these helpers only shape the writes. Data:
//   schools/{id}            { name, city, admins: [uid], createdBy, createdAt }
//   classes/{id}            { schoolId, schoolName, name, grade, kind: "school"|"tuition", subjects: [], joinCode,
//                             teacherIds: [uid], teacherSubjects: { uid: ["english", ...] }, createdBy, createdAt }
//   classCodes/{code}       { classId }
//   classes/{id}/members/{kidUid}  { firstName, grade, code, consentId, joinedAt }
//   consents/{id}           parent consent record (utils/classes.js consentRecord)
//   users/{uid}.classIds    kid's classes (max 3) · users/{uid}.teachesClassIds teacher's classes
//   roles/{uid}             { admin: true } app admins besides the owner (owner writes these)

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import functions from "@react-native-firebase/functions";
import { authInstance } from "../config/firebaseConfig";
import { makeClassCode, normalizeCode, canJoin, consentRecord, SUBJECTS } from "../utils/classes";

const db = getFirestore(getApp());
const me = () => authInstance.currentUser?.uid || null;

// ---------- admins / school admins ----------
export async function createSchool({ name, city = "" }) {
  const n = String(name || "").trim();
  if (n.length < 2) throw new Error("Please write the school's name");
  const ref = doc(collection(db, "schools"));
  await setDoc(ref, { name: n, city: String(city).trim(), admins: [], createdBy: me(), createdAt: serverTimestamp() });
  return ref.id;
}

export async function listSchools() {
  const snap = await getDocs(collection(db, "schools"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Schools where the current user is an admin or creator. */
export async function mySchoolAdminSchools() {
  const uid = me();
  if (!uid) return [];
  try {
    const all = await listSchools();
    return all.filter((s) => (Array.isArray(s.admins) && s.admins.includes(uid)) || s.createdBy === uid);
  } catch {
    return [];
  }
}

export async function listClassesOfSchool(schoolId) {
  const snap = await getDocs(query(collection(db, "classes"), where("schoolId", "==", schoolId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Creates a class with a fresh join code (retries if the code is taken). */
export async function createClass({ school, name, grade, kind = "school", subjects = [] }) {
  const n = String(name || "").trim();
  if (!school?.id || n.length < 1) throw new Error("Choose a school and write the class name (e.g. 5-B)");
  if (!Number.isInteger(grade) || grade < 1 || grade > 12) throw new Error("Choose the class level (1–12)");
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = makeClassCode();
    const codeRef = doc(db, "classCodes", code);
    if ((await getDoc(codeRef)).exists()) continue;
    const classRef = doc(collection(db, "classes"));
    const batch = writeBatch(db);
    batch.set(classRef, {
      schoolId: school.id,
      schoolName: school.name || "",
      name: n,
      grade,
      kind,
      subjects: (subjects || []).filter((x) => SUBJECTS.includes(x)), // what the class learns here (mockup L2)
      joinCode: code,
      teacherIds: [],
      teacherSubjects: {},
      createdBy: me(),
      createdAt: serverTimestamp(),
    });
    batch.set(codeRef, { classId: classRef.id });
    await batch.commit();
    return { id: classRef.id, code };
  }
  throw new Error("Couldn't make a unique code. Try again.");
}

/** Finds an account by email (server: admins and school admins only). The teacher must have signed in once. */
export async function findUserByEmail(email, schoolId) {
  const res = await functions().httpsCallable("findUserByEmail")({ email, schoolId });
  return res.data; // { uid, firstName }
}

/** Adds a teacher to a class for some subjects. */
export async function setTeacher({ classId, teacherUid, subjects }) {
  const subs = (subjects || []).filter((s) => SUBJECTS.includes(s));
  if (!subs.length) throw new Error("Pick at least one subject");
  // Server-side (functions/callable/schoolActions.js): checks app admin or this school's admin, then writes both docs.
  await functions().httpsCallable("assignTeacher")({ classId, teacherUid, subjects: subs });
}

export async function addSchoolAdmin({ schoolId, uid }) {
  const batch = writeBatch(db);
  batch.update(doc(db, "schools", schoolId), { admins: arrayUnion(uid) });
  await batch.commit();
}

// ---------- kids (with a parent) ----------
/** Looks up a class by code → { classId, class } or null. */
export async function findClassByCode(input) {
  const code = normalizeCode(input);
  if (!code) return null;
  const c = await getDoc(doc(db, "classCodes", code));
  if (!c.exists()) return null;
  const classId = c.data().classId;
  const cls = await getDoc(doc(db, "classes", classId));
  return cls.exists() ? { code, classId, class: { id: classId, ...cls.data() } } : null;
}

/** Joins a class after the parent's consent. myClassIds: the kid's current classes (from the user doc). */
export async function joinClass({ found, myClassIds = [], firstName, grade, parentName, relation, language }) {
  const uid = me();
  if (!uid) throw new Error("Sign in first");
  const check = canJoin(myClassIds, found?.classId);
  if (!check.ok) throw new Error(check.reason);
  if (String(uid).startsWith("demo_") !== String(found?.classId || "").startsWith("demo_")) throw new Error("Demo accounts can only join the Demo School."); // G38
  const record = consentRecord({ kidUid: uid, classId: found.classId, parentName, relation, language });
  const consentRef = doc(collection(db, "consents"));
  const batch = writeBatch(db);
  batch.set(consentRef, { ...record, acceptedAt: serverTimestamp(), acceptedAtClient: record.acceptedAt });
  // A join is a REQUEST: the teacher (who knows the family) approves it (owner 2026-11-04, child safety).
  // Only the server (approveMember) adds the class to users.classIds.
  batch.set(doc(db, "classes", found.classId, "members", uid), {
    firstName: String(firstName || "").trim().split(/\s+/)[0] || null,
    grade: Number.isInteger(grade) ? grade : null,
    code: found.code,
    consentId: consentRef.id,
    status: "pending",
    parentName: record.parentName,
    relation: record.relation,
    joinedAt: serverTimestamp(),
  });
  batch.set(doc(db, "users", uid), { pendingClassIds: arrayUnion(found.classId) }, { merge: true });
  await batch.commit();
}

export async function leaveClass(classId) {
  const uid = me();
  const batch = writeBatch(db);
  batch.delete(doc(db, "classes", classId, "members", uid));
  batch.set(doc(db, "users", uid), { classIds: arrayRemove(classId), pendingClassIds: arrayRemove(classId) }, { merge: true });
  await batch.commit();
}

export async function getClasses(ids = []) {
  const out = [];
  for (const id of ids) {
    const d = await getDoc(doc(db, "classes", id));
    if (d.exists()) out.push({ id, ...d.data() });
  }
  return out;
}

/** A teacher's classes. */
export async function myTeachingClasses() {
  const uid = me();
  if (!uid) return [];
  const snap = await getDocs(query(collection(db, "classes"), where("teacherIds", "array-contains", uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Teacher: approve (or reject) a join request. Server-side: checks the caller teaches this class. */
export async function approveMember({ classId, kidUid, approve }) {
  await functions().httpsCallable("approveMember")({ classId, kidUid, approve: !!approve });
}

export async function classMembers(classId) {
  const snap = await getDocs(collection(db, "classes", classId, "members"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

// ---------- Teacher invites (owner 2026-11-05, mockup L: no emails) ----------
/** Admin: a one-time code for a teacher of this class (7 days). → { code, expiresAtMs } */
export async function createTeacherInvite({ classId, subjects }) {
  const res = await functions().httpsCallable("createTeacherInvite")({ classId, subjects });
  return res.data;
}
/** Teacher: enter the code → a request the admin approves. → { className, schoolName, subjects } */
export async function redeemTeacherInvite(code) {
  const res = await functions().httpsCallable("redeemTeacherInvite")({ code });
  return res.data;
}
/** Admin / teacher: the class's teachers (with names) and waiting teacher requests. */
export async function classTeam(classId) {
  const res = await functions().httpsCallable("classTeam")({ classId });
  return res.data;
}
export async function decideTeacherRequest({ classId, uid, approve }) {
  await functions().httpsCallable("decideTeacherRequest")({ classId, uid, approve: !!approve });
}

/** Teacher: loads overview of classes taught by this teacher (stats + pending count + weakest topic) */
export async function loadTeacherClassesOverview(uid) {
  if (!uid) return { classes: [], pendingStudents: [] };
  const snap = await getDocs(query(collection(db, "classes"), where("teacherIds", "array-contains", uid)));
  const classesList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const classesOverview = [];
  const pendingStudents = [];

  for (const cls of classesList) {
    try {
      const allMembers = await classMembers(cls.id);
      const pending = allMembers.filter((m) => m.status === "pending");
      const approved = allMembers.filter((m) => m.status === "approved");

      if (pending.length > 0) {
        pendingStudents.push({
          classId: cls.id,
          className: cls.name,
          count: pending.length,
        });
      }

      let activeCount = 0;
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      const subtopicCounts = {};

      for (const m of approved) {
        const qId = (cls.subjects || []).includes("science") ? "science-quest" : "english-quest";
        try {
          const progSnap = await getDoc(doc(db, "users", m.uid, "questProgress", qId));
          if (progSnap.exists()) {
            const stats = progSnap.data()?.stats || {};
            if (stats.lastActiveAt && now - stats.lastActiveAt <= SEVEN_DAYS) {
              activeCount++;
            }
            Object.entries(stats.bySubtopic || {}).forEach(([sub, v]) => {
              if (v && v.total >= 3 && v.correct / v.total < 0.6) {
                subtopicCounts[sub] = (subtopicCounts[sub] || 0) + 1;
              }
            });
          }
        } catch {
          // ignore individual progress errors
        }
      }

      const weakestEntry = Object.entries(subtopicCounts).sort((a, b) => b[1] - a[1])[0];
      let weakestTopic = null;
      if (weakestEntry && weakestEntry[1] >= 2) {
        weakestTopic = weakestEntry[0].replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }

      classesOverview.push({
        ...cls,
        totalStudents: approved.length,
        activeStudents: activeCount,
        weakestTopic,
        pendingCount: pending.length,
      });
    } catch (e) {
      classesOverview.push({
        ...cls,
        totalStudents: 0,
        activeStudents: 0,
        weakestTopic: null,
        pendingCount: 0,
      });
    }
  }

  return { classes: classesOverview, pendingStudents };
}

/** Admin: loads pending teacher requests across schools/classes */
export async function loadAdminTeacherRequests(uid, isAdmin) {
  if (!uid) return [];
  const teacherRequests = [];
  try {
    let classesList = [];
    if (isAdmin) {
      const snap = await getDocs(collection(db, "classes"));
      classesList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } else {
      const mySchools = await mySchoolAdminSchools();
      for (const s of mySchools) {
        const clsSnap = await getDocs(query(collection(db, "classes"), where("schoolId", "==", s.id)));
        classesList.push(...clsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    }

    for (const cls of classesList) {
      try {
        const reqSnap = await getDocs(collection(db, "classes", cls.id, "teacherRequests"));
        if (reqSnap.size > 0) {
          teacherRequests.push({
            classId: cls.id,
            className: cls.name,
            count: reqSnap.size,
          });
        }
      } catch {
        // subcollection may be empty or unreadable
      }
    }
  } catch (e) {
    // ignore
  }
  return teacherRequests;
}
