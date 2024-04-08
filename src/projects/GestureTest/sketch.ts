import p5 from "p5";
import { HandPositionInfo } from "../../foundation/GestureDetector/useGestureDetector";

const createGestureDetectorDemoSketch = (handPositionRef: {
  current: HandPositionInfo | null;
}) => (p: p5) => {
  const canvasWidth = 800;
  const canvasHeight = 600;
  p.setup = function () {
    p.frameRate(30);
    p.createCanvas(canvasWidth, canvasHeight);
    p.pixelDensity(1);
  };

  p.draw = function () {
    const handPosition = handPositionRef.current;
    p.clear(0, 0, 0, 0);
    p.background(0);
    const hand1 = handPosition?.fingerPosition[0];
    if (hand1) {
      p.color(255, 0, 0)
      for (let i = 0; i < hand1.length; i++) {
        p.circle(hand1[i].x * canvasWidth, hand1[i].y * canvasHeight, 10);
      }
    }
  };
}
export { createGestureDetectorDemoSketch }