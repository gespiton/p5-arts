import p5 from "p5";
import { PerlinNoise } from "../../../foundation/utils/PerlinNoise";

const threeDSphere = (p: p5) => {
  const canvasWidth = 800;
  const canvasHeight = 800;
  const initialRadius = 300;


  p.setup = function () {
    p.frameRate(10);
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    p.pixelDensity(1);
    p.smooth();
    p.noLoop();
    p.mouseClicked = () => {
      if (p.isLooping()) {
        p.noLoop();
      } else {
        p.loop();
      }
    }
    p.background(0)
  };

  let s = 0;
  let t = 0;
  let lastX = 0;
  let lastY = 0;
  let lastZ = 0;

  p.draw = function () {
    let radius = initialRadius / 2 + p.noise(t / 10) * 100;
    p.clear()
    p.background(0);
    t += 0.1;
    console.log("🚀 ~ threeDSphere ~  t:", t)
    console.count("draw");
    p.stroke(255);
    p.rotateX(10);
    p.rotateY((t % 360) / 300);
    let step = 0;
    while (step < 360) {
      s = s + 8;
      step += 1;

      const radianS = p.radians(s);
      const radianT = p.radians(t + step);
      let x = radius * p.sin(radianT) * p.cos(radianS);
      let y = radius * p.sin(radianS) * p.sin(radianT);
      let z = radius * p.cos(radianT);
      if (step !== 1) {
        p.stroke(255, 100);
        p.line(lastX, lastY, lastZ, x, y, z);
        p.circle(x, y, 3);

        p.push();
        p.translate(x, y, z);
        p.stroke(255, 50);
        p.fill(200, 200, 200, 230)
        p.sphere(p.noise(x / 10, y / 10, z / 10) * 2 + 3, 10, 10)
        p.pop();
      }
      lastX = x;
      lastY = y;
      lastZ = z;
    }
  };
}
export { threeDSphere }