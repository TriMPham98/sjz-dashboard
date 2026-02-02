import React from "react";

const QuizAnswerGrid = ({
  options,
  onAnswer,
  disabled,
  mode,
  isActive,
  formatOption,
}) => {
  const format = formatOption || ((opt) => opt);

  if (options.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className={`px-4 py-3 text-lg font-semibold rounded shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === "practice"
                ? "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white focus:ring-blue-500"
                : "bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white focus:ring-red-500"
            }`}>
            {format(option)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, idx) =>
        isActive ? (
          <div
            key={idx}
            className="px-4 py-3 text-lg font-semibold rounded bg-gray-200 animate-pulse"></div>
        ) : (
          <button
            key={idx}
            disabled
            className="px-4 py-3 text-lg font-semibold rounded bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"></button>
        )
      )}
    </div>
  );
};

export default QuizAnswerGrid;
