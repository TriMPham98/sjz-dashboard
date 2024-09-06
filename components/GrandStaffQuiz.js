import React, { useState, useEffect, useRef, useCallback } from "react";
import Vex from "vexflow";
import confetti from "canvas-confetti";

const VF = Vex.Flow;

const notes = ["C", "D", "E", "F", "G", "A", "B"];
const octaves = [3, 4];

const PasswordPopup = ({ onSubmit, onCancel }) => {
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Enter Admin Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500"
            placeholder="Enter password"
            ref={inputRef}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="mr-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GrandStaffQuiz = () => {
  const [currentNote, setCurrentNote] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [tempStudentSelection, setTempStudentSelection] = useState(null);
  const [mode, setMode] = useState("practice");

  const successAudioRef = useRef(null);
  const errorAudioRef = useRef(null);
  const practiceSuccessAudioRef = useRef(null);
  const highScoreSuccessAudioRef = useRef(null);
  const timerRef = useRef(null);
  const quizContainerRef = useRef(null);

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

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (isActive) {
      generateNewQuestion();
    }
  }, [isActive]);

  useEffect(() => {
    if (currentNote) {
      drawStaff();
    }
  }, [currentNote]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft]);

  const generateNewQuestion = useCallback(() => {
    let correctNote;
    do {
      correctNote = {
        note: notes[Math.floor(Math.random() * notes.length)],
        octave: octaves[Math.floor(Math.random() * octaves.length)],
      };
    } while (
      (correctNote.octave === 4 && ["A", "B"].includes(correctNote.note)) ||
      (correctNote.octave === 3 && correctNote.note < "C")
    );

    setCurrentNote(correctNote);

    const newOptions = [
      `${correctNote.note}${correctNote.octave}`,
      ...generateWrongOptions(correctNote),
    ];
    shuffleArray(newOptions);
    setOptions(newOptions);
    setFeedback("");
  }, []);

  const generateWrongOptions = (correctNote) => {
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      let wrongNote, wrongOctave;
      do {
        wrongNote = notes[Math.floor(Math.random() * notes.length)];
        wrongOctave = octaves[Math.floor(Math.random() * octaves.length)];
      } while (
        (wrongOctave === 4 && ["A", "B"].includes(wrongNote)) ||
        (wrongOctave === 3 && wrongNote < "C")
      );

      const option = `${wrongNote}${wrongOctave}`;
      if (
        option !== `${correctNote.note}${correctNote.octave}` &&
        !wrongOptions.includes(option)
      ) {
        wrongOptions.push(option);
      }
    }
    return wrongOptions;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const drawStaff = useCallback(() => {
    const div = document.getElementById("staff");
    div.innerHTML = "";

    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(400, 200);
    const context = renderer.getContext();
    context.setFillStyle("#000000");
    context.setStrokeStyle("#000000");

    const trebleStaff = new VF.Stave(10, 0, 380);
    trebleStaff.addClef("treble").setContext(context).draw();

    const bassStaff = new VF.Stave(10, 80, 380);
    bassStaff.addClef("bass").setContext(context).draw();

    const isOnTrebleStaff = currentNote.octave === 4;
    const staveToUse = isOnTrebleStaff ? trebleStaff : bassStaff;

    const note = new VF.StaveNote({
      clef: isOnTrebleStaff ? "treble" : "bass",
      keys: [`${currentNote.note.toLowerCase()}/${currentNote.octave}`],
      duration: "w",
    });

    if (isOnTrebleStaff) {
      if (["C", "D", "E"].includes(currentNote.note)) {
        note.addModifier(new VF.Annotation("").setPosition(1));
      }
    } else {
      if (["A", "B"].includes(currentNote.note)) {
        note.addModifier(new VF.Annotation("").setPosition(3));
      } else if (currentNote.note === "C") {
        note.addModifier(new VF.Annotation("").setPosition(1));
      }
    }

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables([note]);

    new VF.Formatter().joinVoices([voice]).format([voice], 380);
    voice.draw(context, staveToUse);
  }, [currentNote]);

  const playSound = useCallback((isCorrect) => {
    const audioRef = isCorrect ? successAudioRef : errorAudioRef;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }, []);

  const handleGuess = useCallback(
    (guess) => {
      if (!isActive) return;

      const correctAnswer = `${currentNote.note}${currentNote.octave}`;
      const isCorrect = guess === correctAnswer;

      playSound(isCorrect);

      setTotalGuesses((prev) => prev + 1);
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setFeedback("Correct!");
      } else {
        setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
      }

      setTimeout(generateNewQuestion, 500);
    },
    [isActive, currentNote, playSound, generateNewQuestion]
  );

  const getScoreDisplay = useCallback(() => {
    if (totalGuesses === 0) return "0/0 (0%)";
    const ratio = (score / totalGuesses).toFixed(2);
    return `${score}/${totalGuesses} (${(ratio * 100).toFixed(0)}%)`;
  }, [score, totalGuesses]);

  const startGame = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      clearTimeout(timerRef.current);
      setFeedback("Game reset. Press Start to begin a new game.");
      setMode("practice");
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
      generateNewQuestion();
    }
  }, [isActive, mode, selectedStudent, generateNewQuestion]);

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

  const endGame = useCallback(async () => {
    setIsActive(false);
    clearTimeout(timerRef.current);

    const accuracy = totalGuesses > 0 ? (score / totalGuesses) * 100 : 0;

    if (mode === "practice") {
      setFeedback(`Great job! Your final score is ${getScoreDisplay()}.`);
      practiceSuccessAudioRef.current?.play();
    } else if (mode === "scored" && selectedStudent) {
      if (accuracy >= 90 && score > selectedStudent.score) {
        try {
          const response = await fetch("/api/updateScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedStudent.id, score }),
          });

          if (!response.ok) throw new Error("Failed to update score");

          setFeedback(
            `Congratulations! You beat your high score with ${accuracy.toFixed(
              2
            )}% accuracy. New high score: ${score}`
          );
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student.id === selectedStudent.id
                ? { ...student, score }
                : student
            )
          );
          setSelectedStudent((prev) => ({ ...prev, score }));

          highScoreSuccessAudioRef.current?.play();
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
    }
    setMode("practice");
    setSelectedStudent(null);
  }, [
    mode,
    score,
    totalGuesses,
    selectedStudent,
    getScoreDisplay,
    triggerConfetti,
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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

  const handlePasswordSubmit = useCallback(
    (password) => {
      if (password === "onDeals") {
        setSelectedStudent(tempStudentSelection);
        setShowPasswordPopup(false);
        setMode("scored");
      } else {
        alert("Incorrect password");
      }
      setTempStudentSelection(null);
    },
    [tempStudentSelection]
  );

  const handlePasswordCancel = useCallback(() => {
    setShowPasswordPopup(false);
    setTempStudentSelection(null);
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setSelectedStudent(null);
  }, []);

  return (
    <div
      ref={quizContainerRef}
      className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-gray-800">
      <h2 className="text-xl font-bold text-center">
        Test Your Note Reading Skills 🎹 🎵
      </h2>
      <p className="text-center text-sm">Range: C3 to G4</p>

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
        </div>
      )}

      <div id="staff" className="w-full h-48 bg-gray-100"></div>
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
      <p className="text-center font-semibold">{feedback}</p>
      <div className="text-center">
        <p className="font-semibold">Score: {getScoreDisplay()}</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-xl">{formatTime(timeLeft)}</p>
        <button
          onClick={startGame}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          {isActive ? "Reset" : "Start"}
        </button>
      </div>
      <audio ref={successAudioRef} src="/success.mp3" />
      <audio ref={errorAudioRef} src="/error.mp3" />
      <audio ref={practiceSuccessAudioRef} src="/practiceSuccess.mp3" />
      <audio ref={highScoreSuccessAudioRef} src="/highScoreSuccess.mp3" />

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
