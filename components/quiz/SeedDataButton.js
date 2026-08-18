import React, { useState } from 'react';
import { Button, Alert, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import spaceData from '../../data/space_olympiad_data.json';

export default function SeedDataButton() {
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setLoading(true);
    try {
      const db = firestore();
      const batch = db.batch();

      // Category
      const catRef = db.collection('categories').doc(spaceData.category.id);
      batch.set(catRef, {
        title: spaceData.category.title,
        type: spaceData.category.type,
        order: spaceData.category.order,
        description: spaceData.category.description || null,
        image: spaceData.category.image || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Quizzes
      for (const quiz of spaceData.quizzes) {
        const quizRef = db.collection('topics').doc(quiz.id);
        batch.set(quizRef, {
          title: quiz.title,
          type: "QUIZ",
          parentTopicId: null,
          categoryId: spaceData.category.id,
          hasSubtopics: false,
          order: quiz.order,
          passingScore: quiz.passingScore || Math.floor(quiz.questions.length * 0.7),
          maxScore: quiz.questions.length * 10,
          config: quiz.config || { shuffleQuestions: true, shuffleOptions: true, maxLives: 5 },
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
        });

        let qOrder = 1;
        for (const q of quiz.questions) {
          const qRef = db.collection("quizQuestions").doc(`${quiz.id}-q${qOrder}`);
          batch.set(qRef, {
            parentId: quiz.id,
            question: q.question, // The object or string
            options: typeof q.options[0] === 'string' ? q.options : q.options.map(o => o.content),
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
      Alert.alert("Success", "Space Olympiad Data Seeded!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ marginVertical: 15, marginHorizontal: 20, borderRadius: 8, overflow: 'hidden' }}>
      <Button 
        title={loading ? "Seeding..." : "Seed Space Olympiad Data"} 
        onPress={seedData} 
        disabled={loading} 
        color="#8A2BE2" 
      />
    </View>
  );
}
