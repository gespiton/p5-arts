import p5 from "p5";

const threeDDrawing = (p: p5) => {
  const canvasWidth = 400;
  const canvasHeight = 400;
  let xStart = p.random(100);
  let yStart = p.random(100);


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

  p.draw = function () {
    p.background(0);
    xStart += 0.01;
    yStart += 0.01;
    let xNoise = xStart
    let yNoise = yStart

    for (let y = 0; y < p.height; y += 5) {
      yNoise += 0.1
      xNoise = xStart
      for (let x = 0; x < p.width; x += 5) {
        xNoise += 0.1
        drawPoint(x, y, p.noise(xNoise, yNoise));
      }
    }
  };

  function drawPoint(x: number, y: number, noise: number) {
    p.push();
    p.translate(x - p.width / 2, y - p.height / 2, y - p.height / 2);
    const sphereSize = noise * 10
    const grey = 150 + noise * 120
    const alph = 150 + noise * 120
    p.fill(grey, alph)
    p.sphere(sphereSize, 40, 40)
    p.pop();
  }
}
export { threeDDrawing }