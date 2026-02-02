import React, { useEffect, useRef, useCallback } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

const KeySignatureRenderer = ({ keySpec }) => {
  const staffRef = useRef(null);

  const drawStaff = useCallback(() => {
    if (!staffRef.current) return;

    staffRef.current.innerHTML = "";

    const renderer = new VF.Renderer(
      staffRef.current,
      VF.Renderer.Backends.SVG
    );

    const width = 475;
    const height = 120;
    renderer.resize(width, height);

    const context = renderer.getContext();
    context.setFillStyle("#000000");
    context.setStrokeStyle("#000000");

    const staveWidth = width - 20;
    const trebleStaff = new VF.Stave(10, 20, staveWidth);
    trebleStaff.addClef("treble");

    if (keySpec && keySpec !== "C") {
      trebleStaff.addKeySignature(keySpec);
    }

    trebleStaff.setContext(context).draw();
  }, [keySpec]);

  useEffect(() => {
    drawStaff();
  }, [drawStaff]);

  return <div ref={staffRef} className="w-full bg-gray-100"></div>;
};

export default KeySignatureRenderer;
