import React, { useEffect, useRef, useCallback } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const StaffRenderer = ({ currentNote }) => {
  const staffRef = useRef(null);

  const drawStaff = useCallback(() => {
    if (!staffRef.current) return;

    staffRef.current.innerHTML = "";

    const renderer = new VF.Renderer(
      staffRef.current,
      VF.Renderer.Backends.SVG
    );

    const width = 475;
    const height = 200;
    renderer.resize(width, height);

    const context = renderer.getContext();
    context.setFillStyle("#000000");
    context.setStrokeStyle("#000000");

    const staveWidth = width - 20;
    const trebleStaff = new VF.Stave(10, 30, staveWidth);
    trebleStaff.addClef("treble").setContext(context).draw();

    const bassStaff = new VF.Stave(10, 110, staveWidth);
    bassStaff.addClef("bass").setContext(context).draw();

    if (currentNote) {
      // Determine which staff to use
      let isRightHand = currentNote.octave >= 4;

      // Force F# to right hand (treble staff)
      if (currentNote.note === "F#") {
        isRightHand = true;
      }

      const staveToUse = isRightHand ? trebleStaff : bassStaff;
      const clef = isRightHand ? "treble" : "bass";

      // Get base note without accidentals
      const baseName = currentNote.note.charAt(0).toLowerCase();
      const noteKey = `${baseName}/${currentNote.octave}`;

      // Create the note
      const note = new VF.StaveNote({
        clef: clef,
        keys: [noteKey],
        duration: "w",
      });

      // Special handling for F#
      if (currentNote.note === "F#") {
        try {
          // Add text annotation instead of trying to add the accidental
          note.addModifier(
            new VF.Annotation("F#").setPosition(3).setFont("Arial", 12, "bold")
          );
        } catch (error) {
          console.error("Error adding F# annotation:", error);
        }
      }
      // Add appropriate modifiers based on note placement
      else if (isRightHand) {
        if (
          ["C", "D", "E"].includes(currentNote.note.charAt(0)) &&
          currentNote.octave === 4
        ) {
          note.addModifier(new VF.Annotation("").setPosition(1));
        }
      } else {
        if (["A", "B"].includes(currentNote.note.charAt(0))) {
          note.addModifier(new VF.Annotation("").setPosition(3));
        } else if (currentNote.note.charAt(0) === "C") {
          note.addModifier(new VF.Annotation("").setPosition(1));
        }
      }

      try {
        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables([note]);

        new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 50);
        voice.draw(context, staveToUse);
      } catch (error) {
        console.error("Error drawing note:", error);
      }
    }
  }, [currentNote, staffRef]);

  useEffect(() => {
    drawStaff();
  }, [drawStaff]);

  return <div ref={staffRef} className="w-full h-48 bg-gray-100"></div>;
};

export default StaffRenderer;
