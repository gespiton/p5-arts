import p5 from "p5";
import { Boid } from "../../../foundation/particleSystem/flock/Boid";

const BoidCount = 1000

export function flocking(p: p5) {
  const canvasWidth = 800;
  const canvasHeight = 800;


  p.setup = function () {
    p.frameRate(60);
    p.createCanvas(canvasWidth, canvasHeight, p.P2D);
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
    p.keyPressed = () => {
      // save image when press s
      if (p.key === 's') {
        p.saveCanvas('p5Image', 'png');
      }
    };
    p.background(0)
    setupBasic();
  };

  const boids: Boid[] = [];

  const renderBoid = (b: Boid) => {
    p.push();
    p.translate(b.position.x, b.position.y);
    p.rotate(b.velocity.heading());
    p.fill(255, 255, 255, 100);
    p.stroke(b.color.x, b.color.y, b.color.z, 255);
    // p.line(0, 0, 5, 0);
    // p.square(0, 0, 5)
    p.ellipse(0, 0, 10, 3)
    p.pop();
  }

  function setupBasic() {
    for (let i = 0; i < BoidCount; i++) {
      const b = new Boid({
        p: p,
        position: p.createVector(p.random(p.width / 2), p.random(p.height)),
        velocity: p.createVector(p.random(-2, 2), p.random(-1, 1)),
        maxSpeed: 2,
        maxForce: 0.1,
        radius: 3,
        render: renderBoid
      })
      if (i < BoidCount / 2) {
        b.color = p.createVector(p.random(200), p.random(240), p.random(200))
      } else {
        b.color = p.createVector(200, 200, 200)
      }
      boids.push(b);
    }
  }

  function drawFrame() {
    p.background(0, 0, 0, 5)
    boids.forEach(boid => {
      boid.run(boids);
    });
  }

  p.draw = function () {
    drawFrame();
  };

}
