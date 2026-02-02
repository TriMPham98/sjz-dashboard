import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

const ROWS = [
  { name: "Kick", color: "bg-rose-500" },
  { name: "Snare", color: "bg-amber-500" },
  { name: "Hi-Hat", color: "bg-emerald-500" },
  { name: "Open Hat", color: "bg-sky-500" },
];

const STEPS = 16;

const createEmptyPattern = () =>
  Array.from({ length: ROWS.length }, () => Array(STEPS).fill(false));

const DrumMachine = () => {
  const [pattern, setPattern] = useState(createEmptyPattern);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(-1);

  const patternRef = useRef(pattern);
  const synthsRef = useRef(null);
  const sequenceIdRef = useRef(null);
  const stepRef = useRef(0);

  // Keep patternRef in sync with state
  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  // Initialize synths
  useEffect(() => {
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
    }).toDestination();

    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
    }).toDestination();

    const hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();

    const openhat = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();

    synthsRef.current = { kick, snare, hihat, openhat };

    return () => {
      kick.dispose();
      snare.dispose();
      hihat.dispose();
      openhat.dispose();
    };
  }, []);

  // Sync BPM
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  const startPlayback = useCallback(async () => {
    await Tone.start();
    const transport = Tone.getTransport();
    transport.bpm.value = bpm;
    stepRef.current = 0;

    sequenceIdRef.current = transport.scheduleRepeat((time) => {
      const step = stepRef.current;
      const p = patternRef.current;
      const synths = synthsRef.current;

      if (p[0][step]) synths.kick.triggerAttackRelease("C1", "8n", time);
      if (p[1][step]) synths.snare.triggerAttackRelease("8n", time);
      if (p[2][step]) synths.hihat.triggerAttackRelease("C4", "32n", time);
      if (p[3][step]) synths.openhat.triggerAttackRelease("C4", "8n", time);

      Tone.getDraw().schedule(() => {
        setCurrentStep(step);
      }, time);

      stepRef.current = (step + 1) % STEPS;
    }, "16n");

    transport.start();
    setIsPlaying(true);
  }, [bpm]);

  const stopPlayback = useCallback(() => {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    sequenceIdRef.current = null;
    stepRef.current = 0;
    setIsPlaying(false);
    setCurrentStep(-1);
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
    };
  }, []);

  const toggleStep = useCallback((row, step) => {
    setPattern((prev) => {
      const newPattern = prev.map((r) => [...r]);
      newPattern[row][step] = !newPattern[row][step];
      return newPattern;
    });
  }, []);

  const clearPattern = useCallback(() => {
    setPattern(createEmptyPattern());
  }, []);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={togglePlayback}
          className={`px-5 py-2 rounded font-bold text-white transition-colors shadow ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}>
          {isPlaying ? "Stop" : "Play"}
        </button>
        <button
          onClick={clearPattern}
          className="px-4 py-2 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow">
          Clear
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">BPM:</label>
          <input
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-24 accent-indigo-600"
          />
          <span className="text-sm font-bold text-gray-800 w-8">{bpm}</span>
        </div>
      </div>

      {/* Sequencer Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {ROWS.map((row, rowIdx) => (
            <div key={row.name} className="flex items-center gap-1 mb-1">
              <div className="w-16 text-xs font-semibold text-gray-600 text-right pr-2 shrink-0">
                {row.name}
              </div>
              {Array.from({ length: STEPS }).map((_, stepIdx) => {
                const isActive = pattern[rowIdx][stepIdx];
                const isCurrent = currentStep === stepIdx && isPlaying;
                const isBeatStart = stepIdx % 4 === 0 && stepIdx > 0;

                return (
                  <button
                    key={stepIdx}
                    onClick={() => toggleStep(rowIdx, stepIdx)}
                    className={`w-8 h-8 rounded-sm transition-all duration-75 border ${
                      isBeatStart ? "ml-1" : ""
                    } ${
                      isActive
                        ? `${row.color} border-transparent`
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    } ${
                      isCurrent
                        ? "ring-2 ring-indigo-400 ring-offset-1 scale-110"
                        : ""
                    }`}
                    aria-label={`${row.name} step ${stepIdx + 1} ${
                      isActive ? "on" : "off"
                    }`}
                  />
                );
              })}
            </div>
          ))}

          {/* Beat numbers */}
          <div className="flex items-center gap-1 mt-1">
            <div className="w-16 shrink-0" />
            {Array.from({ length: STEPS }).map((_, stepIdx) => {
              const isBeatStart = stepIdx % 4 === 0 && stepIdx > 0;
              return (
                <div
                  key={stepIdx}
                  className={`w-8 text-center text-[10px] text-gray-400 ${
                    isBeatStart ? "ml-1" : ""
                  }`}>
                  {stepIdx + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrumMachine;
