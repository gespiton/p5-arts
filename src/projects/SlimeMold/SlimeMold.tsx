import p5 from "p5";
import { P5Frame } from "../../foundation/P5Frame";
import { Agents } from "./Agent";

function slimeMold(p5: p5) {
  // Inspired by Jason
  // https://softologyblog.wordpress.com/2019/04/11/physarum-simulations/

  let agents: Agents;

  p5.setup = function setup() {
    p5.createCanvas(720, 720);
    p5.pixelDensity(1);
    p5.background(0);
    // p5.frameRate(1)
    agents = new Agents(p5);
  };

  p5.draw = function draw() {
    p5.background(255, 10);

    p5.stroke("black");
    p5.strokeWeight(3);
    p5.mouseIsPressed && p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);

    p5.loadPixels();
    for (let i = 10; i--; ) {
      agents.update();
    }
    p5.updatePixels();
  };
}

const MainPage = () => {
  return (
    <div>
      <P5Frame sketch={slimeMold} autofit={false}/>
    </div>
  );
};

export default MainPage;
