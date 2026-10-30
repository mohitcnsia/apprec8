// src/hooks/useQuizEngine.js

import { useReducer, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listenToV2QuizQuestions } from "../services/firestoreContentApi"; // Adjust path

/**
 * A helper function to shuffle an array.
 * @param {Array<any>} array The array to shuffle.
 * @returns {Array<any>} The shuffled array.
 */
const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

/**
 * @typedef {Object} QuizState
 * All state properties for the quiz engine.
 */
const initialState = {
  status: "loading", // can be loading, ready, answering, reviewing, finished, failed
  mode: "training",
  questions: [],
  config: {},
  currentIndex: 0,
  score: 0,
  lives: 5, // Initialize with 5 lives
  error: null,
  selectedAnswer: null,
  showFeedback: false,
  wasCorrect: false,
  markedForReview: [],
  userAnswers: {},
  hasReachedReview: false,
};

/**
 * The reducer function that manages all state transitions for the quiz.
 * @param {QuizState} state The current state.
 * @param {Object} action The dispatched action.
 * @returns {QuizState} The new state.
 */
function quizReducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...initialState,
        status: "ready",
        questions: action.payload.questions,
        config: action.payload.config,
        mode: action.payload.mode,
        lives: action.payload.config?.maxLives ?? 5,
      };
    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.payload };
    case "START_QUIZ":
      return { ...state, status: "answering" };
    case "RESTART_QUIZ":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
        config: state.config,
        mode: state.mode,
        lives: state.config?.maxLives ?? 5,
      };
    case "SELECT_ANSWER":
      return { ...state, selectedAnswer: action.payload.selectedOption };
    case "CHECK_ANSWER": {
      if (!state.selectedAnswer) return state;
      const isCorrect = state.selectedAnswer.isCorrect;
      const currentQuestion = state.questions[state.currentIndex];
      const newScore = isCorrect
        ? state.score + (currentQuestion.stars || 10)
        : state.score;
      const newLives = isCorrect ? state.lives : Math.max(0, state.lives - 1);
      return {
        ...state,
        showFeedback: true,
        wasCorrect: isCorrect,
        score: newScore,
        lives: newLives,
      };
    }
    case "ANSWER_AND_ADVANCE": {
      const { questionId, selectedOption } = action.payload;
      const newAnswers = {
        ...state.userAnswers,
        [questionId]: selectedOption.content,
      };
      const isLastQuestion = state.currentIndex === state.questions.length - 1;
      if (isLastQuestion || state.hasReachedReview) {
        return { ...state, userAnswers: newAnswers, status: "reviewing", hasReachedReview: true };
      }
      return {
        ...state,
        userAnswers: newAnswers,
        currentIndex: state.currentIndex + 1,
      };
    }
    case "NEXT_QUESTION": {
      if (state.lives <= 0) {
        return { ...state, status: "failed" };
      }
      const isLastQuestion = state.currentIndex === state.questions.length - 1;
      if (isLastQuestion) {
        return { ...state, status: "finished" };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedAnswer: null,
        showFeedback: false,
      };
    }
    case "TOGGLE_MARK_FOR_REVIEW": {
      const { questionId } = action.payload;
      const isMarked = state.markedForReview.includes(questionId);
      const newMarkedForReview = isMarked
        ? state.markedForReview.filter((id) => id !== questionId)
        : [...state.markedForReview, questionId];
      return { ...state, markedForReview: newMarkedForReview };
    }
    case "GO_TO_QUESTION":
      return {
        ...state,
        status: "answering",
        currentIndex: action.payload.index,
      };
    case "SUBMIT_EXAM": {
      const { isFirstAttempt } = action.payload || {};
      let correctCount = 0;
      const missedQuestions = [];

      state.questions.forEach((question) => {
        const correctAnswerContent = question.options.find(
          (opt) => opt.isCorrect
        )?.content;
        
        if (state.userAnswers[question.id] === correctAnswerContent) {
          correctCount += 1;
        } else {
          missedQuestions.push(question.question.content);
        }
      });

      // Award 10 stars for 100%, otherwise proportional
      let finalScore = Math.round((correctCount / state.questions.length) * 10);
      
      const isPerfect = correctCount === state.questions.length;
      if (isPerfect && isFirstAttempt) {
        finalScore += 5; // Bonus 5 stars for a perfect first attempt
      }

      return { 
        ...state, 
        status: "finished", 
        score: finalScore,
        missedQuestions,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

/**
 * A custom hook that contains all the business logic for running a V2 Quiz.
 * It handles state management, data fetching, and answer evaluation.
 * @param {object} quiz - The initial quiz object passed from navigation.
 * @param {'training'|'exam'} mode - The selected quiz mode.
 * @returns {{ state: QuizState, dispatch: Function }} An object containing the current state and the dispatch function.
 */
export const useQuizEngine = (quiz, mode) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  /**
   * DOCUMENTATION:
   * This hook fetches the questions for the given quiz from Firestore.
   *
   * THE CHANGE:
   * We've added a line to check for `quiz.config?.shuffleQuestions`. If it's true,
   * we shuffle the entire `fetchedQuestions` array before processing it.
   * This ensures the order of questions is randomized for each new attempt if the
   * config requires it.
   */
  useEffect(() => {
    if (!quiz?.id) {
      dispatch({ type: "FETCH_ERROR", payload: "No quiz specified." });
      return;
    }

    const unsubscribe = listenToV2QuizQuestions(
      quiz.id,
      async (fetchedQuestions) => {
        if (fetchedQuestions?.length > 0) {
          try {
            // 1. Load Local Stats
            const statsKey = `quizStats_${quiz.id}`;
            const statsJson = await AsyncStorage.getItem(statsKey);
            const stats = statsJson ? JSON.parse(statsJson) : {};

            // 2. Smart Sort (Priority: Unseen > High Wrong Ratio > Random)
            let sortedQuestions = [...fetchedQuestions];
            sortedQuestions.sort((a, b) => {
              const statA = stats[a.id] || { seen: 0, wrong: 0, correct: 0 };
              const statB = stats[b.id] || { seen: 0, wrong: 0, correct: 0 };
              
              // Priority 1: Unseen
              if (statA.seen === 0 && statB.seen !== 0) return -1;
              if (statB.seen === 0 && statA.seen !== 0) return 1;
              
              // Priority 2: Higher wrong ratio
              const ratioA = statA.seen > 0 ? statA.wrong / statA.seen : 0;
              const ratioB = statB.seen > 0 ? statB.wrong / statB.seen : 0;
              
              if (ratioA > ratioB) return -1;
              if (ratioB > ratioA) return 1;
              
              // Priority 3: Random shuffle within same priority group
              return Math.random() - 0.5;
            });

            // 3. Apply sorting logic based on config
            let questionsToLoad = quiz.config?.shuffleQuestions
              ? sortedQuestions
              : fetchedQuestions;
              
            // 4. Slice to max questions for practice session
            const maxQuestions = quiz.config?.questionCount || 10;
            if (questionsToLoad.length > maxQuestions) {
              questionsToLoad = questionsToLoad.slice(0, maxQuestions);
            }

            // 5. Dispatch
            dispatch({
              type: "FETCH_SUCCESS",
              payload: {
                questions: questionsToLoad.map((q) => ({
                  ...q,
                  options: quiz.config?.shuffleOptions
                    ? shuffleArray(q.options)
                    : q.options,
                })),
                config: quiz.config,
                mode: mode,
              },
            });
          } catch (error) {
            console.error("Error loading questions:", error);
            dispatch({ type: "FETCH_ERROR", payload: "Failed to process questions." });
          }
        } else {
          dispatch({
            type: "FETCH_ERROR",
            payload: "This quiz has no questions yet.",
          });
        }
      },
      (err) => {
        dispatch({
          type: "FETCH_ERROR",
          payload: err?.message || "Failed to load questions.",
        });
      }
    );
    return () => unsubscribe();
  }, [quiz, mode]);

  return { state, dispatch };
};
