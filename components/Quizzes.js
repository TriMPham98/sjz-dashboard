import React from "react";
import GrandStaffQuiz from "./GrandStaffQuiz";

const Quizzes = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Grand Staff Note Quiz
          </h2>
          <GrandStaffQuiz />
        </div>

        <div className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Rhythm Reading Quiz
          </h2>
          <p className="text-gray-300 mb-4">
            Test your rhythm reading skills with this interactive quiz. Coming
            soon!
          </p>
          <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Start Quiz (Coming Soon)
          </button>
        </div>

        <div className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Chord Identification Quiz
          </h2>
          <p className="text-gray-300 mb-4">
            Practice identifying different chords by ear. Coming soon!
          </p>
          <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Start Quiz (Coming Soon)
          </button>
        </div>

        <div className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Key Signature Quiz
          </h2>
          <p className="text-gray-300 mb-4">
            Test your knowledge of key signatures. Coming soon!
          </p>
          <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Start Quiz (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
