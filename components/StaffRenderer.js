import React, { useEffect, useRef } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const StaffRenderer = ({ currentNote }) => {
  const staffRef = useRef(null);

  useEffect(() => {
    if (currentNote) {
      drawStaff();
    }
  }, [currentNote]);

  const drawStaff = () => {
    if (!staffRef.current) return;

    staffRef.current.innerHTML = "";

    const renderer = new VF.Renderer(
      staffRef.current,
      VF.Renderer.Backends.SVG
    );
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

    new VF.Formatter().joinVoices([voice]).format([voice], 380);
    voice.draw(context, staveToUse);
  };

  return <div ref={staffRef} className="w-full h-48 bg-gray-100"></div>;
};

export default StaffRenderer;
