import p5 from "p5";
import { P5Frame } from "../../foundation/P5Frame";
import { Emitter } from "./Emitter";
import styled from "styled-components";
import { Mode } from "./constant";
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

  let mode = Mode.WHITE_PAPER;
  const render = () => {
    if (mode === Mode.DAY_TIME) {
      p.background(255);
      emitter.show();
    } else if (mode === Mode.WHITE_PAPER) {
      p.background(0);
      emitter.show();
    }
  };

  p.draw = render;

  p.keyPressed = () => {
    // this will download the first 5 seconds of the animation!
    if (p.key === "s") {
      p.saveGif("mySketch", 1, {});
    }
    if (p.key === "c") {
      emitter.changeMode(Mode.WHITE_PAPER);
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
