import React from "react";

const ModeSelector = ({ mode, onModeChange, disabled }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-center font-semibold text-gray-700">
        Select Mode:
      </label>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onModeChange("practice")}
          disabled={disabled}
          className={`px-4 py-2 rounded font-medium transition-all duration-150 text-sm shadow ${
            mode === "practice"
              ? "bg-blue-600 text-white ring-2 ring-blue-300"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
          Practice
        </button>
        <button
          onClick={() => onModeChange("scored")}
          disabled={disabled}
          className={`px-4 py-2 rounded font-medium transition-all duration-150 text-sm shadow ${
            mode === "scored"
              ? "bg-red-600 text-white ring-2 ring-red-300"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
          Competitive
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;
