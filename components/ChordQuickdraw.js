import React, { useState, useEffect } from "react";
import StaffRenderer from "./StaffRenderer";

const chords = [
  { name: "C Major", notes: ["C4", "E4", "G4"] },
  { name: "G Major", notes: ["G3", "B3", "D4"] },
  { name: "F Major", notes: ["F3", "A3", "C4"] },
  { name: "A Minor", notes: ["A3", "C4", "E4"] },
  { name: "D Minor", notes: ["D4", "F4", "A4"] },
];

const ChordQuickdrawQuiz = () => {
  const [currentChord, setCurrentChord] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      newChord();
    }
  }, [gameStarted]);

  const newChord = () => {
    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    setCurrentChord(randomChord);
    setUserAnswer("");
    setFeedback("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTotalQuestions(totalQuestions + 1);

    if (userAnswer.toLowerCase() === currentChord.name.toLowerCase()) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. The correct answer was ${currentChord.name}.`);
    }

    setTimeout(newChord, 2000);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalQuestions(0);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      {!gameStarted ? (
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start Quiz
        </button>
      ) : (
        <>
          <div className="mb-4">
            {currentChord && <StaffRenderer notes={currentChord.notes} />}
          </div>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter chord name"
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
            <button
              type="submit"
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
              Submit
            </button>
          </form>
          <div className="text-white">
            <p>
              Score: {score} / {totalQuestions}
            </p>
            <p className="mt-2">{feedback}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChordQuickdrawQuiz;
