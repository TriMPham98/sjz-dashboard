import React, { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { useSound } from "./SoundManager";
import Vex from "vexflow";

const VF = Vex.Flow;

const StaffRenderer = ({ notes }) => {
  const staffRef = useRef(null);

  useEffect(() => {
    drawStaff();
  }, [notes]);

  const drawStaff = () => {
    if (!staffRef.current) return;

    staffRef.current.innerHTML = "";

    const renderer = new VF.Renderer(
      staffRef.current,
      VF.Renderer.Backends.SVG
    );

    const width = 475;
    const height = 200;
    renderer.resize(width, height);

    const context = renderer.getContext();
    context.setFillStyle("#000000");
    context.setStrokeStyle("#000000");

    const staveWidth = width - 20;
    const trebleStaff = new VF.Stave(10, 30, staveWidth);
    trebleStaff.addClef("treble").setContext(context).draw();

    const bassStaff = new VF.Stave(10, 110, staveWidth);
    bassStaff.addClef("bass").setContext(context).draw();

    if (notes && notes.length > 0) {
      const chordNotes = notes.map((noteStr) => {
        const [note, octave] = noteStr.split(/(\d+)/);
        return { note, octave: parseInt(octave) };
      });

      const trebleNotes = chordNotes.filter((n) => n.octave >= 4);
      const bassNotes = chordNotes.filter((n) => n.octave < 4);

      const drawNotesOnStaff = (staffNotes, staff, clef) => {
        if (staffNotes.length > 0) {
          const staveNote = new VF.StaveNote({
            clef: clef,
            keys: staffNotes.map((n) => `${n.note.toLowerCase()}/${n.octave}`),
            duration: "w",
          });

          const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
          voice.addTickables([staveNote]);

          new VF.Formatter()
            .joinVoices([voice])
            .format([voice], staveWidth - 50);
          voice.draw(context, staff);
        }
      };

      drawNotesOnStaff(trebleNotes, trebleStaff, "treble");
      drawNotesOnStaff(bassNotes, bassStaff, "bass");
    }
  };

  return <div ref={staffRef} className="w-full h-48 bg-gray-100"></div>;
};

const chords = [
  { name: "C Major", notes: ["C4", "E4", "G4"] },
  { name: "G Major", notes: ["G3", "B3", "D4"] },
  { name: "F Major", notes: ["F3", "A3", "C4"] },
  { name: "A Minor", notes: ["A3", "C4", "E4"] },
  { name: "D Minor", notes: ["D4", "F4", "A4"] },
];

const ChordQuickdrawQuiz = () => {
  const [currentChord, setCurrentChord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const { playSound } = useSound();
  const timerRef = useRef(null);
  const quizContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  const generateNewChord = useCallback(() => {
    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    setCurrentChord(randomChord);

    // Generate 3 wrong options
    const wrongOptions = chords
      .filter((chord) => chord.name !== randomChord.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((chord) => chord.name);

    // Add correct answer and shuffle
    const allOptions = [...wrongOptions, randomChord.name].sort(
      () => 0.5 - Math.random()
    );
    setOptions(allOptions);

    setFeedback("");
  }, []);

  useEffect(() => {
    if (isActive && isFirstRender.current) {
      generateNewChord();
      isFirstRender.current = false;
    } else if (!isActive) {
      setCurrentChord(null);
      isFirstRender.current = true;
    }
  }, [isActive, generateNewChord]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft]);

  const handleAnswer = useCallback(
    (selectedAnswer) => {
      if (!isActive) return;

      setTotalQuestions((prev) => prev + 1);
      const isCorrect = selectedAnswer === currentChord.name;

      playSound(isCorrect ? "success" : "error");

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setFeedback("Correct!");
      } else {
        setFeedback(`Incorrect. The correct answer was ${currentChord.name}.`);
      }

      setTimeout(generateNewChord, 1000);
    },
    [isActive, currentChord, playSound, generateNewChord]
  );

  const startGame = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      clearTimeout(timerRef.current);
      setFeedback("Game reset. Press Start to begin a new game.");
      setCurrentChord(null);
    } else {
      setIsActive(true);
      setTimeLeft(60);
      setScore(0);
      setTotalQuestions(0);
      setFeedback("");
      isFirstRender.current = true;
    }
  }, [isActive]);

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

  const endGame = useCallback(() => {
    setIsActive(false);
    clearTimeout(timerRef.current);

    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    setFeedback(
      `Game over! Your final score is ${score}/${totalQuestions} (${accuracy.toFixed(
        2
      )}% accuracy).`
    );
    playSound("gameOver");
    triggerConfetti();

    setCurrentChord(null);
  }, [score, totalQuestions, playSound, triggerConfetti]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={quizContainerRef}
      className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-gray-800">
      <h2 className="text-xl font-bold text-center">
        Chord Quickdraw Quiz 🎹 🎵
      </h2>

      {currentChord && <StaffRenderer notes={currentChord.notes} />}

      <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={!isActive}
            className={`px-4 py-2 ${
              isActive
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}>
            {option}
          </button>
        ))}
      </div>

      <p className="text-center font-semibold">{feedback}</p>
      <div className="text-center">
        <p className="font-semibold">
          Score: {score}/{totalQuestions}
        </p>
      </div>
      <div className="text-center">
        <p className="font-bold text-xl">{formatTime(timeLeft)}</p>
        <button
          onClick={startGame}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          {isActive ? "Reset" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default ChordQuickdrawQuiz;
