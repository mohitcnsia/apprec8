// src/hooks/useQuizEngine.js

import { useReducer, useEffect } from "react";
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
  status: "loading",
  mode: "training",
  questions: [],
  config: {},
  currentIndex: 0,
  score: 0,
  error: null,
  selectedAnswer: null,
  showFeedback: false,
  wasCorrect: false,
  markedForReview: [],
  userAnswers: {},
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
      return {
        ...state,
        showFeedback: true,
        wasCorrect: isCorrect,
        score: newScore,
      };
    }
    case "ANSWER_AND_ADVANCE": {
      const { questionId, selectedOption } = action.payload;
      const newAnswers = {
        ...state.userAnswers,
        [questionId]: selectedOption.content,
      };
      const isLastQuestion = state.currentIndex === state.questions.length - 1;
      if (isLastQuestion) {
        return { ...state, userAnswers: newAnswers, status: "reviewing" };
      }
      return {
        ...state,
        userAnswers: newAnswers,
        currentIndex: state.currentIndex + 1,
      };
    }
    case "NEXT_QUESTION": {
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
      // Calculate the final score for the exam based on the user's answers.
      const finalScore = state.questions.reduce((totalScore, question) => {
        const correctAnswerContent = question.options.find(
          (opt) => opt.isCorrect
        )?.content;
        if (state.userAnswers[question.id] === correctAnswerContent) {
          return totalScore + (question.stars || 10);
        }
        return totalScore;
      }, 0);

      // Return the new state, updating the status and the calculated score.
      return { ...state, status: "finished", score: finalScore };
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

  useEffect(() => {
    if (!quiz?.id) {
      dispatch({ type: "FETCH_ERROR", payload: "No quiz specified." });
      return;
    }
    const unsubscribe = listenToV2QuizQuestions(
      quiz.id,
      (fetchedQuestions) => {
        if (fetchedQuestions?.length > 0) {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              questions: fetchedQuestions.map((q) => ({
                ...q,
                options: quiz.config?.shuffleOptions
                  ? shuffleArray(q.options)
                  : q.options,
              })),
              config: quiz.config,
              mode: mode,
            },
          });
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
