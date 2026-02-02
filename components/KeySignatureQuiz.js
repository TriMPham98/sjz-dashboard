import React, { useState, useEffect, useCallback } from "react";
import PasswordPopup from "./PasswordPopup";
import KeySignatureRenderer from "./KeySignatureRenderer";
import { useSound } from "./SoundManager";
import useQuizTimer from "../hooks/useQuizTimer";
import useGameState from "../hooks/useGameState";
import useStudentManagement from "../hooks/useStudentManagement";
import {
  PRACTICE_TIME,
  SCORED_TIME,
  INCORRECT_ANSWER_DELAY,
  CORRECT_ANSWER_DELAY,
  REQUIRED_ACCURACY_FOR_HS,
  shuffleArray,
} from "../hooks/quizConstants";
import { KEY_SIGNATURES } from "../data/keySignatures";
import ModeSelector from "./quiz/ModeSelector";
import StudentSelector from "./quiz/StudentSelector";
import QuizAnswerGrid from "./quiz/QuizAnswerGrid";
import ScoreTimerDisplay from "./quiz/ScoreTimerDisplay";
import GameControls from "./quiz/GameControls";

const generateWrongKeyOptions = (correctKey) => {
  const wrong = KEY_SIGNATURES.filter(
    (k) => k.keySpec !== correctKey.keySpec
  )
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((k) => k.displayName);
  return wrong;
};

