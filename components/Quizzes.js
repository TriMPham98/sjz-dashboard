import React from "react";
import GrandStaffQuiz from "./GrandStaffQuiz";
import RhythmGame from "./RhythmGame";
import ChordQuickdrawQuiz from "./ChordQuickdraw";
import KeySignatureQuiz from "./KeySignatureQuiz";

const Quizzes = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Grand Staff Note Quiz
          </h2>
          <GrandStaffQuiz />
        </div>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Chord Quickdraw Quiz
          </h2>
          <ChordQuickdrawQuiz />
        </div>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Rhythm Reading Quiz
          </h2>
          <p className="text-gray-600 mb-4">
            Test your rhythm reading skills with this interactive quiz. Coming
            soon!
          </p>
          <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Start Quiz (Coming Soon)
          </button>
          {/* <RhythmGame /> */}
        </div>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Key Signature Quiz
          </h2>
          <KeySignatureQuiz />
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
