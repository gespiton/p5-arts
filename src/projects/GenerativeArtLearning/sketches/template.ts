import p5 from "p5";

export function name(p: p5) {
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
    p.keyPressed = () => {
      // save image when press s
      if (p.key === 's') {
        p.saveCanvas('p5Image', 'png');
      }
    };
    p.background(0)
    setupBasic();
  };

  function setupBasic() {

  }

  function drawFrame() {

  }

  p.draw = function () {
    p.orbitControl();
    drawFrame();
  };

}
