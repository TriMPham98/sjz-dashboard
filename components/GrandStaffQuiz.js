import React, { useState, useEffect } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const notes = ["C", "D", "E", "F", "G", "A", "B"];
const octaves = [3, 4, 5];

const GrandStaffQuiz = () => {
  const [currentNote, setCurrentNote] = useState(null);
  const [userGuess, setUserGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateNewNote();
  }, []);

  useEffect(() => {
    if (currentNote) {
      drawStaff();
    }
  }, [currentNote]);

  const generateNewNote = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const randomOctave = octaves[Math.floor(Math.random() * octaves.length)];
    setCurrentNote({ note: randomNote, octave: randomOctave });
  };

  const drawStaff = () => {
    const div = document.getElementById("staff");
    div.innerHTML = "";

    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(400, 200);
    const context = renderer.getContext();
    context.setFillStyle("#FFFFFF");
    context.setStrokeStyle("#FFFFFF");

    const trebleStaff = new VF.Stave(10, 0, 380);
    trebleStaff.addClef("treble").setContext(context).draw();

    const bassStaff = new VF.Stave(10, 80, 380);
    bassStaff.addClef("bass").setContext(context).draw();

    const note = new VF.StaveNote({
      clef: currentNote.octave >= 4 ? "treble" : "bass",
      keys: [`${currentNote.note.toLowerCase()}/${currentNote.octave}`],
      duration: "w",
    });

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables([note]);

    const formatter = new VF.Formatter()
      .joinVoices([voice])
      .format([voice], 380);
    voice.draw(context, currentNote.octave >= 4 ? trebleStaff : bassStaff);
  };

  const handleGuess = () => {
    const correctAnswer = `${currentNote.note}${currentNote.octave}`;
    if (userGuess.toUpperCase() === correctAnswer) {
      setFeedback("Correct!");
      setScore(score + 1);
    } else {
      setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
    }
    setUserGuess("");
    generateNewNote();
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 rounded-xl shadow-md space-y-4 text-white">
      <h2 className="text-xl font-bold text-center">Grand Staff Note Quiz</h2>
      <div id="staff" className="w-full h-48 bg-gray-700"></div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter note (e.g., C4)"
          className="flex-grow px-3 py-2 border rounded text-black"
        />
        <button
          onClick={handleGuess}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Guess
        </button>
      </div>
      <p className="text-center">{feedback}</p>
      <p className="text-center">Score: {score}</p>
    </div>
  );
};

export default GrandStaffQuiz;
