import React, { useRef, useCallback } from "react";

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

  return { playSound };
};

export default SoundManager;
