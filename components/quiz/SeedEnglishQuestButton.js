// components/quiz/SeedEnglishQuestButton.js
// Writes the English Quest to Firestore from data/englishQuestData.js.
// Only touches English Quest data:
//   quests/english-quest, quests/english-quest/nodes/*, categories/english-quest (tile),
//   studyContent/<new page + reading ids>, questions/<new quiz ids>-q*
// It never touches the Space quest (`quest_nodes`) or the old IEO content.

import React, { useState } from "react";
import { Button, Alert, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import {
  QUEST_ID,
  quest,
  tile,
  studyPages,
  readings,
  quizzes,
  nodes,
} from "../../data/englishQuestData";

const BATCH_LIMIT = 400; // below Firestore's hard limit of 500 writes per batch

/** Commits writes in order, in chunks. Deletes are queued before sets, so order is safe. */
async function commitInChunks(db, ops) {
  for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
    const chunk = db.batch();
    ops.slice(i, i + BATCH_LIMIT).forEach((op) => {
      if (op.kind === "delete") chunk.delete(op.ref);
      else if (op.options) chunk.set(op.ref, op.data, op.options);
      else chunk.set(op.ref, op.data);
    });
    await chunk.commit();
  }
}

export default function SeedEnglishQuestButton() {
  const [loading, setLoading] = useState(false);

  const seed = async () => {
    setLoading(true);
    try {
      const db = firestore();
      const now = firestore.FieldValue.serverTimestamp();
      // Collect every write first, then commit in chunks (Firestore allows max 500 per batch).
      const ops = [];
      const batch = {
        set: (ref, data, options) => ops.push({ kind: "set", ref, data, options }),
        delete: (ref) => ops.push({ kind: "delete", ref }),
      };

      // 1. Remove old nodes of THIS quest only (so deleted nodes disappear).
      const oldNodes = await db.collection("quests").doc(QUEST_ID).collection("nodes").get();
      oldNodes.forEach((d) => batch.delete(d.ref));

      // 2. Remove old questions of the new quizzes (a quiz may have shrunk).
      const quizIds = Object.keys(quizzes);
      for (let i = 0; i < quizIds.length; i += 10) {
        const chunk = quizIds.slice(i, i + 10);
        const oldQs = await db.collection("questions").where("quizId", "in", chunk).get();
        oldQs.forEach((d) => batch.delete(d.ref));
      }

      // 3. Quest info + tile
      batch.set(db.collection("quests").doc(QUEST_ID), { ...quest, updatedAt: now });
      batch.set(db.collection("categories").doc(QUEST_ID), { ...tile, lastUpdatedAt: now }, { merge: true });

      // 4. Tree nodes
      nodes.forEach(({ id, ...node }) => {
        batch.set(db.collection("quests").doc(QUEST_ID).collection("nodes").doc(id), {
          ...node,
          updatedAt: now,
        });
      });

      // 5. New study pages
      Object.entries(studyPages).forEach(([id, page]) => {
        batch.set(db.collection("studyContent").doc(id), {
          ...page,
          coverImage: page.coverImage || null,
          additionalImages: page.additionalImages || [],
          lastUpdatedAt: now,
        });
      });

      // 5b. Reading passages (studyContent with kind "reading"). `content` is a plain
      // fallback so older reader screens can still show the passage.
      Object.entries(readings).forEach(([id, r]) => {
        batch.set(db.collection("studyContent").doc(id), {
          ...r,
          kind: "reading",
          content: r.paragraphs.join("\n\n"),
          coverImage: r.coverImage || null,
          additionalImages: [],
          lastUpdatedAt: now,
        });
      });

      // 6. New questions (V2 format)
      Object.entries(quizzes).forEach(([quizId, questions]) => {
        questions.forEach((question, index) => {
          batch.set(db.collection("questions").doc(`${quizId}-q${index + 1}`), {
            ...question,
            quizId,
            order: index + 1,
            lastUpdatedAt: now,
          });
        });
      });

      await commitInChunks(db, ops);
      const questionCount = Object.values(quizzes).reduce((s, qs) => s + qs.length, 0);
      Alert.alert(
        "English Quest updated",
        `${nodes.filter((n) => n.kind === "unit").length} units, ${nodes.length} nodes, ${questionCount} new questions, ${Object.keys(readings).length} readings.`
      );
    } catch (e) {
      console.error("SeedEnglishQuestButton:", e);
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  // Only the admin account sees this button.
  const isAdmin =
    !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID;
  if (!isAdmin) return null;

  return (
    <View style={{ marginVertical: 15, marginHorizontal: 20, borderRadius: 8, overflow: "hidden" }}>
      <Button
        title={loading ? "Updating English Quest..." : "Update English Quest"}
        onPress={seed}
        disabled={loading}
        color="#145A3C"
      />
    </View>
  );
}
