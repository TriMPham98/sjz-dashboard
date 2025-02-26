// components/MusicBingo.jsx
import React, { useState, useEffect } from "react";

const MusicBingo = () => {
  const [squares, setSquares] = useState(Array(25).fill(""));
  const [selected, setSelected] = useState(Array(25).fill(false));
  const [isEditing, setIsEditing] = useState(true);
  const [hasWon, setHasWon] = useState(false);

  const checkWin = () => {
    // Check rows
    for (let i = 0; i < 25; i += 5) {
      if (selected.slice(i, i + 5).every((val) => val)) return true;
    }
    // Check columns
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((j) => selected[i + j * 5])) return true;
    }
    // Check diagonals
    if ([0, 6, 12, 18, 24].every((i) => selected[i])) return true;
    if ([4, 8, 12, 16, 20].every((i) => selected[i])) return true;
    return false;
  };

  const toggleSelected = (index) => {
    if (!isEditing) {
      const newSelected = [...selected];
      newSelected[index] = !newSelected[index];
      setSelected(newSelected);
    }
  };

  const updateSquare = (index, value) => {
    const newSquares = [...squares];
    newSquares[index] = value;
    setSquares(newSquares);
  };

  const toggleMode = () => {
    setIsEditing(!isEditing);
    setHasWon(false);
    if (isEditing) {
      const newSelected = [...selected];
      newSelected[12] = true;
      setSelected(newSelected);
    }
  };

  const resetGame = () => {
    setSelected(Array(25).fill(false));
    setHasWon(false);
  };

  useEffect(() => {
    if (!isEditing && checkWin()) {
      setHasWon(true);
    }
  }, [selected, isEditing, checkWin]);

  const renderSquare = (index) => {
    const isCenter = index === 12;

    return (
      <div
        key={index}
        className={`
          border border-gray-700
          aspect-square 
          flex items-center justify-center 
          p-1
          ${selected[index] ? "bg-blue-900" : "bg-black"}
          ${isCenter ? "bg-yellow-900" : ""}
          ${hasWon ? "animate-pulse" : ""}
          cursor-pointer
          transition-colors
        `}
        onClick={() => toggleSelected(index)}>
        {isEditing && !isCenter ? (
          <input
            type="text"
            value={squares[index]}
            onChange={(e) => updateSquare(index, e.target.value)}
            className="w-full h-full text-center bg-black text-white border border-gray-700 rounded"
            maxLength={20}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm font-medium text-white">
            {isCenter ? "FREE" : squares[index]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-1 mb-4">
        {"BINGO".split("").map((letter, i) => (
          <div key={i} className="text-center font-bold text-xl text-white">
            {letter}
          </div>
        ))}
        {Array(25)
          .fill(null)
          .map((_, i) => renderSquare(i))}
      </div>

      {hasWon && (
        <div className="mb-4 bg-green-900 text-white p-4 rounded">
          <h3 className="font-bold">Winner!</h3>
          <p>Congratulations! You've got BINGO!</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={toggleMode}
          className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
          {isEditing ? "Start Playing" : "Edit Card"}
        </button>

        {!isEditing && (
          <button
            onClick={resetGame}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border border-gray-700">
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
};

export default MusicBingo;
