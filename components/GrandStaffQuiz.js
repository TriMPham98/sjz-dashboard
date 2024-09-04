import React, { useState, useEffect } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const notes = ["C", "D", "E", "F", "G", "A", "B"];
const octaves = [2, 3, 4, 5, 6]; // Extended range to include more ledger lines

const GrandStaffQuiz = () => {
  const [currentNote, setCurrentNote] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  useEffect(() => {
    if (currentNote) {
      drawStaff();
    }
  }, [currentNote]);

  const generateNewQuestion = () => {
    const correctNote = {
      note: notes[Math.floor(Math.random() * notes.length)],
      octave: octaves[Math.floor(Math.random() * octaves.length)],
    };
    setCurrentNote(correctNote);

    const newOptions = [
      `${correctNote.note}${correctNote.octave}`,
      ...generateWrongOptions(correctNote),
    ];
    shuffleArray(newOptions);
    setOptions(newOptions);
    setFeedback("");
  };

  const generateWrongOptions = (correctNote) => {
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrongNote = notes[Math.floor(Math.random() * notes.length)];
      const wrongOctave = octaves[Math.floor(Math.random() * octaves.length)];
      const option = `${wrongNote}${wrongOctave}`;
      if (
        option !== `${correctNote.note}${correctNote.octave}` &&
        !wrongOptions.includes(option)
      ) {
        wrongOptions.push(option);
      }
    }
    return wrongOptions;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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

    // Add ledger lines if necessary
    if (
      currentNote.octave >= 6 ||
      (currentNote.octave === 5 && ["A", "B"].includes(currentNote.note))
    ) {
      note.addModifier(new VF.Annotation("").setPosition(3));
    } else if (
      currentNote.octave <= 2 ||
      (currentNote.octave === 3 && ["C", "D"].includes(currentNote.note))
    ) {
      note.addModifier(new VF.Annotation("").setPosition(1));
    }

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables([note]);

    const formatter = new VF.Formatter()
      .joinVoices([voice])
      .format([voice], 380);
    voice.draw(context, currentNote.octave >= 4 ? trebleStaff : bassStaff);
  };

  const handleGuess = (guess) => {
    const correctAnswer = `${currentNote.note}${currentNote.octave}`;
    if (guess === correctAnswer) {
      setFeedback("Correct!");
      setScore(score + 1);
    } else {
      setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
    }
    setTimeout(generateNewQuestion, 1500);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 rounded-xl shadow-md space-y-4 text-white">
      <h2 className="text-xl font-bold text-center">Grand Staff Note Quiz</h2>
      <div id="staff" className="w-full h-48 bg-gray-700"></div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleGuess(option)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {option}
          </button>
        ))}
      </div>
      <p className="text-center">{feedback}</p>
      <p className="text-center">Score: {score}</p>
    </div>
  );
};

export default GrandStaffQuiz;
