import React, { useRef, useCallback, useEffect } from "react";
import * as Tone from "tone";

const SoundManager = () => {
  const successAudioRef = useRef(null);
  const errorAudioRef = useRef(null);
  const practiceSuccessAudioRef = useRef(null);
  const highScoreSuccessAudioRef = useRef(null);

  return (
    <>
      <audio ref={successAudioRef} src="/success.mp3" />
      <audio ref={errorAudioRef} src="/error.mp3" />
      <audio ref={practiceSuccessAudioRef} src="/practiceSuccess.mp3" />
      <audio ref={highScoreSuccessAudioRef} src="/highScoreSuccess.mp3" />
    </>
  );
};

export const useSound = () => {
  const sampler = useRef(null);

  useEffect(() => {
    // Initialize the sampler with piano samples
    sampler.current = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    // Wait for the sampler to load before allowing playback
    Tone.loaded().then(() => {
      console.log("Piano samples loaded");
    });
  }, []);

  const playSound = useCallback((soundType) => {
    let audio;
    switch (soundType) {
      case "success":
        audio = new Audio("/success.mp3");
        break;
      case "error":
        audio = new Audio("/error.mp3");
        break;
      case "practiceSuccess":
        audio = new Audio("/practiceSuccess.mp3");
        break;
      case "highScoreSuccess":
        audio = new Audio("/highScoreSuccess.mp3");
        break;
      default:
        console.error("Invalid sound type");
        return;
    }
    audio.play();
  }, []);

  const playNote = useCallback((note, octave) => {
    if (sampler.current && Tone.loaded()) {
      sampler.current.triggerAttackRelease(`${note}${octave}`, "4n");
    } else {
      console.log("Sampler not ready yet");
    }
  }, []);

  return { playSound, playNote };
};

export default SoundManager;
