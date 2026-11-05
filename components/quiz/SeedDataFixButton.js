import React, { useState } from 'react';
import { Button, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import spaceData from '../../data/space_olympiad_data.json';
import { showAlert } from "../../services/dialog";

export default function SeedDataFixButton() {
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setLoading(true);
    try {
      const db = firestore();
      const batch = db.batch();

      for (const quiz of spaceData.quizzes) {
        let qOrder = 1;
        for (const q of quiz.questions) {
          const qRef = db.collection("questions").doc(`${quiz.id}-q${qOrder}`);
          const questionData = typeof q.question === 'string' ? { type: 'text', content: q.question } : q.question;
          const optionsData = q.options.map(o => {
            if (typeof o === 'string') return { type: 'text', content: o };
            return {
              type: o.type || 'text',
              content: o.content,
              isCorrect: !!o.isCorrect,
              ...(o.mediaUrl ? { mediaUrl: o.mediaUrl } : {})
            };
          });

          batch.set(qRef, {
            quizId: quiz.id,
            question: questionData,
            options: optionsData,
            answer: q.answer || q.options.find(o => o.isCorrect)?.content,
            order: qOrder,
            explanation: q.explanation || null,
            createdAt: firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
          });
          qOrder++;
        }
      }

      await batch.commit();
      showAlert("Success", "Questions fixed for V2!");
    } catch (e) {
      console.error(e);
      showAlert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ marginVertical: 15, marginHorizontal: 20, borderRadius: 8, overflow: 'hidden' }}>
      <Button 
        title={loading ? "Fixing..." : "Fix Question Data for V2"} 
        onPress={seedData} 
        disabled={loading} 
        color="#8A2BE2" 
      />
    </View>
  );
}
