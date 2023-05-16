import React from "react";
import p5 from "p5";
import { P5Frame } from "../../foundation/P5Frame";
import { FlowFields } from "../../foundation/FlowFields/FlowFields";

function distortedSpiritSketch(p: p5) {
  const col = 30;
  const row = 30;
  const canvasWidth = 800;
  const canvasHeight = 600;
  const flowFields = new FlowFields(p, col, row, 0.03);
  p.setup = function () {
    p.frameRate(30);
    p.createCanvas(canvasWidth, canvasHeight);
  };

  p.draw = function () {
    p.background(255);
    const rowStep = canvasHeight / row;
    const colStep = canvasWidth / col;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        const xStart = j * colStep + colStep / 2;
        const yStart = i * rowStep + rowStep / 2;
        const force = flowFields.getFlow(j, i);
        const angle = p.atan2(force.y, force.x);
        p.stroke(0);
        p.push();
        p.translate(xStart, yStart);
        p.rotate(angle);
        p.line(0, 0, 10, 0);
        p.pop();
      }
    }
    flowFields.updateFlow();
  };
}

const MainPage = () => {
  return (
    <div>
      <P5Frame sketch={distortedSpiritSketch} />
    </div>
  );
};

export default MainPage;
