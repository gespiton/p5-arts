import p5 from "p5";

const threeDDrawing = (p: p5) => {
  const canvasWidth = 400;
  const canvasHeight = 400;


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

  };
}
export { threeDDrawing }