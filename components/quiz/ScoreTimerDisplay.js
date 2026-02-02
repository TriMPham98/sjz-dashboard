import React from "react";

const ScoreTimerDisplay = ({
  scoreDisplay,
  formattedTime,
  timeLeft,
  isActive,
  feedback,
}) => {
  return (
    <>
      <p className="text-center font-semibold h-6 min-h-[1.5rem] text-indigo-800">
        {feedback ||
          (isActive && "\u00A0") ||
          "\u00A0"}
      </p>

      <div className="flex justify-around items-center p-3 bg-gray-100 rounded border border-gray-200">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Score</p>
          <p className="font-semibold text-lg text-indigo-700">
            {scoreDisplay}
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
            {formattedTime}
          </p>
        </div>
      </div>
    </>
  );
};

export default ScoreTimerDisplay;
