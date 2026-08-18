const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

// IMPORTANT: Set your GOOGLE_APPLICATION_CREDENTIALS environment variable 
// to point to your service account key file before running this script.
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
// For emulator or default project (if logged in via firebase CLI), it might work without it.

initializeApp();

const db = getFirestore();

async function seedSpaceQuiz() {
  const dataPath = path.join(__dirname, "../data/space_olympiad_data.json");
  const rawData = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(rawData);

  console.log("Starting seeding of Space Olympiad data...");

  const batch = db.batch();
  
  // 1. Create the Category
  const categoryRef = db.collection("categories").doc(data.category.id);
  batch.set(categoryRef, {
    title: data.category.title,
    type: data.category.type,
    order: data.category.order,
    description: data.category.description,
    image: data.category.image || null,
    createdAt: FieldValue.serverTimestamp(),
    lastUpdatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`Prepared Category: ${data.category.title}`);

  // 2. Create the Quizzes (Topics) and their Questions
  for (const quiz of data.quizzes) {
    const quizRef = db.collection("topics").doc(quiz.id);
    batch.set(quizRef, {
      title: quiz.title,
      type: "QUIZ",
      parentTopicId: null, // Top level under the category
      categoryId: data.category.id,
      hasSubtopics: false,
      order: quiz.order,
      passingScore: quiz.passingScore || Math.floor(quiz.questions.length * 0.7),
      maxScore: quiz.questions.length * 10, // Assuming 10 stars per question
      config: quiz.config || { shuffleQuestions: true, shuffleOptions: true, maxLives: 5 },
      createdAt: FieldValue.serverTimestamp(),
      lastUpdatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`Prepared Quiz Topic: ${quiz.title}`);

    // 3. Create Questions for this Quiz
    let qOrder = 1;
    for (const q of quiz.questions) {
      const qRef = db.collection("quizQuestions").doc(`${quiz.id}-q${qOrder}`);
      
      const questionDoc = {
        parentId: quiz.id,
        question: q.type ? q : q.question, // Handle if it's an object with type/content
        options: typeof q.options[0] === 'string' ? q.options : q.options.map(opt => opt.content),
        answer: q.answer || (q.options.find(opt => opt.isCorrect)?.content),
        order: qOrder,
        createdAt: FieldValue.serverTimestamp(),
        lastUpdatedAt: FieldValue.serverTimestamp(),
      };

      if (q.explanation) questionDoc.explanation = q.explanation;
      if (q.image) questionDoc.image = q.image; // Old schema image property

      batch.set(qRef, questionDoc);
      qOrder++;
    }
  }

  try {
    await batch.commit();
    console.log("✅ Successfully seeded Space Olympiad data to Firestore!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

seedSpaceQuiz();
