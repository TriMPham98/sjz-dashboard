import { useState, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

export default function useGameState() {
  const [score, setScore] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isWaitingForNextQuestion, setIsWaitingForNextQuestion] =
    useState(false);

  const endGameRef = useRef(false);
  const isFirstRender = useRef(true);
  const feedbackTimeoutRef = useRef(null);
  const quizContainerRef = useRef(null);

  const getScoreDisplay = useCallback(() => {
    if (totalGuesses === 0) return "0/0 (0%)";
    const accuracy = (score / totalGuesses) * 100;
    return `${score}/${totalGuesses} (${accuracy.toFixed(0)}%)`;
  }, [score, totalGuesses]);

  const accuracy = totalGuesses > 0 ? (score / totalGuesses) * 100 : 0;

  const triggerConfetti = useCallback(() => {
    if (quizContainerRef.current) {
      const rect = quizContainerRef.current.getBoundingClientRect();
      const { width, height, top, left } = rect;
      const x = (left + width / 2) / window.innerWidth;
      const y = (top + height / 2) / window.innerHeight;
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { x, y },
        scalar: 1.1,
      });
    }
  }, []);

  const incrementScore = useCallback(() => {
    setScore((prev) => prev + 1);
  }, []);

  const incrementGuesses = useCallback(() => {
    setTotalGuesses((prev) => prev + 1);
  }, []);

  const resetGameState = useCallback((feedbackMsg = "") => {
    setIsActive(false);
    setIsWaitingForNextQuestion(false);
    setScore(0);
    setTotalGuesses(0);
    setFeedback(feedbackMsg);
    endGameRef.current = false;
    isFirstRender.current = true;
    clearTimeout(feedbackTimeoutRef.current);
  }, []);

  return {
    score,
    setScore,
    totalGuesses,
    feedback,
    setFeedback,
    isActive,
    setIsActive,
    isWaitingForNextQuestion,
    setIsWaitingForNextQuestion,
    endGameRef,
    isFirstRender,
    feedbackTimeoutRef,
    quizContainerRef,
    getScoreDisplay,
    accuracy,
    triggerConfetti,
    incrementScore,
    incrementGuesses,
    resetGameState,
  };
}
