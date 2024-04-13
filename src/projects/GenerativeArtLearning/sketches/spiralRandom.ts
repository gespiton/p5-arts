import p5 from "p5";
import { PerlinNoise } from "../../../foundation/utils/PerlinNoise";

const spiralRandom = (p: p5) => {
  const canvasWidth = 800;
  const canvasHeight = 800;
  let deg = 0;
  const initialRadius = 200;
  let radius = initialRadius;
  let lastPointX;
  let lastPointY;


  p.setup = function () {
    p.frameRate(60);
    p.createCanvas(canvasWidth, canvasHeight);
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
    p.keyPressed = () => {
      p.redraw();
    }
    lastPointX = p.width / 2;
    lastPointY = p.height / 2;
    p.background(0)
  };

  const radiusPNoise = PerlinNoise.getInstance({
    p,
    step: 0.01,
    xOffset: 0,
    yOffset: 0,
  });
  const colorPNoise = new PerlinNoise({
    p,
    step: 0.01,
    xOffset: p.random(1000),
    range: [0, 255]
  });
  const colorGPNoise = new PerlinNoise({
    p,
    step: 0.01,
    xOffset: p.random(1000),
    range: [0, 255]
  });
  const colorRPNoise = new PerlinNoise({
    p,
    step: 0.01,
    xOffset: p.random(1000),
    range: [100, 255]
  });
  const alphaPNoise = new PerlinNoise({
    p,
    step: 0.01,
    xOffset: p.random(1000),
    range: [4, 10]
  });
  const diameterPNoise = new PerlinNoise({
    p,
    step: 0.01,
    xOffset: p.random(1000),
    range: [3, 5]
  });
  p.draw = function () {
    for (let i = 0; i < 1000; i++) {

      deg += 1;
      const rad = p.radians(deg);
      const radiusNoise = radiusPNoise.next();
      const x = p.width / 2 + radius * radiusNoise * p.cos(rad);
      console.log("🚀 ~ spiralRandom ~ x :", x)
      const y = p.height / 2 + radius * radiusNoise * p.sin(rad);
      p.fill(colorRPNoise.next(), colorGPNoise.next(), colorPNoise.next(), alphaPNoise.next());
      p.noStroke();
      p.circle(x, y, diameterPNoise.next());
      lastPointX = x;
      lastPointY = y;
      radius += 0.1;
      if (radius > 600) {
        radius = initialRadius;
      }
    }
  };
}
export { spiralRandom }