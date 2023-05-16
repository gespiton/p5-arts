import { Emitter } from '../../foundation/particleSystem/fire/emitter';
import p5 from 'p5';

function caos(p5: p5) {
  p5.disableFriendlyErrors = true;

  let emitter: Emitter;

  p5.setup = () => {
    p5.createCanvas(800, 600, p5.P2D);
    // p5.colorMode(p5.HSB, 100);
    emitter = new Emitter(200, 375, p5);
  };

  p5.draw = function draw() {
    p5.clear(0, 0, 0, 0);
    p5.background(0);
    p5.blendMode(p5.ADD);
    let force = p5.createVector(0, -0.5);
    emitter.applyForce(force);

    let dir = p5.map(p5.mouseX, 0, p5.width, -0.4, 0.4);
    let wind = p5.createVector(dir, 0);
    emitter.applyForce(wind);

    emitter.emit(1);
    emitter.show();
    emitter.update();
  };
}

export default caos;
