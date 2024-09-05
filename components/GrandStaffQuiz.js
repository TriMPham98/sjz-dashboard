import React, { useState, useEffect, useRef } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const notes = ["C", "D", "E", "F", "G", "A", "B"];
const octaves = [3, 4];

const GrandStaffQuiz = () => {
  const [currentNote, setCurrentNote] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const successAudioRef = useRef(null);
  const errorAudioRef = useRef(null);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  useEffect(() => {
    if (currentNote) {
      drawStaff();
    }
  }, [currentNote]);

  const generateNewQuestion = () => {
    let correctNote;
    do {
      correctNote = {
        note: notes[Math.floor(Math.random() * notes.length)],
        octave: octaves[Math.floor(Math.random() * octaves.length)],
      };
    } while (
      (correctNote.octave === 4 && ["A", "B"].includes(correctNote.note)) ||
      (correctNote.octave === 3 && correctNote.note < "C")
    );

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
      let wrongNote, wrongOctave;
      do {
        wrongNote = notes[Math.floor(Math.random() * notes.length)];
        wrongOctave = octaves[Math.floor(Math.random() * octaves.length)];
      } while (
        (wrongOctave === 4 && ["A", "B"].includes(wrongNote)) ||
        (wrongOctave === 3 && wrongNote < "C")
      );

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
    context.setFillStyle("#000000");
    context.setStrokeStyle("#000000");

    const trebleStaff = new VF.Stave(10, 0, 380);
    trebleStaff.addClef("treble").setContext(context).draw();

    const bassStaff = new VF.Stave(10, 80, 380);
    bassStaff.addClef("bass").setContext(context).draw();

    const isOnTrebleStaff = currentNote.octave === 4;
    const staveToUse = isOnTrebleStaff ? trebleStaff : bassStaff;

    const note = new VF.StaveNote({
      clef: isOnTrebleStaff ? "treble" : "bass",
      keys: [`${currentNote.note.toLowerCase()}/${currentNote.octave}`],
      duration: "w",
    });

    if (isOnTrebleStaff) {
      if (["C", "D", "E"].includes(currentNote.note)) {
        note.addModifier(new VF.Annotation("").setPosition(1));
      }
    } else {
      if (["A", "B"].includes(currentNote.note)) {
        note.addModifier(new VF.Annotation("").setPosition(3));
      } else if (currentNote.note === "C") {
        note.addModifier(new VF.Annotation("").setPosition(1));
      }
    }

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables([note]);

    const formatter = new VF.Formatter()
      .joinVoices([voice])
      .format([voice], 380);
    voice.draw(context, staveToUse);
  };

  const handleGuess = (guess) => {
    const correctAnswer = `${currentNote.note}${currentNote.octave}`;
    if (guess === correctAnswer) {
      setFeedback("Correct!");
      setScore(score + 1);
      if (successAudioRef.current) {
        successAudioRef.current.play();
      }
    } else {
      setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
      if (errorAudioRef.current) {
        errorAudioRef.current.play();
      }
    }
    setTimeout(generateNewQuestion, 1000);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-gray-800">
      <h2 className="text-xl font-bold text-center">Grand Staff Note Quiz</h2>
      <p className="text-center text-sm">Range: C3 to G4</p>
      <div id="staff" className="w-full h-48 bg-gray-100"></div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleGuess(option)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {option}
          </button>
        ))}
      </div>
      <p className="text-center font-semibold">{feedback}</p>
      <p className="text-center font-semibold">Score: {score}</p>
      <audio ref={successAudioRef} src="/success.mp3" />
      <audio ref={errorAudioRef} src="/error.mp3" />
    </div>
  );
};

export default GrandStaffQuiz;
