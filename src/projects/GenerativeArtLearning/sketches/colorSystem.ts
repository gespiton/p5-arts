import p5 from "p5";
import { ColorGenerator } from "../../../foundation/utils/colorGenerator";

export function colorSystem(p: p5) {
  const canvasWidth = 800;
  const canvasHeight = 800;


  p.setup = function () {
    p.frameRate(10);
    p.createCanvas(canvasWidth, canvasHeight, p.P2D);
    p.pixelDensity(1);
    p.smooth();
    p.noLoop();
    p.mouseClicked = () => {
      drawFrame()
    }
    p.background(0)
    setupBasic();
  };

  let colorSystem: ColorGenerator
  function setupBasic() {
    colorSystem = new ColorGenerator({
      a: p.createVector(0.5, 0.5, 0.5),
      b: p.createVector(0.5, 0.5, 0.5),
      c: p.createVector(1, 1, 1),
      // d: p.createVector(0, 0.1, 0.2),
      d: p.createVector(0.3, 0.2, 0.2),
      totalStep: p.width,
      p: p
    })

  }

  function drawFrame() {
    for (let i = 0; i < p.width; i++) {
      const color = colorSystem.next()
      // if (color.x > 1) {
      //   alert(color.x)
      // }
      console.log("🚀 ~ drawFrame ~ color:", color.x)
      p.stroke(color.x, color.y, color.z)
      p.strokeWeight(1)
      p.line(i, 0, i, p.height)
    }
  }

  p.draw = function () {
    p.background(255)
    drawFrame();
  };
}
