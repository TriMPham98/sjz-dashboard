import { useState, useEffect, useRef, useCallback } from "react";
import { formatTime } from "./quizConstants";

export default function useQuizTimer({ initialTime, isRunning, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerRef = useRef(null);

  const pauseTimer = useCallback(() => {
    setIsTimerPaused(true);
    clearTimeout(timerRef.current);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerPaused(false);
  }, []);

  const resetTimer = useCallback(
    (newTime) => {
      clearTimeout(timerRef.current);
      setTimeLeft(newTime !== undefined ? newTime : initialTime);
      setIsTimerPaused(false);
    },
    [initialTime]
  );

  useEffect(() => {
    if (isRunning && timeLeft > 0 && !isTimerPaused) {
      timerRef.current = setTimeout(() => {
        if (isRunning && !isTimerPaused) {
          setTimeLeft((prev) => Math.max(0, prev - 1));
        }
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (onTimeUp) onTimeUp();
    }

    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft, isTimerPaused, onTimeUp]);

  return {
    timeLeft,
    setTimeLeft,
    isTimerPaused,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formattedTime: formatTime(timeLeft),
    timerRef,
  };
}
