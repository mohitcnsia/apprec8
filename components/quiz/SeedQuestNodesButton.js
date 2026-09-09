import React, { useState } from 'react';
import { Button, Alert, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { biographies } from '../../data/biographies';

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
        },
        {
          id: 'study-node-6-content',
          name: "Aryabhata to Chandrayaan",
          author: "ISRO Space Academy",
          content: "# Aryabhata: India's First Satellite\n\n![Aryabhata](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/960px-Indian_Space_Research_Organisation_Logo.svg.png)\n\nIndia's space journey began with the launch of its very first satellite, **Aryabhata**, on April 19, 1975. Named after the famous ancient Indian astronomer and mathematician, it was completely designed and built in India but launched from the Soviet Union.\n\n# Chandrayaan: Reaching the Moon\n\n![Chandrayaan](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/Vikram_Lander.jpg)\n\nDecades later, India made history with the **Chandrayaan** program. Chandrayaan-1 found water on the moon, and in 2023, **Chandrayaan-3** successfully landed the Vikram lander near the Moon's south pole, making India the fourth country to land on the Moon!"
        },
        {
          id: 'study-node-7-content',
          name: "Mangalyaan's Journey",
          author: "ISRO Space Academy",
          content: "# Mars Orbiter Mission (Mangalyaan)\n\n![Mangalyaan](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/960px-Mars_Orbiter_Mission_Over_Mars_(15237158879).jpg)\n\nIn 2013, ISRO launched the **Mars Orbiter Mission (MOM)**, affectionately known as Mangalyaan. It was India's first interplanetary mission.\n\nRemarkably, ISRO became the **first space agency in the world** to successfully reach Mars orbit on its very first attempt! It was also one of the most cost-effective Mars missions ever, costing less than the budget of the Hollywood space movie *Gravity*."
        },
        {
          id: 'study-node-8-content',
          name: "Aditya-L1 and Beyond",
          author: "ISRO Space Academy",
          content: "# Aditya-L1: Studying the Sun\n\n![Aditya-L1](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/Aditya_L1.png)\n\nAfter reaching the Moon and Mars, ISRO set its sights on our star: the Sun. **Aditya-L1** is India's first dedicated solar observatory mission.\n\nIt is positioned at the Lagrange point 1 (L1), about 1.5 million kilometers from Earth. From this special vantage point, Aditya-L1 can continuously study the Sun's atmosphere and solar storms without any eclipses blocking the view."
        },
        {
          id: 'study-node-9-content',
          name: "Gaganyaan and Human Spaceflight",
          author: "ISRO Space Academy",
          content: "# Gaganyaan Mission\n\n![Gaganyaan](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/960px-Gaganyaan_vehicle_used_for_TVD1_mission.webp)\n\nThe **Gaganyaan** project is ISRO's mission to send humans into space. The goal is to launch a crew of astronauts (called *Gaganauts*) into a low earth orbit and bring them safely back to Earth.\n\nBefore human missions, ISRO is testing the spacecraft with **Vyommitra**, a half-humanoid robot designed to simulate human functions in space. If successful, India will become the fourth nation to launch humans into space independently."
        },
        {
          id: 'study-node-10-content',
          name: "Future of Indian Space",
          author: "ISRO Space Academy",
          content: "# Bharatiya Antariksha Station (BAS)\n\n![BAS](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/Indian_space_station_concept_rough_drawing.png)\n\nThe future of Indian space exploration is incredibly exciting. ISRO is currently planning the **Bharatiya Antariksha Station (BAS)**, which will be India's very own space station!\n\nAdditionally, ISRO is developing the Next Generation Launch Vehicle (NGLV) to carry heavier payloads, and planning new missions to explore Venus and return samples from the Moon. The sky is no longer the limit for India!"
        }
      ];

      const allStudyContents = [...studyContents, ...biographies];

      allStudyContents.forEach((study) => {
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
        { id: 'bio-node-1', title: "Biography: A.P.J. Abdul Kalam", type: "Study", contentId: "bio-kalam" },
        { id: 'space-level-2', title: "Level 2: Moons and Eclipses", type: "Quiz" },
        { id: 'game-vocab-1', title: "Game: Vocab Builder", type: "VocabBuilder", contentId: "vocab-space-basics" },
        { id: 'bio-node-2', title: "Biography: Vikram Sarabhai", type: "Study", contentId: "bio-sarabhai" },
        { id: 'space-level-3', title: "Level 3: Galaxies and Stars", type: "Quiz" },
        { id: 'study-node-2', title: "Study: The History of Astronomy", type: "Study", contentId: "study-node-2-content" },
        { id: 'bio-node-3', title: "Biography: Satish Dhawan", type: "Study", contentId: "bio-dhawan" },
        { id: 'space-level-4', title: "Level 4: Space Physics and Exploration", type: "Quiz" },
        { id: 'game-spell-1', title: "Game: Spelling Bee", type: "SpellingBee", contentId: "bee-1" },
        { id: 'bio-node-4', title: "Biography: U. R. Rao", type: "Study", contentId: "bio-rao" },
        { id: 'space-level-5', title: "Level 5: Planetary Facts", type: "Quiz" },
        { id: 'study-node-3', title: "Study: Rockets and Spacecraft", type: "Study", contentId: "study-node-3-content" },
        { id: 'bio-node-5', title: "Biography: Rakesh Sharma", type: "Study", contentId: "bio-sharma" },
        { id: 'space-level-6', title: "Level 6: Comets, Asteroids, and Meteors", type: "Quiz" },
        { id: 'game-vocab-2', title: "Game: Vocab Builder 2", type: "VocabBuilder", contentId: "vocab-advanced" },
        { id: 'bio-node-6', title: "Biography: Kalpana Chawla", type: "Study", contentId: "bio-chawla" },
        { id: 'space-level-7', title: "Level 7: The History of Astronomy", type: "Quiz" },
        { id: 'study-node-4', title: "Study: The Universe and Cosmology", type: "Study", contentId: "study-node-4-content" },
        { id: 'bio-node-7', title: "Biography: Sunita Williams", type: "Study", contentId: "bio-williams" },
        { id: 'space-level-8', title: "Level 8: Rockets and Spacecraft", type: "Quiz" },
        { id: 'game-spell-2', title: "Game: Spelling Bee 2", type: "SpellingBee", contentId: "bee-2" },
        { id: 'bio-node-8', title: "Biography: K. Sivan", type: "Study", contentId: "bio-sivan" },
        { id: 'space-level-9', title: "Level 9: The Universe and Cosmology", type: "Quiz" },
        { id: 'study-node-5', title: "Study: The Search for Extraterrestrial Life", type: "Study", contentId: "study-node-5-content" },
        { id: 'bio-node-9', title: "Biography: S. Somanath", type: "Study", contentId: "bio-somanath" },
        { id: 'space-level-10', title: "Level 10: The Search for Extraterrestrial Life", type: "Quiz" },
        { id: 'bio-node-10', title: "Biography: Tessy Thomas", type: "Study", contentId: "bio-tessy" },
        { id: 'space-level-11', title: "Level 11: ISRO Milestones", type: "Quiz" },
        { id: 'study-node-6', title: "Study: Aryabhata to Chandrayaan", type: "Study", contentId: "study-node-6-content" },
        { id: 'bio-node-11', title: "Biography: Prashanth Nair", type: "Study", contentId: "bio-nair" },
        { id: 'space-level-12', title: "Level 12: ISRO Milestones", type: "Quiz" },
        { id: 'game-vocab-3', title: "Game: ISRO Vocab", type: "VocabBuilder", contentId: "vocab-isro" },
        { id: 'bio-node-12', title: "Biography: Ajit Krishnan", type: "Study", contentId: "bio-krishnan" },
        { id: 'space-level-13', title: "Level 13: ISRO Milestones", type: "Quiz" },
        { id: 'study-node-7', title: "Study: Mangalyaan's Journey", type: "Study", contentId: "study-node-7-content" },
        { id: 'bio-node-13', title: "Biography: Angad Pratap", type: "Study", contentId: "bio-pratap" },
        { id: 'space-level-14', title: "Level 14: ISRO Milestones", type: "Quiz" },
        { id: 'game-spell-3', title: "Game: Spelling Bee 3", type: "SpellingBee", contentId: "bee-3" },
        { id: 'bio-node-14', title: "Biography: Shubhanshu Shukla", type: "Study", contentId: "bio-shukla" },
        { id: 'space-level-15', title: "Level 15: ISRO Milestones", type: "Quiz" },
        { id: 'study-node-8', title: "Study: Aditya-L1 and Beyond", type: "Study", contentId: "study-node-8-content" },
        { id: 'space-level-16', title: "Level 16: ISRO Milestones", type: "Quiz" },
        { id: 'game-vocab-4', title: "Game: Space Vocab 4", type: "VocabBuilder", contentId: "vocab-isro-2" },
        { id: 'space-level-17', title: "Level 17: ISRO Milestones", type: "Quiz" },
        { id: 'study-node-9', title: "Study: Gaganyaan and Human Spaceflight", type: "Study", contentId: "study-node-9-content" },
        { id: 'space-level-18', title: "Level 18: ISRO Milestones", type: "Quiz" },
        { id: 'game-spell-4', title: "Game: Spelling Bee 4", type: "SpellingBee", contentId: "bee-4" },
        { id: 'space-level-19', title: "Level 19: ISRO Milestones", type: "Quiz" },
        { id: 'study-node-10', title: "Study: Future of Indian Space", type: "Study", contentId: "study-node-10-content" },
        { id: 'space-level-20', title: "Level 20: ISRO Milestones", type: "Quiz" },
        { id: 'space-level-21-coming-soon', title: "Coming Soon!", type: "ComingSoon" }
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
    "id": "vocab-space-basics",
    "name": "Space Basics",
    "words": [
      {
        "word": "ORBIT",
        "hint": "The curved path of a celestial object"
      },
      {
        "word": "PLANET",
        "hint": "A large celestial body orbiting a star"
      },
      {
        "word": "STAR",
        "hint": "A luminous sphere of plasma held together by its own gravity"
      },
      {
        "word": "MOON",
        "hint": "A natural satellite of a planet"
      },
      {
        "word": "SUN",
        "hint": "The star around which the earth orbits"
      },
      {
        "word": "EARTH",
        "hint": "The planet on which we live"
      },
      {
        "word": "SPACE",
        "hint": "The physical universe beyond the earth's atmosphere"
      },
      {
        "word": "ROCKET",
        "hint": "A cylindrical projectile that can be propelled to a great height or distance"
      },
      {
        "word": "GALAXY",
        "hint": "A system of millions or billions of stars"
      },
      {
        "word": "COMET",
        "hint": "A cosmic snowball of frozen gases, rock, and dust"
      },
      {
        "word": "METEOR",
        "hint": "A small rocky or metallic body in outer space"
      },
      {
        "word": "ASTEROID",
        "hint": "A small rocky body orbiting the sun"
      },
      {
        "word": "SYSTEM",
        "hint": "A set of connected things or parts forming a complex whole"
      },
      {
        "word": "SOLAR",
        "hint": "Relating to or determined by the sun"
      },
      {
        "word": "LIGHT",
        "hint": "The natural agent that stimulates sight and makes things visible"
      },
      {
        "word": "GRAVITY",
        "hint": "The force that attracts a body toward the center of the earth"
      },
      {
        "word": "CRATER",
        "hint": "A large bowl-shaped cavity in the ground or on a celestial body"
      },
      {
        "word": "DUST",
        "hint": "Fine, dry powder consisting of tiny particles of earth or waste matter"
      },
      {
        "word": "SKY",
        "hint": "The region of the atmosphere and outer space seen from the earth"
      },
      {
        "word": "NIGHT",
        "hint": "The period of darkness in each twenty-four hours"
      }
    ]
  },
  {
    "id": "vocab-advanced",
    "name": "Advanced Space Terms",
    "words": [
      {
        "word": "NEBULA",
        "hint": "A giant cloud of dust and gas in space"
      },
      {
        "word": "COSMOS",
        "hint": "The universe seen as a well-ordered whole"
      },
      {
        "word": "UNIVERSE",
        "hint": "All existing matter and space considered as a whole"
      },
      {
        "word": "BLACKHOLE",
        "hint": "A region of space having a gravitational field so intense that no matter or radiation can escape"
      },
      {
        "word": "PULSAR",
        "hint": "A highly magnetized rotating neutron star"
      },
      {
        "word": "QUASAR",
        "hint": "A massive and extremely remote celestial object, emitting exceptionally large amounts of energy"
      },
      {
        "word": "SUPERNOVA",
        "hint": "A star that suddenly increases greatly in brightness because of a catastrophic explosion"
      },
      {
        "word": "ECLIPSE",
        "hint": "An obscuring of the light from one celestial body by the passage of another"
      },
      {
        "word": "EQUINOX",
        "hint": "The time or date at which the sun crosses the celestial equator"
      },
      {
        "word": "SOLSTICE",
        "hint": "Either of the two times in the year when the sun reaches its highest or lowest point in the sky at noon"
      },
      {
        "word": "CONSTELLATION",
        "hint": "A group of stars forming a recognizable pattern"
      },
      {
        "word": "ASTRONOMY",
        "hint": "The branch of science which deals with celestial objects, space, and the physical universe"
      },
      {
        "word": "ASTROPHYSICS",
        "hint": "The branch of astronomy concerned with the physical nature of stars and other celestial bodies"
      },
      {
        "word": "SATELLITE",
        "hint": "An artificial body placed in orbit around the earth or moon or another planet"
      },
      {
        "word": "OBSERVATORY",
        "hint": "A room or building housing an astronomical telescope or other scientific equipment"
      },
      {
        "word": "TELESCOPE",
        "hint": "An optical instrument designed to make distant objects appear nearer"
      },
      {
        "word": "VACUUM",
        "hint": "A space entirely devoid of matter"
      },
      {
        "word": "PARALLAX",
        "hint": "The effect whereby the position or direction of an object appears to differ when viewed from different positions"
      },
      {
        "word": "ZENITH",
        "hint": "The time at which something is most powerful or successful"
      },
      {
        "word": "NADIR",
        "hint": "The lowest point in the fortunes of a person or organization"
      }
    ]
  },
  {
    "id": "vocab-isro",
    "name": "ISRO Terms",
    "words": [
      {
        "word": "ISRO",
        "hint": "Indian Space Research Organisation"
      },
      {
        "word": "CRYOGENIC",
        "hint": "Engine technology dealing with very low temperatures"
      },
      {
        "word": "GAGANYAAN",
        "hint": "ISRO's human spaceflight mission"
      },
      {
        "word": "MANGALYAAN",
        "hint": "India's first mission to Mars"
      },
      {
        "word": "PRAGYAN",
        "hint": "The name of the Chandrayaan rover"
      },
      {
        "word": "VIKRAM",
        "hint": "The name of the Chandrayaan lander"
      },
      {
        "word": "ARYABHATA",
        "hint": "India's first satellite"
      },
      {
        "word": "ADITYA",
        "hint": "ISRO's mission to study the Sun"
      },
      {
        "word": "VYOMMITRA",
        "hint": "The humanoid robot flying on Gaganyaan"
      },
      {
        "word": "PSLV",
        "hint": "Polar Satellite Launch Vehicle"
      },
      {
        "word": "GSLV",
        "hint": "Geosynchronous Satellite Launch Vehicle"
      },
      {
        "word": "LVM",
        "hint": "Launch Vehicle Mark-3 (formerly GSLV Mk III)"
      },
      {
        "word": "CHANDRAYAAN",
        "hint": "India's lunar exploration missions"
      },
      {
        "word": "THUMBA",
        "hint": "Location of India's first rocket launch"
      },
      {
        "word": "SRIHARIKOTA",
        "hint": "ISRO's primary launch site"
      },
      {
        "word": "BHASKARA",
        "hint": "India's first experimental remote sensing satellite"
      },
      {
        "word": "ROHINI",
        "hint": "First satellite launched by an Indian-made launch vehicle"
      },
      {
        "word": "NAVIC",
        "hint": "India's regional navigation satellite system"
      },
      {
        "word": "INSAT",
        "hint": "Indian National Satellite System"
      },
      {
        "word": "ASTROSAT",
        "hint": "India's first dedicated multi-wavelength space observatory"
      }
    ]
  },
  {
    "id": "vocab-isro-2",
    "name": "More ISRO Terms",
    "words": [
      {
        "word": "SARABHAI",
        "hint": "Father of the Indian space program"
      },
      {
        "word": "KALAM",
        "hint": "Missile Man of India and former President"
      },
      {
        "word": "DHAWAN",
        "hint": "Longest-serving ISRO chairman"
      },
      {
        "word": "URRAO",
        "hint": "Spearheaded the Aryabhata project"
      },
      {
        "word": "SIVAN",
        "hint": "ISRO Chairman during Chandrayaan-2"
      },
      {
        "word": "SOMANATH",
        "hint": "ISRO Chairman during Chandrayaan-3"
      },
      {
        "word": "ISTRAC",
        "hint": "ISRO facility for tracking and commanding satellites"
      },
      {
        "word": "VSSC",
        "hint": "Vikram Sarabhai Space Centre"
      },
      {
        "word": "SHAR",
        "hint": "Satish Dhawan Space Centre"
      },
      {
        "word": "INCOSPAR",
        "hint": "Predecessor to ISRO"
      },
      {
        "word": "ANTRIX",
        "hint": "Commercial arm of ISRO"
      },
      {
        "word": "NEWSPACE",
        "hint": "NewSpace India Limited (NSIL)"
      },
      {
        "word": "SHUKRAYAAN",
        "hint": "Planned ISRO mission to Venus"
      },
      {
        "word": "NISAR",
        "hint": "Joint Earth-observing mission by NASA and ISRO"
      },
      {
        "word": "XPOSAT",
        "hint": "X-ray Polarimeter Satellite"
      },
      {
        "word": "BHARTIYA",
        "hint": "Part of the name of India's planned space station"
      },
      {
        "word": "ANTARIKSH",
        "hint": "Sanskrit word for space"
      },
      {
        "word": "STATION",
        "hint": "An artificial structure placed in orbit and having the pressurized enclosure"
      },
      {
        "word": "RLV",
        "hint": "Reusable Launch Vehicle"
      },
      {
        "word": "SPACEPORT",
        "hint": "A site for launching (or receiving) spacecraft"
      }
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
  {
    "id": "bee-1",
    "letters": [
      "A",
      "S",
      "T",
      "R",
      "N",
      "U"
    ],
    "center": "O",
    "validWords": {
      "ASTRONAUT": "A person trained to travel in a spacecraft",
      "ASTRONO": "A combining form meaning 'star'",
      "TORUS": "A surface or solid formed by rotating a closed curve",
      "SONAR": "A system for the detection of objects under water",
      "ROAST": "Cook with solid heat"
    }
  },
  {
    "id": "bee-2",
    "letters": [
      "C",
      "L",
      "I",
      "P",
      "S",
      "N"
    ],
    "center": "E",
    "validWords": {
      "ECLIPSE": "An obscuring of the light from one celestial body",
      "PENCE": "A plural of penny",
      "SPINE": "A series of vertebrae extending from the skull",
      "SLICE": "A thin, broad piece of food",
      "SNIPE": "A wading bird"
    }
  },
  {
    "id": "bee-3",
    "letters": [
      "V",
      "I",
      "K",
      "R",
      "M",
      "E"
    ],
    "center": "A",
    "validWords": {
      "VIKRAM": "The name of the Chandrayaan lander",
      "MARK": "A trace or blemish",
      "MAKER": "A person or thing that makes or produces something",
      "RAVE": "Talk wildly or incoherently",
      "RIVER": "A large natural stream of water"
    }
  },
  {
    "id": "bee-4",
    "letters": [
      "G",
      "A",
      "N",
      "Y",
      "E",
      "M"
    ],
    "center": "A",
    "validWords": {
      "GAGANYAAN": "ISRO's human spaceflight mission",
      "MANGALYAAN": "India's first mission to Mars",
      "MANGA": "Japanese comic books",
      "GAME": "A form of play or sport",
      "NAME": "A word or set of words by which a person, animal, place, or thing is known"
    }
  }
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
