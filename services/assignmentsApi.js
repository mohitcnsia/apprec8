// services/assignmentsApi.js
// RB-7 teacher assignments (2026-11-04): classes/{classId}/assignments/{id} =
//   { questId, nodeIds[], nodeTitles[], kidIds: [] (empty = whole class), dueDate (YYYY-MM-DD) | null, note, createdBy, createdAt }
// Teachers of the class write; its members read (rules: docs/rules/rb2-classes.rules, DR-9).

import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { authInstance } from "../config/firebaseConfig";

const db = getFirestore(getApp());

export async function createAssignment({ classId, questId, nodes, kidIds = [], dueDate = null, note = "" }) {
  if (!classId || !questId || !nodes?.length) throw new Error("Pick a class, a quest and at least one topic");
  const ref = doc(collection(db, "classes", classId, "assignments"));
  await setDoc(ref, {
    questId,
    nodeIds: nodes.map((n) => n.id),
    nodeTitles: nodes.map((n) => n.title),
    kidIds,
    dueDate,
    note: String(note || "").trim().slice(0, 200),
    createdBy: authInstance.currentUser?.uid || null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteAssignment(classId, id) {
  await deleteDoc(doc(db, "classes", classId, "assignments", id));
}

export async function listAssignments(classId) {
  const snap = await getDocs(collection(db, "classes", classId, "assignments"));
  return snap.docs.map((d) => ({ id: d.id, classId, ...d.data() }));
}

/** Assignments for me (a kid) across my classes: whole-class ones + ones naming me. */
export async function myAssignments(classIds = []) {
  const uid = authInstance.currentUser?.uid;
  const out = [];
  for (const classId of classIds) {
    try {
      const list = await listAssignments(classId);
      list.filter((a) => !a.kidIds?.length || a.kidIds.includes(uid)).forEach((a) => out.push(a));
    } catch (e) {
      // rules not live yet, or class removed: ignore
    }
  }
  return out;
}

/** Topic ids assigned to me in one quest (for buildQuestPath extraUnlocked). */
export const assignedNodeIds = (assignments = [], questId) =>
  [...new Set(assignments.filter((a) => a.questId === questId).flatMap((a) => a.nodeIds || []))];
