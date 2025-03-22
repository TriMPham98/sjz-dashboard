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
      const isOnTrebleStaff = currentNote.octave >= 4;
      const staveToUse = isOnTrebleStaff ? trebleStaff : bassStaff;

      // Format the note key with accidentals included in the string
      let noteKey = currentNote.note.toLowerCase() + "/" + currentNote.octave;

      const note = new VF.StaveNote({
        clef: isOnTrebleStaff ? "treble" : "bass",
        keys: [noteKey],
        duration: "w",
      });

      if (isOnTrebleStaff) {
        if (
          ["C", "D", "E"].includes(currentNote.note.replace(/#|b/, "")) &&
          currentNote.octave === 4
        ) {
          note.addModifier(new VF.Annotation("").setPosition(1));
        }
      } else {
        if (["A", "B"].includes(currentNote.note.replace(/#|b/, ""))) {
          note.addModifier(new VF.Annotation("").setPosition(3));
        } else if (currentNote.note.replace(/#|b/, "") === "C") {
          note.addModifier(new VF.Annotation("").setPosition(1));
        }
      }

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables([note]);

      new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 50);
      voice.draw(context, staveToUse);
    }
  }, [currentNote, staffRef]);

  useEffect(() => {
    drawStaff();
  }, [drawStaff]);

  return <div ref={staffRef} className="w-full h-48 bg-gray-100"></div>;
};

export default StaffRenderer;
