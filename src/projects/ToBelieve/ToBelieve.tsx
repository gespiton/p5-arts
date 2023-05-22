import React from 'react';
import p5 from 'p5';
import { P5Frame } from '../../foundation/P5Frame';
import { Emitter } from './Emitter';
import { createMotionBlurDrawFunction } from '../../foundation/motionBlurTemplates';

function toBelieveSketch(p: p5) {
  let emitter: Emitter;
  p.setup = () => {
    p.createCanvas(1000, 1200);
    // p.createCanvas(400, 400);
    p.background(0);
    p.noStroke();
    p.pixelDensity(1);
    emitter = new Emitter(p, 50000);
  };

  const render = () => {
    p.background(255);
    emitter.show();
    console.log(p.frameRate());
  };

  // p.draw = createMotionBlurDrawFunction(p, render);
  p.draw = render;
}

const MainPage = () => {
  return (
    <div>
      <P5Frame sketch={toBelieveSketch} />
    </div>
  );
};

export default MainPage;
