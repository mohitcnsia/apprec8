# Apprec8 - Core Functionality and Key Features

Based on the codebase structure and documentation, Apprec8 is a **gamified educational and learning platform**. It is designed to deliver structured study materials, interactive quizzes, and track user progress through a gamified experience.

Here is a breakdown of the core functionality and key features:

### 1. Structured Learning & Content Delivery
The app is built around delivering educational content in a structured hierarchy.
* **Content Hierarchy**: Content is organized into a tree of Categories -> Topics -> Subtopics -> Activities (like Study materials or Quizzes).
* **Rich Text Reader (Apprec8Reader)**: A custom-built content renderer that displays structured text (headings, paragraphs) alongside images. It supports inline images and a full-screen image viewer with pinch-to-zoom.
* **Media Support**: The schema suggests support not just for text, but also for `VIDEO` and `FLASHCARDS` as activity types.

### 2. Interactive Quizzes & Games
The application goes beyond static reading by incorporating active learning tools.
* **Dynamic Quizzes**: Users can take quizzes (`QuizScreenV2`) that are loaded dynamically from the backend.
* **Mini-Games**: The codebase includes specialized game components like a **Spelling Bee** game (which integrates with a real dictionary API to validate words) and potentially **Sudoku** (based on dependencies found in the `package.json`).

### 3. Gamification & Progression System
To keep users engaged, the app relies heavily on gamification.
* **Stats & Leaderboards**: There is a dedicated "Stats" tab that fetches the user's rank and displays a global leaderboard so users can see how they stack up against others.
* **Streaks & Rewards**: The backend tracks a user's `currentStreak`, `totalStars`, and `totalQuizzesCompleted`. There is also a "Daily Bonus" system to reward consistent logins.
* **Quest Map**: The "Quest" tab suggests a map-like or journey-based progression UI where users unlock new levels or topics as they progress.

### 4. User Account Management
* **Guest vs. Authenticated Modes**: Users can try the app as a "Guest" before committing to creating an account. The app seamlessly handles transitioning a guest into a fully authenticated user.
* **Profile Management**: Users have a dedicated profile where they can view their progress, submit feedback, or request account deletion.

### 5. Modern App Experience
* **Dark Mode**: Native support for both light and dark themes, which dynamically updates the UI (including the reading views).
* **In-App Messaging**: Uses Firebase Remote Config to display dynamic in-app announcements or messages without requiring an app update.
* **Immersive UI**: When taking a quiz or playing a game, the app enters an "immersive mode" by hiding the bottom navigation tabs to minimize distractions.
