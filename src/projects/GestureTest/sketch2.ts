import p5 from "p5";
import { BaseParticle } from "../../foundation/particleSystem/BaseParticle";
import { HandPositionInfo } from "../../foundation/GestureDetector/GestureDetectorCore";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";


class FingerParticle extends BaseParticle {

}

const createGestureDetectorDemoSketch = (handPositionRef: {
  current: HandPositionInfo | null;
}) => (p: p5) => {
  const canvasWidth = 800;
  const canvasHeight = 600;
  const config = {
    x: 0,
    y: 0,
    p5: p,
    color: p.color(200, 200, 200),
    radius: 10
  }
  const Fingers = [
    new FingerParticle(config),
    new FingerParticle(config),
    new FingerParticle(config),
    new FingerParticle(config),
    new FingerParticle(config),
  ]
  let forceSlider: p5.Element;
  let frictionSlider: p5.Element;
  p.setup = function () {
    p.frameRate(60);
    p.createCanvas(canvasWidth, canvasHeight);
    p.pixelDensity(1);
    forceSlider = p.createSlider(0.01, 0.2, 0.08, 0.01)
    frictionSlider = p.createSlider(0.1, 1, 0.1, 0.1)
  };

  let previousHandPosition: NormalizedLandmark[] | null = null;
  p.draw = function () {
    p.clear(0, 0, 0, 0);
    p.background(0);
    const handPosition = handPositionRef.current;
    const hand1 = handPosition?.fingerPosition[0] ?? previousHandPosition;
    if (hand1) {
      previousHandPosition = hand1;
      for (let i = 0; i < hand1.length; i++) {
        const finger = Fingers[i];
        const force = p.createVector(
          p.map(hand1[i].x, 0, 1, 0, p.width),
          p.map(hand1[i].y, 0, 1, 0, p.height))
          .sub(finger.pos)
          .mult(Number(forceSlider.value()))
          .limit(15);
        // const force = p.createVector(
        //   p.mouseX,
        //   p.mouseY)
        //   .sub(finger.pos)
        //   .mult(Number(forceSlider.value()))
        //   .limit(15);
        finger.applyForce(force);
        const friction = Number(frictionSlider.value())
        finger.applyFluidResistance(friction);
        // finger.applyFriction(friction);
        finger.update()
        if (i === 0) {
        }
        finger.show();
      }
    }
    // } else {
    //   for (let i = 0; i < Fingers.length; i++) {
    //     const finger = Fingers[i];
    //     finger.update()
    //     finger.show();
    //   }
    // }
  };
}
export { createGestureDetectorDemoSketch }