const KeySignatureQuiz = () => {
  const [currentKey, setCurrentKey] = useState(null);
  const [previousKey, setPreviousKey] = useState(null);
  const [options, setOptions] = useState([]);
  const [mode, setMode] = useState("practice");

  const { playSound } = useSound();

  const gameState = useGameState();
  const {
    score,
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
    resetGameState: resetGame,
  } = gameState;

  const studentMgmt = useStudentManagement({ scoreField: "keysig_score" });
  const {
    students,
    setStudents,
    selectedStudent,
    setSelectedStudent,
    showPasswordPopup,
    tempStudentSelection,
    competitiveTriesLeft,
    handlePasswordCancel,
    decrementTries,
    resetTries,
  } = studentMgmt;

  const endGame = useCallback(async () => {
    if (endGameRef.current) return;
    endGameRef.current = true;

    setIsActive(false);
    timer.resetTimer(mode === "practice" ? PRACTICE_TIME : SCORED_TIME);
    clearTimeout(feedbackTimeoutRef.current);
    setIsWaitingForNextQuestion(false);

    const accuracyDisplay = accuracy.toFixed(0);
    let finalFeedback = "";

    if (mode === "practice") {
      finalFeedback = `Practice complete! Final score: ${getScoreDisplay()}.`;
      playSound("practiceSuccess");
    } else if (mode === "scored" && selectedStudent) {
      const currentHighScore = selectedStudent.keysig_score || 0;
      const canUpdateHighScore =
        accuracy >= REQUIRED_ACCURACY_FOR_HS && score > currentHighScore;
      let beatHighScore = false;

      const newTriesLeft = decrementTries();

      if (canUpdateHighScore) {
        try {
          const response = await fetch("/api/updateKeySigScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedStudent.id, score }),
          });
          if (!response.ok)
            throw new Error(
              `Failed to update score: ${response.statusText}`
            );

          finalFeedback = `Congratulations, ${selectedStudent.first_name}! New High Score: ${score} (${accuracyDisplay}% accuracy).`;
          beatHighScore = true;

          const updatedStudents = students
            .map((student) =>
              student.id === selectedStudent.id
                ? { ...student, keysig_score: score }
                : student
            )
            .sort(
              (a, b) => (b.keysig_score ?? 0) - (a.keysig_score ?? 0)
            );
          setStudents(updatedStudents);
          setSelectedStudent((prev) => ({
            ...prev,
            keysig_score: score,
          }));

          playSound("highScoreSuccess");
          triggerConfetti();
        } catch (error) {
          console.error("Error updating score:", error);
          finalFeedback = `Score: ${score} (${accuracyDisplay}%). Failed to save high score.`;
          playSound("error");
        }
      } else {
        finalFeedback = `Attempt finished. Score: ${score} (${accuracyDisplay}%). `;
        if (accuracy < REQUIRED_ACCURACY_FOR_HS) {
          finalFeedback += `You need ${REQUIRED_ACCURACY_FOR_HS}% accuracy to set a high score. `;
        } else if (score <= currentHighScore) {
          finalFeedback += `Current high score is ${currentHighScore}. `;
        }
        playSound(beatHighScore ? "success" : "error");
      }

      if (newTriesLeft <= 0) {
        finalFeedback +=
          " No more competitive tries left. Switching to Practice mode.";
        setTimeout(() => {
          handleModeChange("practice");
        }, 4000);
      } else {
        finalFeedback += ` ${newTriesLeft} competitive ${
          newTriesLeft === 1 ? "try" : "tries"
        } left.`;
      }
    } else {
      finalFeedback = `Game over! Score: ${getScoreDisplay()}.`;
      if (mode === "scored") handleModeChange("practice");
    }

    setFeedback(finalFeedback);
    setPreviousKey(null);

    setTimeout(() => {
      endGameRef.current = false;
    }, 500);
  }, [
    mode,
    score,
    totalGuesses,
    accuracy,
    selectedStudent,
    competitiveTriesLeft,
    students,
    getScoreDisplay,
    triggerConfetti,
    playSound,
    decrementTries,
    setStudents,
    setSelectedStudent,
    setIsActive,
    setFeedback,
    setIsWaitingForNextQuestion,
    endGameRef,
    feedbackTimeoutRef,
  ]);

  const timer = useQuizTimer({
    initialTime: mode === "practice" ? PRACTICE_TIME : SCORED_TIME,
    isRunning: isActive,
    onTimeUp: endGame,
  });

  const generateNewQuestion = useCallback(() => {
    clearTimeout(feedbackTimeoutRef.current);

    let newKey;
    let attempts = 0;
    do {
      newKey =
        KEY_SIGNATURES[Math.floor(Math.random() * KEY_SIGNATURES.length)];
      attempts++;
    } while (
      previousKey &&
      newKey.keySpec === previousKey.keySpec &&
      attempts < KEY_SIGNATURES.length * 2
    );

    setCurrentKey(newKey);
    setPreviousKey(newKey);

    const newOptions = [
      newKey.displayName,
      ...generateWrongKeyOptions(newKey),
    ];
    shuffleArray(newOptions);
    setOptions(newOptions);
    setFeedback("");
    setIsWaitingForNextQuestion(false);
  }, [
    previousKey,
    feedbackTimeoutRef,
    setFeedback,
    setIsWaitingForNextQuestion,
  ]);

  const handleModeChange = useCallback(
    (newMode) => {
      if (mode === newMode) return;

      clearTimeout(timer.timerRef.current);
      resetGame(`Switched to ${newMode} mode. Press Start.`);
      timer.resetTimer(
        newMode === "practice" ? PRACTICE_TIME : SCORED_TIME
      );
      setMode(newMode);
      setCurrentKey(null);
      setPreviousKey(null);
      setOptions([]);
      setSelectedStudent(null);
      resetTries();

      if (newMode !== "scored") {
        const dropdown = document.getElementById("student-select-keysig");
        if (dropdown) dropdown.value = "";
      }
    },
    [mode, timer, resetGame, setSelectedStudent, resetTries]
  );

  const startGame = useCallback(() => {
    if (isActive) {
      clearTimeout(timer.timerRef.current);
      resetGame("Game reset. Press Start.");
      timer.resetTimer(mode === "practice" ? PRACTICE_TIME : SCORED_TIME);
      setCurrentKey(null);
      setPreviousKey(null);
      setOptions([]);
    } else {
      if (mode === "scored") {
        if (!selectedStudent) {
          alert(
            "Please select a student before starting Competitive mode."
          );
          return;
        }
        if (competitiveTriesLeft <= 0) {
          alert(
            "No more competitive tries left for this student. Switch to Practice or select another student."
          );
          return;
        }
      }
      clearTimeout(timer.timerRef.current);
      resetGame("");
      timer.resetTimer(mode === "practice" ? PRACTICE_TIME : SCORED_TIME);
      setCurrentKey(null);
      setPreviousKey(null);
      setOptions([]);
      setIsActive(true);
    }
  }, [
    isActive,
    mode,
    selectedStudent,
    competitiveTriesLeft,
    timer,
    resetGame,
    setIsActive,
  ]);

  const handleStudentChange = useCallback(
    (e) => {
      studentMgmt.handleStudentChange(e, {
        isActive,
        onReset: () => {
          startGame();
          setFeedback("Select a student for Competitive mode.");
        },
      });
    },
    [studentMgmt, isActive, startGame, setFeedback]
  );

  const handlePasswordSubmit = useCallback(
    (password) => {
      studentMgmt.handlePasswordSubmit(password, {
        onSuccess: (student) => {
          setMode("scored");
          clearTimeout(timer.timerRef.current);
          resetGame(
            `${student?.first_name || "Student"} selected. Press Start.`
          );
          timer.resetTimer(SCORED_TIME);
          setCurrentKey(null);
          setPreviousKey(null);
          setOptions([]);
        },
      });
    },
    [studentMgmt, timer, resetGame]
  );

  const handleGuess = useCallback(
    (guess) => {
      if (!isActive || isWaitingForNextQuestion || endGameRef.current)
        return;

      clearTimeout(feedbackTimeoutRef.current);
      setIsWaitingForNextQuestion(true);

      const correctAnswer = currentKey.displayName;
      const isCorrect = guess === correctAnswer;

      playSound(isCorrect ? "success" : "error");
      incrementGuesses();

      if (isCorrect) {
        incrementScore();
        setFeedback("Correct!");
        timer.resumeTimer();

        feedbackTimeoutRef.current = setTimeout(() => {
          if (isActive && !endGameRef.current) {
            generateNewQuestion();
          } else {
            setIsWaitingForNextQuestion(false);
          }
        }, CORRECT_ANSWER_DELAY);
      } else {
        setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
        timer.pauseTimer();

        feedbackTimeoutRef.current = setTimeout(() => {
          timer.resumeTimer();
          if (isActive && !endGameRef.current) {
            generateNewQuestion();
          } else {
            setIsWaitingForNextQuestion(false);
          }
        }, INCORRECT_ANSWER_DELAY);
      }
    },
    [
      isActive,
      isWaitingForNextQuestion,
      currentKey,
      playSound,
      generateNewQuestion,
      incrementScore,
      incrementGuesses,
      setFeedback,
      setIsWaitingForNextQuestion,
      timer,
      endGameRef,
      feedbackTimeoutRef,
    ]
  );

  useEffect(() => {
    if (isActive && isFirstRender.current) {
      generateNewQuestion();
      isFirstRender.current = false;
    }
  }, [isActive, generateNewQuestion, isFirstRender]);

  return (
    <div
      ref={quizContainerRef}
      className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4 text-gray-800 font-sans">
      <h2 className="text-2xl font-bold text-center text-indigo-700">
        Key Signature Quiz
      </h2>

      <ModeSelector
        mode={mode}
        onModeChange={handleModeChange}
        disabled={isActive}
      />

      {mode === "scored" && (
        <StudentSelector
          students={students}
          selectedStudent={selectedStudent}
          competitiveTriesLeft={competitiveTriesLeft}
          onStudentChange={handleStudentChange}
          disabled={isActive}
          scoreField="keysig_score"
        />
      )}

      <div className="h-36 flex items-center justify-center border-t border-b border-gray-200 py-4 my-4 bg-gray-50 rounded">
        {currentKey ? (
          <KeySignatureRenderer keySpec={currentKey.keySpec} />
        ) : (
          <div className="text-gray-400 italic">
            {isActive
              ? "Loading key signature..."
              : feedback || "Press Start to begin..."}
          </div>
        )}
      </div>

      <QuizAnswerGrid
        options={options}
        onAnswer={handleGuess}
        disabled={!isActive || isWaitingForNextQuestion}
        mode={mode}
        isActive={isActive}
      />

      <ScoreTimerDisplay
        scoreDisplay={getScoreDisplay()}
        formattedTime={timer.formattedTime}
        timeLeft={timer.timeLeft}
        isActive={isActive}
        feedback={feedback}
      />

      <GameControls
        isActive={isActive}
        onStartReset={startGame}
        disabled={
          !isActive &&
          mode === "scored" &&
          (!selectedStudent || competitiveTriesLeft <= 0)
        }
        mode={mode}
      />

      {showPasswordPopup && (
        <PasswordPopup
          studentName={tempStudentSelection?.first_name}
          onSubmit={handlePasswordSubmit}
          onCancel={handlePasswordCancel}
        />
      )}
    </div>
  );
};

export default KeySignatureQuiz;
