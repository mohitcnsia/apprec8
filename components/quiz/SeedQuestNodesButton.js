import React, { useState } from 'react';
import { Button, Alert, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function SeedQuestNodesButton() {
  const [loading, setLoading] = useState(false);

  const seedNodes = async () => {
    setLoading(true);
    try {
      const db = firestore();
      const batch = db.batch();

      // First, get all existing nodes and delete them to start fresh
      const existingNodes = await db.collection('quest_nodes').get();
      existingNodes.forEach(doc => {
        batch.delete(doc.ref);
      });

      // The 5 Space Olympiad Levels
      const levels = [
        { id: 'space-level-1', title: "Level 1: The Solar System", order: 1 },
        { id: 'space-level-2', title: "Level 2: Moons and Eclipses", order: 2 },
        { id: 'space-level-3', title: "Level 3: Galaxies and Stars", order: 3 },
        { id: 'space-level-4', title: "Level 4: Space Physics and Exploration", order: 4 },
        { id: 'space-level-5', title: "Level 5: Planetary Facts", order: 5 },
      ];

      // Create new nodes
      levels.forEach((level) => {
        const nodeRef = db.collection('quest_nodes').doc(level.id);
        batch.set(nodeRef, {
          title: level.title,
          quizId: level.id,
          type: "Quiz",
          order: level.order,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      // Add a "Coming Soon!" node at the end
      const comingSoonRef = db.collection('quest_nodes').doc('space-level-6-coming-soon');
      batch.set(comingSoonRef, {
        title: "Coming Soon!",
        quizId: "space-level-6-coming-soon",
        type: "Quiz",
        order: 6,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();
      Alert.alert("Success", "Quest Map Updated to Space Olympiad!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ marginVertical: 15, marginHorizontal: 20, borderRadius: 8, overflow: 'hidden' }}>
      <Button 
        title={loading ? "Updating Map..." : "Update Quest Map to Space Olympiad"} 
        onPress={seedNodes} 
        disabled={loading} 
        color="#8A2BE2" 
      />
    </View>
  );
}
