import p5 from "p5";

export function name(p: p5) {
  const canvasWidth = 800;
  const canvasHeight = 800;


  p.setup = function () {
    p.frameRate(10);
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    p.pixelDensity(1);
    p.smooth();
    // p.noLoop();
    p.mouseClicked = () => {
      if (p.isLooping()) {
        p.noLoop();
      } else {
        p.loop();
      }
    }
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
