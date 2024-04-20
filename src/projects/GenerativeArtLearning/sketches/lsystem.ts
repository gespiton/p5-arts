import p5 from "p5";
import { LSystem } from "../../../foundation/Lsystem/LSystem";
import { Turtle } from "../../../foundation/Lsystem/Turtle";

export function lsystem(p: p5) {
  const canvasWidth = 800;
  const canvasHeight = 800;


  p.setup = function () {
    p.frameRate(60);
    p.createCanvas(canvasWidth, canvasHeight, p.P2D);
    p.pixelDensity(1);
    p.smooth();
    p.noLoop();
    p.mouseClicked = () => {
      p.resetMatrix();
      this.translate(p.mouseX, p.mouseY);
      drawFull()
    }
    p.background(0)
    setupBasic();
  };


  let lsystem: LSystem;
  let turtle: Turtle;
  function setupBasic() {
    let rules = {
      F: "FF+[+F-F-F]-[-F+F+F]",
      // F: "F[F]-F+F[--F]+F-G",
      // G: "GF-F++G",
    };
    lsystem = new LSystem("F", rules);
    turtle = new Turtle(p, 4, p.radians(25));

    for (let i = 0; i < 5; i++) {
      lsystem.generate();
    }
    p.background(255)

    // Some other rules
    // let ruleset = {
    //   F: "F[F]-F+F[--F]+F-F",
    // };
    // lsystem = new LSystem("F-F-F-F", ruleset);
    // turtle = new Turtle(4, PI / 2);

    // let ruleset = {
    //   F: "F--F--F--G",
    //   G: "GG",
    // };
    // lsystem = new LSystem("F--F--F", ruleset);
    // turtle = new Turtle(8, PI / 3);
  }

  let step = 0;
  function drawFrame() {
    for (let i = 0; i < 1; i++) {
      step++
      turtle.renderToStep(lsystem.sentence, step);
    }
  }

  function drawFull() {
    turtle.render(lsystem.sentence);
  }

  p.draw = function () {
    p.background('#DFD0B8')
    // for (let i = 0; i < 20; i++) {
    //   p.resetMatrix();
    //   p.translate(p.width / 2, p.height);
    //   drawFrame();
    // }
    // p.translate(p.width / 2, p.height);
    drawFull();
  };

}
