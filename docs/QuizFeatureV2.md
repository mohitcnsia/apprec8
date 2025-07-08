
# Quiz Feature V2 Documentation

**Last Updated:** July 7, 2025

## 1\. Overview

This document outlines the architecture and implementation of the "Quiz V2" feature in the Apprec8 application. This feature is a significant upgrade to the original quiz system, designed to be more engaging, versatile, and robust. It supports multimedia content, multiple gameplay modes, and a gamified progression system.

This feature was built as a new, parallel system (`QuizScreenV2.js`) to ensure the existing quiz functionality (`QuizScreen.js`) remains untouched and fully functional.

-----

## 2\. Key Features

  * **Multimedia Support:** Questions and answers can be text, images, audio, or video.
  * **Dual-Mode System:**
      * **Training Mode:** Provides instant feedback and explanations after each question to facilitate learning.
      * **Exam Mode:** A challenge mode where all questions are answered first, followed by a final review screen before submission.
  * **Gamification:**
      * **Mastery Levels:** Users can "level up" a quiz from Learned to Practiced to Mastered.
      * **Star-based Economy:** Users spend stars as an "entry fee" and earn more back through participation and high scores.
      * **Streaks & Bonuses:** Rewards for consecutive correct answers.
  * **Dynamic Configuration:** Quizzes can be configured to shuffle questions and/or options on a per-quiz basis.
  * **Engaging Explanations:** A new `Apprec8ReaderV2` component designed to show explanations with an animated mascot and interactive keywords.

-----

## 3\. Data Model (Firestore Schema)

The feature relies on three core collections:

### `quizzes`

Stores the metadata for each quiz.

  * `title`: (string) The display name of the quiz.
  * `description`: (string) A short description.
  * `config`: (object) Contains settings for the quiz.
      * `shuffleQuestions`: (boolean)
      * `shuffleOptions`: (boolean)
      * `entryFee`: (number) The number of stars required to play.

### `questions`

Stores all questions for all quizzes. Each document is linked to a quiz by `quizId`.

```json
{
  "quizId": "solar_system_v2",
  "stars": 10,
  "explanation": "Markdown text for the explanation...",
  "question": {
    "type": "image",
    "content": "https://path.to/image.png"
  },
  "options": [
    { "type": "text", "content": "Mars", "isCorrect": true },
    { "type": "text", "content": "Jupiter", "isCorrect": false }
  ]
}
```

### `users/{uid}/quizAttempts`

A subcollection on each user document to track their personal progress on each quiz.

  * `masteryLevel`: (number) The user's current level for this quiz (e.g., 1, 2, 3).
  * `highestScore`: (number) The user's personal best score.
  * `attempts`: (number) How many times the user has played the quiz.
  * `lastAttemptDate`: (timestamp)

-----

## 4\. Front-End Architecture

### Core Component: `QuizScreenV2.js`

This is the main screen that orchestrates the entire V2 quiz experience.

  * **State Management:** It uses a combination of `useReducer` and `React.Context` for robust state management.
      * A `quizReducer` handles all complex state transitions (answering questions, switching modes, calculating scores).
      * A `QuizContext` provides the `state` and `dispatch` function to nested child components.
  * **Logic:** It contains the complete logic for fetching data and rendering the UI based on the current quiz status (`loading`, `ready`, `answering`, `reviewing`, `finished`).

### Reusable UI Components

  * **`QuestionCard.js`**: A component that takes a `question` object and renders its content, supporting text, images, etc.
  * **`Option.js`**: A component that renders a single answer option, handles user presses, and displays different visual states (selected, correct, incorrect, disabled).
  * **`Apprec8ReaderV2.js`**: A component designed to show the `explanation` text in an engaging way with animations and interactive elements.

-----

## 5\. User Flow

1.  **Quiz Details:** The user selects a V2 quiz and sees a detail screen showing their `masteryLevel`, `highScore`, and the "entry fee."
2.  **Mode Selection:** The user chooses to start in either "Training Mode" or "Exam Mode."
3.  **Gameplay:**
      * **In Training Mode:** The flow is `Answer` -\> `Immediate Feedback` -\> `Explanation` -\> `Next Question`. This repeats until the last question, after which the user sees the Results Screen.
      * **In Exam Mode:** The flow is a fast loop of `Answer` -\> `Next Question`. After the last question, the user is taken to a **Final Review Screen** where they can check and change their answers before final submission.
4.  **Results:** After completing the quiz in either mode, the user lands on the **Results Screen**, which celebratorily displays their score, stars earned, and any change in their Mastery Level.