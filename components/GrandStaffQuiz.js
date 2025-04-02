import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import PasswordPopup from "./PasswordPopup"; // Assuming this component exists
import StaffRenderer from "./StaffRenderer"; // Assuming this component exists
import { useSound } from "./SoundManager"; // Assuming this hook exists

// --- Constants ---
const LEFT_HAND_NOTES = [
  { note: "G", octave: 3 },
  { note: "A", octave: 3 },
  { note: "B", octave: 3 },
  { note: "C", octave: 4 },
  { note: "D", octave: 4 },
];
const RIGHT_HAND_NOTES = [
  { note: "F#", octave: 4 },
  { note: "G", octave: 4 },
  { note: "A", octave: 4 },
  { note: "B", octave: 4 },
  { note: "C", octave: 5 },
  { note: "D", octave: 5 },
];
const PRACTICE_TIME = 30;
const SCORED_TIME = 60;
const INCORRECT_ANSWER_DELAY = 3000; // 3 seconds
const CORRECT_ANSWER_DELAY = 500; // 0.5 seconds
const REQUIRED_ACCURACY_FOR_HS = 90; // 90%
const DEFAULT_COMPETITIVE_TRIES = 3;
const PASSWORD = "onDeals"; // Keep sensitive info out of client-side code in real apps!

