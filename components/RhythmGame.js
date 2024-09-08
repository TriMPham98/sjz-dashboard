import React, { useState, useEffect, useRef, useCallback } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const RhythmGame = () => {
  const [feedback, setFeedback] = useState("");
  const [currentBeat, setCurrentBeat] = useState(0);
  const staffRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  const bpm = 100; // Beats per minute
  const beatDuration = 60000 / bpm; // Duration of one beat in milliseconds

  const drawStaff = useCallback(() => {
    if (!staffRef.current) return;

    staffRef.current.innerHTML = "";

    const renderer = new VF.Renderer(
      staffRef.current,
      VF.Renderer.Backends.SVG
    );
    const width = 400;
    const height = 120;
    renderer.resize(width, height);

    const context = renderer.getContext();
    const stave = new VF.Stave(10, 0, width - 20);
    stave.addClef("percussion").addTimeSignature("4/4");
    stave.setContext(context).draw();

    const notes = [
      new VF.StaveNote({
        clef: "percussion",
        keys: ["b/4"],
        duration: "q",
      }).setStave(stave),
      new VF.StaveNote({
        clef: "percussion",
        keys: ["b/4"],
        duration: "q",
      }).setStave(stave),
      new VF.StaveNote({
        clef: "percussion",
        keys: ["b/4"],
        duration: "q",
      }).setStave(stave),
      new VF.StaveNote({
        clef: "percussion",
        keys: ["b/4"],
        duration: "q",
      }).setStave(stave),
    ];

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    new VF.Formatter().joinVoices([voice]).format([voice], width - 50);
    voice.draw(context, stave);

    return notes;
  }, []);

  const animate = useCallback(
    (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentBeatIndex = Math.floor(elapsed / beatDuration) % 4;

      setCurrentBeat(currentBeatIndex);

      animationRef.current = requestAnimationFrame(animate);
    },
    [beatDuration]
  );

  useEffect(() => {
    const notes = drawStaff();
    animationRef.current = requestAnimationFrame(animate);

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        const now = performance.now();
        const beatProgress = (now - startTimeRef.current) % beatDuration;
        const errorMargin = 100; // milliseconds

        if (
          beatProgress < errorMargin ||
          beatProgress > beatDuration - errorMargin
        ) {
          setFeedback("On time!");
          notes[currentBeat].setStyle({
            fillStyle: "green",
            strokeStyle: "green",
          });
        } else if (beatProgress < beatDuration / 2) {
          setFeedback("Early!");
          notes[currentBeat].setStyle({
            fillStyle: "orange",
            strokeStyle: "orange",
          });
        } else {
          setFeedback("Late!");
          notes[currentBeat].setStyle({ fillStyle: "red", strokeStyle: "red" });
        }

        drawStaff();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, currentBeat, drawStaff]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-gray-800">
      <h2 className="text-xl font-bold text-center">
        Test Your Rhythm Skills 🥁 🎵
      </h2>
      <p className="text-center text-sm">Press spacebar on each beat</p>

      <div ref={staffRef} className="w-full bg-white rounded shadow-lg"></div>
      <div className="text-center font-semibold">{feedback}</div>
      <div className="text-center text-lg">Current Beat: {currentBeat + 1}</div>
    </div>
  );
};

export default RhythmGame;
