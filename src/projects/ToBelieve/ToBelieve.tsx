import p5 from 'p5';
import { P5Frame } from '../../foundation/P5Frame';
import { Emitter } from './Emitter';
// import { createMotionBlurDrawFunction } from '../../foundation/motionBlurTemplates';

function toBelieveSketch(p: p5) {
  let emitter: Emitter;
  p.setup = () => {
    const w = 800;
    p.createCanvas(w, w * 1.6);
    // p.createCanvas(400, 400);
    p.background(0);
    p.noStroke();
    p.pixelDensity(1);
    emitter = new Emitter(p, 7000);
  };

  const render = () => {
    p.background(255);
    emitter.show();
    console.log(p.frameRate());
  };

  // p.draw = createMotionBlurDrawFunction(p, render);
  p.draw = render;

  p.keyPressed = () => {
    // this will download the first 5 seconds of the animation!
    if (p.key === 's') {
      p.saveGif('mySketch', 1, {});
    }
  };
}

const MainPage = () => {
  return (
    <div id="test">
      <P5Frame sketch={toBelieveSketch} />
    </div>
  );
};

export default MainPage;