// --- Helper Functions ---
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateWrongOptions = (correctNote) => {
  const wrongOptions = [];
  const isLeftHand = LEFT_HAND_NOTES.some(
    (note) =>
      note.note === correctNote.note && note.octave === correctNote.octave
  );
  const notesArray = isLeftHand ? LEFT_HAND_NOTES : RIGHT_HAND_NOTES;

  while (wrongOptions.length < 3) {
    const randomNote =
      notesArray[Math.floor(Math.random() * notesArray.length)];
    if (
      randomNote.note === correctNote.note &&
      randomNote.octave === correctNote.octave
    ) {
      continue;
    }
    const option = `${randomNote.note}${randomNote.octave}`;
    if (!wrongOptions.includes(option)) {
      wrongOptions.push(option);
    }
  }
  return wrongOptions;
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// --- Component ---
const GrandStaffQuiz = () => {
  // --- State Variables ---
  const [currentNote, setCurrentNote] = useState(null);
  const [previousNote, setPreviousNote] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PRACTICE_TIME);
  const [isActive, setIsActive] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [tempStudentSelection, setTempStudentSelection] = useState(null);
  const [mode, setMode] = useState("practice");
  const [competitiveTriesLeft, setCompetitiveTriesLeft] = useState(
    DEFAULT_COMPETITIVE_TRIES
  );
  const [isWaitingForNextQuestion, setIsWaitingForNextQuestion] =
    useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false); // New state to pause timer

  // --- Hooks and Refs ---
  const { playSound, playNote } = useSound();
  const timerRef = useRef(null);
  const quizContainerRef = useRef(null);
  const isFirstRender = useRef(true);
  const endGameRef = useRef(false);
  const feedbackTimeoutRef = useRef(null);

  // --- Callbacks (Ordered by dependency where possible) ---

  const getScoreDisplay = useCallback(() => {
    if (totalGuesses === 0) return "0/0 (0%)";
    const accuracy = (score / totalGuesses) * 100;
    return `${score}/${totalGuesses} (${accuracy.toFixed(0)}%)`;
  }, [score, totalGuesses]);

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

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch("/api/checkUsers"); // Ensure this API exists
      if (!response.ok)
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      const data = await response.json();
      setStudents(
        Array.isArray(data) ? data.sort((a, b) => b.score - a.score) : []
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      setFeedback("Could not load student list.");
    }
  }, []);

  // Resets game state for starting or changing modes/students
  const resetGameState = useCallback(
    (newMode = mode, newTime = -1, feedbackMsg = "") => {
      clearTimeout(timerRef.current);
      clearTimeout(feedbackTimeoutRef.current);
      setIsActive(false);
      setIsWaitingForNextQuestion(false);
      setIsTimerPaused(false); // Ensure timer is not paused on reset
      setCurrentNote(null);
      setPreviousNote(null);
      setOptions([]);
      setScore(0);
      setTotalGuesses(0);
      setTimeLeft(
        newTime === -1
          ? newMode === "practice"
            ? PRACTICE_TIME
            : SCORED_TIME
          : newTime
      );
      setFeedback(feedbackMsg);
      endGameRef.current = false;
      isFirstRender.current = true;
    },
    [mode]
  ); // Depends on mode to set default time

  const generateNewQuestion = useCallback(() => {
    clearTimeout(feedbackTimeoutRef.current); // Clear just in case

    let correctNote;
    let attempts = 0;
    const maxAttempts = (LEFT_HAND_NOTES.length + RIGHT_HAND_NOTES.length) * 2; // Avoid infinite loop
    do {
      const isLeftHand = Math.random() < 0.5;
      const notesArray = isLeftHand ? LEFT_HAND_NOTES : RIGHT_HAND_NOTES;
      correctNote = notesArray[Math.floor(Math.random() * notesArray.length)];
      attempts++;
    } while (
      previousNote &&
      correctNote.note === previousNote.note &&
      correctNote.octave === previousNote.octave &&
      attempts < maxAttempts // Safety break
    );

    setCurrentNote(correctNote);
    setPreviousNote(correctNote);
    playNote(correctNote.note, correctNote.octave);

    const newOptions = [
      `${correctNote.note}${correctNote.octave}`,
      ...generateWrongOptions(correctNote),
    ];
    shuffleArray(newOptions);
    setOptions(newOptions);
    setFeedback(""); // Clear feedback for the new question
    setIsWaitingForNextQuestion(false); // Allow interaction for new question
  }, [previousNote, playNote]);

  const handleModeChange = useCallback(
    (newMode) => {
      if (mode === newMode) return;

      resetGameState(newMode, -1, `Switched to ${newMode} mode. Press Start.`);
      setMode(newMode);
      setSelectedStudent(null); // Deselect student when changing mode
      setCompetitiveTriesLeft(DEFAULT_COMPETITIVE_TRIES); // Reset tries

      // Reset student dropdown if switching away from scored mode
      if (newMode !== "scored") {
        const dropdown = document.getElementById("student-select");
        if (dropdown) dropdown.value = "";
      }
    },
    [mode, resetGameState]
  ); // Depends on mode and resetGameState

  const endGame = useCallback(async () => {
    if (endGameRef.current) return;
    endGameRef.current = true;

    setIsActive(false);
    setIsTimerPaused(false); // Ensure timer isn't stuck paused
    clearTimeout(timerRef.current);
    clearTimeout(feedbackTimeoutRef.current);
    setIsWaitingForNextQuestion(false);

    const accuracy = totalGuesses > 0 ? (score / totalGuesses) * 100 : 0;
    const accuracyDisplay = accuracy.toFixed(0);

    let finalFeedback = "";

    if (mode === "practice") {
      finalFeedback = `Practice complete! Final score: ${getScoreDisplay()}.`;
      playSound("practiceSuccess");
    } else if (mode === "scored" && selectedStudent) {
      const currentHighScore = selectedStudent.score || 0;
      const canUpdateHighScore =
        accuracy >= REQUIRED_ACCURACY_FOR_HS && score > currentHighScore;
      let beatHighScore = false;

      // Decrement tries regardless of outcome
      const newTriesLeft = Math.max(0, competitiveTriesLeft - 1);
      setCompetitiveTriesLeft(newTriesLeft);

      if (canUpdateHighScore) {
        try {
          const response = await fetch("/api/updateScore", {
            // Ensure API exists
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedStudent.id, score }),
          });
          if (!response.ok)
            throw new Error(`Failed to update score: ${response.statusText}`);

          finalFeedback = `🎉 Congratulations, ${selectedStudent.first_name}! New High Score: ${score} (${accuracyDisplay}% accuracy).`;
          beatHighScore = true;

          // Update local state optimistically
          const updatedStudents = students
            .map((student) =>
              student.id === selectedStudent.id
                ? { ...student, score }
                : student
            )
            .sort((a, b) => b.score - a.score);
          setStudents(updatedStudents);
          setSelectedStudent((prev) => ({ ...prev, score }));

          playSound("highScoreSuccess");
          triggerConfetti();
        } catch (error) {
          console.error("Error updating score:", error);
          finalFeedback = `Score: ${score} (${accuracyDisplay}%). Failed to save high score.`;
          playSound("error");
        }
      } else {
        // Did not beat high score
        finalFeedback = `Attempt finished. Score: ${score} (${accuracyDisplay}%). `;
        if (accuracy < REQUIRED_ACCURACY_FOR_HS) {
          finalFeedback += `You need ${REQUIRED_ACCURACY_FOR_HS}% accuracy to set a high score. `;
        } else if (score <= currentHighScore) {
          finalFeedback += `Current high score is ${currentHighScore}. `;
        }
        playSound(beatHighScore ? "success" : "error"); // Play success only if score was good but didn't beat HS
      }

      // Handle out of tries
      if (newTriesLeft <= 0) {
        finalFeedback +=
          " No more competitive tries left. Switching to Practice mode.";
        // Delay mode switch to allow reading feedback
        setTimeout(() => {
          // Check context hasn't changed drastically
          if (mode === "scored" && competitiveTriesLeft <= 0) {
            handleModeChange("practice");
          }
        }, 4000);
      } else {
        finalFeedback += ` ${newTriesLeft} competitive ${
          newTriesLeft === 1 ? "try" : "tries"
        } left.`;
      }
    } else {
      // Game ended unexpectedly (e.g., scored mode without student)
      finalFeedback = `Game over! Score: ${getScoreDisplay()}.`;
      if (mode === "scored") handleModeChange("practice"); // Force to practice if invalid state
    }

    setFeedback(finalFeedback);
    setPreviousNote(null); // Prep for potential restart

    // Allow restart shortly after
    setTimeout(() => {
      endGameRef.current = false;
    }, 500);
  }, [
    mode,
    score,
    totalGuesses,
    selectedStudent,
    competitiveTriesLeft,
    students,
    getScoreDisplay,
    triggerConfetti,
    playSound,
    handleModeChange, // Added students dependency
  ]);

  const startGame = useCallback(() => {
    if (isActive) {
      // Resetting the game
      resetGameState(mode, -1, "Game reset. Press Start.");
    } else {
      // Starting a new game
      if (mode === "scored") {
        if (!selectedStudent) {
          alert("Please select a student before starting Competitive mode.");
          return;
        }
        if (competitiveTriesLeft <= 0) {
          alert(
            "No more competitive tries left for this student. Switch to Practice or select another student."
          );
          return;
        }
      }
      // Use resetGameState to set initial state correctly, then set active
      resetGameState(mode, -1, ""); // Clears score, sets time, clears feedback etc.
      setIsActive(true);
      // generateNewQuestion will be called by the useEffect hook for isActive
    }
  }, [isActive, mode, selectedStudent, competitiveTriesLeft, resetGameState]); // Added dependencies

  const handlePasswordCancel = useCallback(() => {
    setShowPasswordPopup(false);
    setTempStudentSelection(null);
    // Reset dropdown to previously selected student or default
    const dropdown = document.getElementById("student-select");
    if (dropdown) {
      dropdown.value = selectedStudent ? selectedStudent.id : "";
    }
  }, [selectedStudent]);

  const handleStudentChange = useCallback(
    (e) => {
      const newStudentIdString = e.target.value;
      if (!newStudentIdString) {
        // Handle "-- Select a student --"
        setSelectedStudent(null);
        setTempStudentSelection(null);
        setShowPasswordPopup(false);
        if (isActive) startGame(); // Reset active game
        setFeedback("Select a student for Competitive mode.");
        return;
      }
      const newStudentId = parseInt(newStudentIdString);
      const student = students.find((s) => s.id === newStudentId);
      if (student && student.id !== selectedStudent?.id) {
        setTempStudentSelection(student);
        setShowPasswordPopup(true);
      }
    },
    [selectedStudent, students, isActive, startGame]
  ); // Added dependencies

  const handlePasswordSubmit = useCallback(
    (password) => {
      if (password === PASSWORD) {
        // Use secure auth in real apps
        setSelectedStudent(tempStudentSelection);
        setShowPasswordPopup(false);
        setMode("scored"); // Ensure mode is scored
        setCompetitiveTriesLeft(DEFAULT_COMPETITIVE_TRIES); // Reset tries

        // Use resetGameState for consistency, then provide feedback
        const studentName = tempStudentSelection?.first_name || "Student";
        resetGameState(
          "scored",
          SCORED_TIME,
          `${studentName} selected. Press Start.`
        );
        setTempStudentSelection(null); // Clear temp selection on success
      } else {
        alert("Incorrect password");
        // Keep popup open, allow retry
      }
    },
    [tempStudentSelection, resetGameState]
  ); // Added dependency

  const handleGuess = useCallback(
    (guess) => {
      // Prevent guess if game not active, waiting, or already ended
      if (!isActive || isWaitingForNextQuestion || endGameRef.current) return;

      clearTimeout(feedbackTimeoutRef.current); // Clear previous feedback timeout
      setIsWaitingForNextQuestion(true); // Disable interaction

      const correctAnswer = `${currentNote.note}${currentNote.octave}`;
      const isCorrect = guess === correctAnswer;

      playSound(isCorrect ? "success" : "error");
      setTotalGuesses((prev) => prev + 1);

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setFeedback("Correct!");
        setIsTimerPaused(false); // Ensure timer is running if it was paused

        feedbackTimeoutRef.current = setTimeout(() => {
          if (isActive && !endGameRef.current) {
            generateNewQuestion();
          } else {
            setIsWaitingForNextQuestion(false); // Ensure re-enabled if game ended during delay
          }
        }, CORRECT_ANSWER_DELAY);
      } else {
        // *** Incorrect Answer Logic: Pause Timer ***
        setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
        setIsTimerPaused(true); // PAUSE the timer immediately
        clearTimeout(timerRef.current); // Stop the current timer interval

        feedbackTimeoutRef.current = setTimeout(() => {
          // After 3 seconds:
          setIsTimerPaused(false); // RESUME timer logic (useEffect will handle next tick)
          if (isActive && !endGameRef.current) {
            generateNewQuestion(); // Load next question
          } else {
            setIsWaitingForNextQuestion(false); // Ensure re-enabled if game ended
          }
        }, INCORRECT_ANSWER_DELAY);
      }
    },
    [
      isActive,
      isWaitingForNextQuestion,
      currentNote,
      playSound,
      generateNewQuestion,
      // No timer/pause state needed as dependencies here, handled internally
    ]
  );

  // --- useEffect Hooks ---

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Start first question when game becomes active
  useEffect(() => {
    if (isActive && isFirstRender.current) {
      generateNewQuestion();
      isFirstRender.current = false;
    }
  }, [isActive, generateNewQuestion]);

  // Manage Game Timer (Handles pausing)
  useEffect(() => {
    // Conditions to run the timer: Active, time left, and NOT paused
    if (isActive && timeLeft > 0 && !isTimerPaused) {
      timerRef.current = setTimeout(() => {
        // Double check state hasn't changed rapidly before decrementing
        if (isActive && !isTimerPaused) {
          setTimeLeft((prevTime) => Math.max(0, prevTime - 1)); // Prevent going below 0
        }
      }, 1000);
    }
    // If time runs out WHILE game is active, end the game (pause state irrelevant now)
    else if (isActive && timeLeft === 0) {
      endGame();
    }

    // Cleanup function: Clear timeout if dependencies change or component unmounts
    // This is crucial for pausing: it clears the timeout when isTimerPaused becomes true
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft, endGame, isTimerPaused]); // Added isTimerPaused dependency

  // --- Render ---
  return (
    <div
      ref={quizContainerRef}
      className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4 text-gray-800 font-sans">
      <h2 className="text-2xl font-bold text-center text-indigo-700">
        Grand Staff Note Quiz 🎹 🎵
      </h2>

      {/* Mode Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-center font-semibold text-gray-700">
          Select Mode:
        </label>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleModeChange("practice")}
            disabled={isActive}
            className={`px-4 py-2 rounded font-medium transition-all duration-150 text-sm shadow ${
              mode === "practice"
                ? "bg-blue-600 text-white ring-2 ring-blue-300"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${isActive ? "opacity-60 cursor-not-allowed" : ""}`}>
            Practice 🤓
          </button>
          <button
            onClick={() => handleModeChange("scored")}
            disabled={isActive}
            className={`px-4 py-2 rounded font-medium transition-all duration-150 text-sm shadow ${
              mode === "scored"
                ? "bg-red-600 text-white ring-2 ring-red-300"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${isActive ? "opacity-60 cursor-not-allowed" : ""}`}>
            Competitive 🏆
          </button>
        </div>
      </div>

      {/* Student Selection (Scored Mode) */}
      {mode === "scored" && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <label
            htmlFor="student-select"
            className="block mb-1 text-center font-semibold text-red-800">
            Select Student:
          </label>
          <select
            id="student-select"
            value={selectedStudent ? selectedStudent.id : ""}
            onChange={handleStudentChange}
            disabled={isActive}
            className={`w-full p-2 border border-red-300 rounded focus:ring-2 focus:ring-red-400 focus:border-red-400 ${
              isActive ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}>
            <option value="">-- Select a student --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name} (HS:{" "}
                {student.score ?? 0})
              </option>
            ))}
            {students.length === 0 && (
              <option disabled>Loading students...</option>
            )}
          </select>
          {selectedStudent && (
            <p className="mt-2 text-center text-sm text-red-700 font-medium">
              Tries Left:{" "}
              <span className="font-bold">{competitiveTriesLeft}</span>
              {competitiveTriesLeft <= 0 && " (Switch modes or student)"}
            </p>
          )}
        </div>
      )}

      {/* Staff Renderer Area */}
      <div className="h-48 flex items-center justify-center border-t border-b border-gray-200 py-4 my-4 bg-gray-50 rounded">
        {currentNote ? (
          <StaffRenderer currentNote={currentNote} />
        ) : (
          <div className="text-gray-400 italic">
            {isActive
              ? "Loading note..."
              : feedback || "Press Start to begin..."}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.length > 0
          ? options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleGuess(option)}
                disabled={!isActive || isWaitingForNextQuestion}
                className={`px-4 py-3 text-lg font-semibold rounded shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === "practice"
                    ? "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white focus:ring-blue-500"
                    : "bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white focus:ring-red-500"
                }`}>
                {option.replace(/[0-9]/g, "")} {/* Show only note name */}
              </button>
            ))
          : isActive // Show placeholders only if active and options are empty
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="px-4 py-3 text-lg font-semibold rounded bg-gray-200 animate-pulse"></div>
            ))
          : // Show disabled-looking placeholders if not active and no options
            Array.from({ length: 4 }).map((_, idx) => (
              <button
                key={idx}
                disabled
                className="px-4 py-3 text-lg font-semibold rounded bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"></button>
            ))}
      </div>

      {/* Feedback Display */}
      <p className="text-center font-semibold h-6 min-h-[1.5rem] text-indigo-800">
        {/* Show feedback, or non-breaking space if active and no feedback */}
        {feedback ||
          (isActive && !isWaitingForNextQuestion && "\u00A0") ||
          "\u00A0"}
      </p>

      {/* Score and Timer */}
      <div className="flex justify-around items-center p-3 bg-gray-100 rounded border border-gray-200">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Score</p>
          <p className="font-semibold text-lg text-indigo-700">
            {getScoreDisplay()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Time Left</p>
          <p
            className={`font-bold text-3xl transition-colors duration-300 ${
              timeLeft <= 10 && timeLeft > 0 && isActive
                ? "text-red-500 animate-pulse"
                : "text-gray-800"
            }`}>
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      {/* Start/Reset Button */}
      <div className="text-center pt-2">
        <button
          onClick={startGame}
          disabled={
            !isActive &&
            mode === "scored" &&
            (!selectedStudent || competitiveTriesLeft <= 0)
          }
          className={`w-full sm:w-auto mt-2 px-8 py-3 text-lg font-bold rounded shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
            isActive
              ? "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-500" // Reset style
              : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500" // Start style
          } ${
            !isActive &&
            mode === "scored" &&
            (!selectedStudent || competitiveTriesLeft <= 0)
              ? "!bg-gray-400 !text-gray-700 cursor-not-allowed"
              : ""
          } `} // Disabled start style override
        >
          {isActive ? "Reset Game" : "Start Game"}
        </button>
      </div>

      {/* Password Popup */}
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

export default GrandStaffQuiz;
