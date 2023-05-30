import p5 from "p5";
import { P5Frame } from "../../foundation/P5Frame";
import { Emitter } from "./Emitter";
import styled from "styled-components";
import { Mode, PARTICLE_COUNT } from "./constant";
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
    emitter = new Emitter(p, PARTICLE_COUNT);
  };

  const modes = [Mode.DAY_TIME, Mode.WHITE_PAPER];
  let modeIndex = 0;
  const render = () => {
    const mode = modes[modeIndex % 2];

    if (mode === Mode.DAY_TIME) {
      p.background(255);
      emitter.show();
    } else if (mode === Mode.WHITE_PAPER) {
      p.background(0);
      emitter.show();
    }
  };

  p.draw = render;

  p.mouseClicked = () => {
    emitter.changeMode(modes[++modeIndex % 2]);
  };

  p.keyPressed = () => {
    // this will download the first 5 seconds of the animation!
    if (p.key === "s") {
      p.saveGif("mySketch", 1, {});
    }
  };
}

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;

const MainPage = () => {
  return (
    <Container id="test">
      <P5Frame sketch={toBelieveSketch} />
    </Container>
  );
};

export default MainPage;
