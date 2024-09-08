import React, { useState, useEffect, useRef, useCallback } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const RhythmGame = () => {
  const [feedback, setFeedback] = useState("");
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalOffset, setTotalOffset] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const staffRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const lastBeatTimeRef = useRef(null);
  const notesRef = useRef([]);
  const beatLineRef = useRef(null);
  const staveRef = useRef(null);

  const bpm = 120; // Beats per minute
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
    staveRef.current = stave;

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

    notesRef.current = notes;

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    new VF.Formatter().joinVoices([voice]).format([voice], width - 50);
    voice.draw(context, stave);

    // Create a red vertical line for the beat indicator
    const beatLine = context.openGroup();
    context.setStrokeStyle("red");
    context.setLineWidth(2);
    context.beginPath();
    context.moveTo(notes[0].getAbsoluteX(), stave.getYForLine(0));
    context.lineTo(notes[0].getAbsoluteX(), stave.getYForLine(4));
    context.stroke();
    context.closeGroup();
    beatLineRef.current = beatLine;
  }, []);

  const animate = useCallback(
    (timestamp) => {
      if (!isActive) return;

      if (!startTimeRef.current) startTimeRef.current = timestamp;
      if (!lastBeatTimeRef.current)
        lastBeatTimeRef.current = startTimeRef.current;

      const elapsedSinceStart = timestamp - startTimeRef.current;
      const elapsedBeats = elapsedSinceStart / beatDuration;
      const currentBeatFraction = elapsedBeats % 4;

      setCurrentBeat(Math.floor(currentBeatFraction));

      // Update beat line position continuously
      if (
        beatLineRef.current &&
        notesRef.current.length === 4 &&
        staveRef.current
      ) {
        const startX = notesRef.current[0].getAbsoluteX();
        const endX = staveRef.current.getX() + staveRef.current.getWidth();
        const totalWidth = endX - startX;
        const newX = startX + (currentBeatFraction / 4) * totalWidth;
        beatLineRef.current.setAttribute(
          "transform",
          `translate(${newX - startX}, 0)`
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isActive, beatDuration]
  );

  useEffect(() => {
    drawStaff();

    const handleKeyDown = (event) => {
      if (event.code === "Space" && isActive) {
        event.preventDefault();
        const now = performance.now();
        const elapsedSinceLastBeat = now - lastBeatTimeRef.current;
        let offset = elapsedSinceLastBeat % beatDuration;

        if (offset > beatDuration / 2) {
          offset -= beatDuration;
        }

        setTotalOffset((prev) => prev + Math.abs(offset));
        setHitCount((prev) => prev + 1);

        const colorClass = getColorForOffset(offset);
        setFeedback(
          <span className={colorClass}>
            {offset > 0 ? "+" : ""}
            {Math.round(offset)} ms
          </span>
        );

        if (notesRef.current[currentBeat]) {
          notesRef.current[currentBeat].setStyle({
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
        }

        drawStaff();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [animate, currentBeat, drawStaff, beatDuration, isActive]);

  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isActive, animate]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(
        () => setTimeLeft((prev) => prev - 1),
        1000
      );
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft]);

  const startGame = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      clearTimeout(timerRef.current);
      cancelAnimationFrame(animationRef.current);
      setFeedback("Game reset. Press Start to begin a new game.");
    } else {
      setIsActive(true);
      setTimeLeft(30);
      setTotalOffset(0);
      setHitCount(0);
      setFeedback("");
      setCurrentBeat(0);
      startTimeRef.current = null;
      lastBeatTimeRef.current = null;
      drawStaff();
      requestAnimationFrame(animate);
    }
  }, [isActive, animate, drawStaff]);

  const endGame = () => {
    setIsActive(false);
    clearTimeout(timerRef.current);
    cancelAnimationFrame(animationRef.current);
    const averageOffset =
      hitCount > 0 ? (totalOffset / hitCount).toFixed(2) : 0;
    setFeedback(`Game Over! Average offset: ${averageOffset} ms`);
  };

  const getColorForOffset = (offset) => {
    const absOffset = Math.abs(offset);
    if (absOffset <= 50) return "text-green-500";
    if (absOffset <= 100) return "text-yellow-500";
    return "text-red-500";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-gray-800">
      <h2 className="text-xl font-bold text-center">
        Test Your Rhythm Skills 🥁 🎵
      </h2>
      <p className="text-center text-sm">Press spacebar on each beat</p>

      <div ref={staffRef} className="w-full bg-white rounded shadow-lg"></div>
      <div className="text-center font-semibold text-2xl">{feedback}</div>
      <div className="text-center text-lg">Current Beat: {currentBeat + 1}</div>
      <div className="text-center">
        <p className="font-bold text-xl">{formatTime(timeLeft)}</p>
        <button
          onClick={startGame}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          {isActive ? "Reset" : "Start"}
        </button>
      </div>
      {hitCount > 0 && (
        <div className="text-center">
          <p>Average Offset: {(totalOffset / hitCount).toFixed(2)} ms</p>
        </div>
      )}
    </div>
  );
};

export default RhythmGame;
