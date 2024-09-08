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

  const getColorForOffset = (offset) => {
    const absOffset = Math.abs(offset);
    if (absOffset <= 50) return "text-green-500";
    if (absOffset <= 100) return "text-yellow-500";
    return "text-red-500";
  };

  useEffect(() => {
    const notes = drawStaff();
    animationRef.current = requestAnimationFrame(animate);

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        const now = performance.now();
        const beatProgress = (now - startTimeRef.current) % beatDuration;
        let offset;

        if (beatProgress <= beatDuration / 2) {
          offset = Math.round(beatProgress);
        } else {
          offset = Math.round(beatProgress - beatDuration);
        }

        const colorClass = getColorForOffset(offset);
        setFeedback(
          <span className={colorClass}>
            {offset > 0 ? "+" : ""}
            {offset} ms
          </span>
        );

        notes[currentBeat].setStyle({
          fillStyle:
            colorClass === "text-green-500"
              ? "green"
              : colorClass === "text-yellow-500"
              ? "orange"
              : "red",
          strokeStyle:
            colorClass === "text-green-500"
              ? "green"
              : colorClass === "text-yellow-500"
              ? "orange"
              : "red",
        });

        drawStaff();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, currentBeat, drawStaff, beatDuration]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-gray-800">
      <h2 className="text-xl font-bold text-center">
        Test Your Rhythm Skills 🥁 🎵
      </h2>
      <p className="text-center text-sm">Press spacebar on each beat</p>

      <div ref={staffRef} className="w-full bg-white rounded shadow-lg"></div>
      <div className="text-center font-semibold text-2xl">{feedback}</div>
      <div className="text-center text-lg">Current Beat: {currentBeat + 1}</div>
    </div>
  );
};

export default RhythmGame;
