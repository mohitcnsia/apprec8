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

      // Delete existing nodes
      const existingNodes = await db.collection('quest_nodes').get();
      existingNodes.forEach(doc => {
        batch.delete(doc.ref);
      });

      // 1. Study content
      const studyContents = [
        {
          id: 'study-node-1-content',
          name: "Comets and Meteors",
          author: "Space Academy",
          content: "# Comets and Meteors\n\nA **comet** is an icy, small Solar System body that, when passing close to the Sun, warms and begins to release gases, a process called outgassing. This produces a visible atmosphere or coma, and sometimes also a tail.\n\n# Meteors\n\nA meteor, known colloquially as a shooting star or falling star, is the visible passage of a glowing meteoroid, micrometeoroid, comet or asteroid through Earth's atmosphere, after being heated to incandescence by collisions with air molecules in the upper atmosphere, creating a streak of light via its rapid motion and sometimes also by shedding glowing material in its wake."
        },
        {
          id: 'study-node-2-content',
          name: "The History of Astronomy",
          author: "Space Academy",
          content: "# Early Astronomy\n\nAstronomy is the oldest of the natural sciences, dating back to antiquity, with its origins in the religious, mythological, cosmological, calendrical, and astrological beliefs and practices of prehistory.\n\nEarly civilizations such as the Babylonians, Greeks, Indians, Egyptians, Chinese, Maya, and many ancient indigenous peoples of the Americas performed methodical observations of the night sky."
        },
        {
          id: 'study-node-3-content',
          name: "Rockets and Spacecraft",
          author: "Space Academy",
          content: "# Rockets\n\nA rocket is a vehicle that uses thrust from a rocket engine to produce motion. Rocket engines work by action and reaction and push rockets forward simply by expelling their exhaust in the opposite direction at high speed.\n\n# Spacecraft\n\nA spacecraft is a vehicle or machine designed to fly in outer space. Spacecraft are used for a variety of purposes, including communications, earth observation, meteorology, navigation, space colonization, planetary exploration, and transportation of humans and cargo."
        },
        {
          id: 'study-node-4-content',
          name: "The Universe and Cosmology",
          author: "Space Academy",
          content: "# Cosmology\n\nCosmology is a branch of astronomy concerned with the studies of the origin and evolution of the universe, from the Big Bang to today and on into the future.\n\n# The Universe\n\nThe universe is all of space and time and their contents, including planets, stars, galaxies, and all other forms of matter and energy. The Big Bang theory is the prevailing cosmological description of the development of the universe."
        },
        {
          id: 'study-node-5-content',
          name: "The Search for Extraterrestrial Life",
          author: "Space Academy",
          content: "# Astrobiology\n\nAstrobiology is a scientific field within the life and environmental sciences that studies the origins, early evolution, distribution, and future of life in the universe by investigating its deterministic conditions and contingent events.\n\n# SETI\n\nThe search for extraterrestrial intelligence (SETI) is a collective term for scientific searches for intelligent extraterrestrial life, for example, monitoring electromagnetic radiation for signs of transmissions from civilizations on other planets."
        }
      ];

      studyContents.forEach((study) => {
        const studyRef = db.collection('studyContent').doc(study.id);
        batch.set(studyRef, {
          name: study.name,
          author: study.author,
          content: study.content,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      // 2. Quest Map Nodes
      const questNodes = [
        { id: 'space-level-1', title: "Level 1: The Solar System", type: "Quiz" },
        { id: 'study-node-1', title: "Study: Comets and Meteors", type: "Study", contentId: "study-node-1-content" },
        { id: 'space-level-2', title: "Level 2: Moons and Eclipses", type: "Quiz" },
        { id: 'game-vocab-1', title: "Game: Vocab Builder", type: "VocabBuilder", contentId: "vocab-space-basics" },
        { id: 'space-level-3', title: "Level 3: Galaxies and Stars", type: "Quiz" },
        { id: 'study-node-2', title: "Study: The History of Astronomy", type: "Study", contentId: "study-node-2-content" },
        { id: 'space-level-4', title: "Level 4: Space Physics and Exploration", type: "Quiz" },
        { id: 'game-spell-1', title: "Game: Spelling Bee", type: "SpellingBee", contentId: "bee-1" },
        { id: 'space-level-5', title: "Level 5: Planetary Facts", type: "Quiz" },
        { id: 'study-node-3', title: "Study: Rockets and Spacecraft", type: "Study", contentId: "study-node-3-content" },
        { id: 'space-level-6', title: "Level 6: Comets, Asteroids, and Meteors", type: "Quiz" },
        { id: 'game-vocab-2', title: "Game: Vocab Builder 2", type: "VocabBuilder", contentId: "vocab-advanced" },
        { id: 'space-level-7', title: "Level 7: The History of Astronomy", type: "Quiz" },
        { id: 'study-node-4', title: "Study: The Universe and Cosmology", type: "Study", contentId: "study-node-4-content" },
        { id: 'space-level-8', title: "Level 8: Rockets and Spacecraft", type: "Quiz" },
        { id: 'game-spell-2', title: "Game: Spelling Bee 2", type: "SpellingBee", contentId: "bee-2" },
        { id: 'space-level-9', title: "Level 9: The Universe and Cosmology", type: "Quiz" },
        { id: 'study-node-5', title: "Study: The Search for Extraterrestrial Life", type: "Study", contentId: "study-node-5-content" },
        { id: 'space-level-10', title: "Level 10: The Search for Extraterrestrial Life", type: "Quiz" },
        { id: 'space-level-11-coming-soon', title: "Coming Soon!", type: "ComingSoon" }
      ];

      questNodes.forEach((node, index) => {
        const nodeRef = db.collection('quest_nodes').doc(node.id);
        batch.set(nodeRef, {
          title: node.title,
          quizId: node.id,
          type: node.type,
          order: index + 1,
          contentId: node.contentId || null,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      // 3. Space Olympiad Quizzes
      const spaceData = require('../../data/space_olympiad_data.json');
      const categoryRef = db.collection("categories").doc(spaceData.category.id);
      batch.set(categoryRef, {
        title: spaceData.category.title,
        type: spaceData.category.type,
        order: spaceData.category.order,
        description: spaceData.category.description,
        image: spaceData.category.image || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
      });

      spaceData.quizzes.forEach((quiz) => {
        const quizRef = db.collection("topics").doc(quiz.id);
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
        quiz.questions.forEach((q) => {
          const qRef = db.collection("quizQuestions").doc(`${quiz.id}-q${qOrder}`);
          const questionDoc = {
            parentId: quiz.id,
            question: q.type ? q : q.question,
            options: typeof q.options[0] === 'string' ? q.options : q.options.map(opt => opt.content),
            answer: q.answer || (q.options.find(opt => opt.isCorrect)?.content),
            order: qOrder,
            createdAt: firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
          };
          if (q.explanation) questionDoc.explanation = q.explanation;
          if (q.image) questionDoc.image = q.image;
          if (q.video) questionDoc.video = q.video;
          batch.set(qRef, questionDoc);
          qOrder++;
        });
      });

      // 4. Vocab Builder Data
      const vocabCategories = [
        {
          id: "vocab-space-basics",
          name: "Space Basics",
          words: [
            { word: "ORBIT", hint: "The curved path of a celestial object" },
            { word: "PLANET", hint: "A large celestial body orbiting a star" },
            { word: "STAR", hint: "A luminous sphere of plasma held together by its own gravity" },
            { word: "MOON", hint: "A natural satellite of a planet" }
          ]
        },
        {
          id: "vocab-advanced",
          name: "Advanced Space Terms",
          words: [
            { word: "GALAXY", hint: "A system of millions or billions of stars" },
            { word: "NEBULA", hint: "A giant cloud of dust and gas in space" },
            { word: "COMET", hint: "A cosmic snowball of frozen gases, rock, and dust" },
            { word: "METEOR", hint: "A small rocky or metallic body in outer space" }
          ]
        }
      ];

      vocabCategories.forEach(cat => {
        const catRef = db.collection('gameVocabCategories').doc(cat.id);
        batch.set(catRef, { name: cat.name });
        cat.words.forEach(w => {
          const wRef = db.collection('gameVocabCategories').doc(cat.id).collection('words').doc(w.word);
          batch.set(wRef, w);
        });
      });

      // 5. Spelling Bee Data
      const spellingBees = [
        { id: "bee-1", letters: ["A","S","T","R","O","N"], center: "O" },
        { id: "bee-2", letters: ["E","C","L","I","P","S"], center: "E" }
      ];
      
      spellingBees.forEach(bee => {
        const beeRef = db.collection('gameSpellingBee').doc(bee.id);
        batch.set(beeRef, { letters: bee.letters, center: bee.center });
      });

      await batch.commit();
      Alert.alert("Success", "Fully Seeded Olympiad Data (Quizzes, Vocab, Spelling, Study, Quest)!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ marginVertical: 15, marginHorizontal: 20, borderRadius: 8, overflow: 'hidden' }}>
      <Button 
        title={loading ? "Updating Map..." : "Update Quest Map to Full Space Olympiad"} 
        onPress={seedNodes} 
        disabled={loading} 
        color="#8A2BE2" 
      />
    </View>
  );
}
