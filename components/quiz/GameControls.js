import React from "react";

const GameControls = ({ isActive, onStartReset, disabled, mode }) => {
  return (
    <div className="text-center pt-2">
      <button
        onClick={onStartReset}
        disabled={disabled}
        className={`w-full sm:w-auto mt-2 px-8 py-3 text-lg font-bold rounded shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
          isActive
            ? "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-500"
            : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
        } ${disabled ? "!bg-gray-400 !text-gray-700 cursor-not-allowed" : ""}`}>
        {isActive ? "Reset Game" : "Start Game"}
      </button>
    </div>
  );
};

export default GameControls;
