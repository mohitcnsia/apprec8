// components/quiz/FixIeoQuestionsButton.js
// Applies data/fixes/ieoFixes.js to old IEO questions in Firestore (`quizQuestions`), admin only.
// Safe to press twice: a fixed question is skipped. A question whose text changed since the fixes were
// written is skipped too (reported). Each fixed doc keeps its old version in `fixBackup` (for undo).
// Then bumps English Quest's contentVersion so phones re-download the corrected questions.

import React, { useState } from "react";
import { Alert, Button, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { IEO_FIXES } from "../../data/fixes/ieoFixes";

const FIX_TAG = "ieoFixes-2026-11-04";

export default function FixIeoQuestionsButton() {
  const [loading, setLoading] = useState(false);
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID;
  if (!isAdmin) return null;

  const run = async () => {
    setLoading(true);
    const result = { fixed: 0, already: 0, changed: [], missing: [] };
    try {
      const db = firestore();
      for (const f of IEO_FIXES) {
        const ref = db.collection("quizQuestions").doc(f.docId);
        const snap = await ref.get();
        if (!snap.exists()) {
          result.missing.push(`${f.quizId} #${f.order}`);
          continue;
        }
        const d = snap.data() || {};
        if (d.fixedBy === FIX_TAG) {
          result.already += 1;
          continue;
        }
        if (String(d.question || "").trim() !== String(f.was).trim()) {
          result.changed.push(`${f.quizId} #${f.order}`);
          continue;
        }
        await ref.update({
          ...f.set,
          fixedBy: FIX_TAG,
          fixReason: f.why,
          fixedAt: firestore.FieldValue.serverTimestamp(),
          fixBackup: {
            question: d.question ?? null,
            options: d.options ?? null,
            answer: d.answer ?? null,
            explanation: d.explanation ?? null,
          },
        });
        result.fixed += 1;
      }
      // Phones cache English Quest content by contentVersion: bump it so they fetch the corrected questions.
      await db
        .collection("quests")
        .doc("english-quest")
        .set({ contentVersion: Date.now(), updatedAt: firestore.FieldValue.serverTimestamp() }, { merge: true });
      Alert.alert(
        "Old IEO questions fixed",
        `${result.fixed} fixed, ${result.already} already fixed.` +
          (result.changed.length ? `\nSkipped (changed since): ${result.changed.join(", ")}` : "") +
          (result.missing.length ? `\nNot found: ${result.missing.join(", ")}` : "")
      );
    } catch (e) {
      console.error("FixIeoQuestionsButton:", e);
      Alert.alert("Error", `${e.message}\n(${result.fixed} were fixed before the error.)`);
    }
    setLoading(false);
  };

  const confirm = () =>
    Alert.alert(
      `Fix ${IEO_FIXES.length} old IEO questions?`,
      "LIVE: corrects questions kids play in English Quest Unit 1 and IEO practice. Only continue if the owner approved it.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Fix", onPress: run },
      ]
    );

  return (
    <View style={{ marginVertical: 15, marginHorizontal: 20, borderRadius: 8, overflow: "hidden" }}>
      <Button
        title={loading ? "Fixing IEO questions..." : `Fix ${IEO_FIXES.length} old IEO questions`}
        onPress={confirm}
        disabled={loading}
        color="#A04E12"
      />
    </View>
  );
}
