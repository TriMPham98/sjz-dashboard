import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import PasswordPopup from "./PasswordPopup";
import StaffRenderer from "./StaffRenderer";
import { useSound } from "./SoundManager";

// Define the range of notes and octaves used in the quiz
const notes = ["C", "D", "E", "F", "G", "A", "B"];
const octaves = [3, 4];

const GrandStaffQuiz = () => {
  // State variables for managing the quiz
  const [currentNote, setCurrentNote] = useState(null);
  const [previousNote, setPreviousNote] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [tempStudentSelection, setTempStudentSelection] = useState(null);
  const [mode, setMode] = useState("practice");
  const [competitiveTriesLeft, setCompetitiveTriesLeft] = useState(3);

  // Custom hook for playing sounds
  const { playSound, playNote } = useSound();

  // Refs for managing timers and game state
  const timerRef = useRef(null);
  const quizContainerRef = useRef(null);
  const isFirstRender = useRef(true);
  const endGameRef = useRef(false);

  // Shuffle an array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Generate incorrect options for the quiz
  const generateWrongOptions = (correctNote) => {
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      let wrongNote, wrongOctave;
      do {
        wrongNote = notes[Math.floor(Math.random() * notes.length)];
        wrongOctave = octaves[Math.floor(Math.random() * octaves.length)];
      } while (
        wrongOctave === correctNote.octave &&
        wrongNote === correctNote.note
      );

      const option = `${wrongNote}${wrongOctave}`;
      if (!wrongOptions.includes(option)) {
        wrongOptions.push(option);
      }
    }
    return wrongOptions;
  };

  // Generate a new question for the quiz
  const generateNewQuestion = useCallback(() => {
    let correctNote;
    // Ensure the new note is different from the previous one
    do {
      correctNote = {
        note: notes[Math.floor(Math.random() * notes.length)],
        octave: octaves[Math.floor(Math.random() * octaves.length)],
      };
    } while (
      previousNote &&
      correctNote.note === previousNote.note &&
      correctNote.octave === previousNote.octave
    );

    setCurrentNote(correctNote);
    setPreviousNote(correctNote);

    // Play the sound of the current note
    playNote(correctNote.note, correctNote.octave);

    // Generate options for the quiz, including the correct answer
    const newOptions = [
      `${correctNote.note}${correctNote.octave}`,
      ...generateWrongOptions(correctNote),
    ];
    shuffleArray(newOptions);
    setOptions(newOptions);
    setFeedback("");
  }, [previousNote, playNote]);

  // Calculate and format the score display
  const getScoreDisplay = useCallback(() => {
    if (totalGuesses === 0) return "0/0 (0%)";
    const ratio = (score / totalGuesses).toFixed(2);
    return `${score}/${totalGuesses} (${(ratio * 100).toFixed(0)}%)`;
  }, [score, totalGuesses]);

  // Trigger confetti animation
  const triggerConfetti = useCallback(() => {
    if (quizContainerRef.current) {
      const rect = quizContainerRef.current.getBoundingClientRect();
      const centerX = (rect.left + rect.right) / 2 / window.innerWidth;
      const centerY = (rect.top + rect.bottom) / 2 / window.innerHeight;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: centerX, y: centerY },
      });
    }
  }, []);

  // End the game and handle score updates
  const endGame = useCallback(async () => {
    if (endGameRef.current) return;
    endGameRef.current = true;

    setIsActive(false);
    clearTimeout(timerRef.current);

    const accuracy = totalGuesses > 0 ? (score / totalGuesses) * 100 : 0;

    if (mode === "practice") {
      setFeedback(`Great job! Your final score is ${getScoreDisplay()}.`);
      playSound("practiceSuccess");
    } else if (mode === "scored" && selectedStudent) {
      if (accuracy >= 90 && score > selectedStudent.score) {
        try {
          // Update the student's score in the database
          const response = await fetch("/api/updateScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedStudent.id, score }),
          });

          if (!response.ok) throw new Error("Failed to update score");

          setFeedback(
            `Congratulations, ${
              selectedStudent.first_name
            }! You beat your high score with ${accuracy.toFixed(
              2
            )}% accuracy. New high score: ${score}`
          );
          // Update the local students list with the new score
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student.id === selectedStudent.id
                ? { ...student, score }
                : student
            )
          );
          setSelectedStudent((prev) => ({ ...prev, score }));

          playSound("highScoreSuccess");
          triggerConfetti();
        } catch (error) {
          console.error("Error updating score:", error);
          setFeedback(
            `Your score: ${score} with ${accuracy.toFixed(
              2
            )}% accuracy. Failed to update high score. Please try again later.`
          );
        }
      } else {
        setFeedback(
          `Your score: ${score} with ${accuracy.toFixed(2)}% accuracy. ${
            accuracy < 90
              ? "You need at least 90% accuracy to update the high score."
              : "Try again!"
          }`
        );
      }

      // Manage competitive tries
      setCompetitiveTriesLeft((prev) => {
        const newTriesLeft = prev - 1;
        if (newTriesLeft === 0) {
          setMode("practice");
          setSelectedStudent(null);
        }
        return newTriesLeft;
      });
    }

    setCurrentNote(null);
    setPreviousNote(null);

    // Reset endGameRef after a short delay to prevent multiple triggers
    setTimeout(() => {
      endGameRef.current = false;
    }, 100);
  }, [
    mode,
    score,
    totalGuesses,
    selectedStudent,
    getScoreDisplay,
    triggerConfetti,
    playSound,
  ]);

  // Fetch students data from the API
  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch("/api/checkUsers");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data.sort((a, b) => b.score - a.score));
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, []);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle game start and reset
  useEffect(() => {
    if (isActive && isFirstRender.current) {
      generateNewQuestion();
      isFirstRender.current = false;
    } else if (!isActive) {
      setCurrentNote(null);
      setPreviousNote(null);
      isFirstRender.current = true;
    }
  }, [isActive, generateNewQuestion]);

  // Manage game timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft, endGame]);

  // Handle user's guess
  const handleGuess = useCallback(
    (guess) => {
      if (!isActive) return;

      const correctAnswer = `${currentNote.note}${currentNote.octave}`;
      const isCorrect = guess === correctAnswer;

      playSound(isCorrect ? "success" : "error");

      setTotalGuesses((prev) => prev + 1);
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setFeedback("Correct!");
      } else {
        setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
      }

      // Generate a new question after a short delay
      setTimeout(generateNewQuestion, 500);
    },
    [isActive, currentNote, playSound, generateNewQuestion]
  );

  // Start or reset the game
  const startGame = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      clearTimeout(timerRef.current);
      setFeedback("Game reset. Press Start to begin a new game.");
      setMode("practice");
      setCurrentNote(null);
      setPreviousNote(null);
    } else {
      if (mode === "scored" && !selectedStudent) {
        alert("Please select a student before starting the game.");
        return;
      }
      setIsActive(true);
      setTimeLeft(mode === "practice" ? 30 : 60);
      setScore(0);
      setTotalGuesses(0);
      setFeedback("");
      setPreviousNote(null);
      isFirstRender.current = true;
      endGameRef.current = false;
    }
  }, [isActive, mode, selectedStudent]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle student selection change
  const handleStudentChange = useCallback(
    (e) => {
      const newStudentId = parseInt(e.target.value);
      if (newStudentId !== selectedStudent?.id) {
        setTempStudentSelection(students.find((s) => s.id === newStudentId));
        setShowPasswordPopup(true);
      }
    },
    [selectedStudent, students]
  );

  // Handle password submission for student selection
  const handlePasswordSubmit = useCallback(
    (password) => {
      if (password === "onDeals") {
        setSelectedStudent(tempStudentSelection);
        setShowPasswordPopup(false);
        setMode("scored");
        setCompetitiveTriesLeft(3);
      } else {
        alert("Incorrect password");
      }
      setTempStudentSelection(null);
    },
    [tempStudentSelection]
  );

  // Handle password popup cancellation
  const handlePasswordCancel = useCallback(() => {
    setShowPasswordPopup(false);
    setTempStudentSelection(null);
  }, []);

  // Handle game mode change
  const handleModeChange = useCallback(
    (newMode) => {
      if (isActive) {
        setIsActive(false);
        clearTimeout(timerRef.current);
        setFeedback("Game reset. Press Start to begin a new game.");
      }
      setMode(newMode);
      setSelectedStudent(null);
      setTimeLeft(newMode === "practice" ? 30 : 60);
      setScore(0);
      setTotalGuesses(0);
      setCurrentNote(null);
      setPreviousNote(null);
      setCompetitiveTriesLeft(3);
    },
    [isActive]
  );

  // Render the component
  return (
    <div
      ref={quizContainerRef}
      className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-gray-800">
      <h2 className="text-xl font-bold text-center">
        Test Your Note Reading Skills 🎹 🎵
      </h2>
      <p className="text-center text-sm">Range: C3 to B4</p>

      {/* Mode selection buttons */}
      <div className="mb-4">
        <label className="block mb-2 text-center">Select Mode:</label>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleModeChange("practice")}
            className={`px-4 py-2 rounded ${
              mode === "practice"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Practice 🤓
          </button>
          <button
            onClick={() => handleModeChange("scored")}
            className={`px-4 py-2 rounded ${
              mode === "scored"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Competitive 😤
          </button>
        </div>
      </div>

      {/* Student selection dropdown for scored mode */}
      {mode === "scored" && (
        <div className="mb-4">
          <select
            id="student-select"
            value={selectedStudent ? selectedStudent.id : ""}
            onChange={handleStudentChange}
            className="w-full p-2 border rounded">
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name} (High Score:{" "}
                {student.score})
              </option>
            ))}
          </select>
          {selectedStudent && (
            <p className="mt-2 text-center">
              Competitive tries left: {competitiveTriesLeft}
            </p>
          )}
        </div>
      )}

      {/* Render the musical staff */}
      <StaffRenderer currentNote={currentNote} />

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleGuess(option)}
            disabled={!isActive}
            className={`px-4 py-2 ${
              isActive
                ? mode === "practice"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}>
            {option}
          </button>
        ))}
      </div>

      {/* Feedback display */}
      <p className="text-center font-semibold">{feedback}</p>

      {/* Score display */}
      <div className="text-center">
        <p className="font-semibold">Score: {getScoreDisplay()}</p>
      </div>

      {/* Timer and start/reset button */}
      <div className="text-center">
        <p className="font-bold text-xl">{formatTime(timeLeft)}</p>
        <button
          onClick={startGame}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          {isActive ? "Reset" : "Start"}
        </button>
      </div>

      {/* Password popup for student selection */}
      {showPasswordPopup && (
        <PasswordPopup
          onSubmit={handlePasswordSubmit}
          onCancel={handlePasswordCancel}
        />
      )}
    </div>
  );
};

export default GrandStaffQuiz;
