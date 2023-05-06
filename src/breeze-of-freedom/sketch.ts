import p5 from 'p5';
import { Oscillator } from '../foundation/Oscillator';

export function breezeOfFreedomSketch(p: p5) {
  let o: Oscillator | null = null;
  p.setup = function () {
    p.frameRate(60);
    p.createCanvas(200, 200);
    o = new Oscillator(p, 200, 200);
  };

  p.draw = function () {
    p.background(255);
    o?.oscillate();
    o?.display();
    let fps = p.frameRate();
    p.fill(255);
    p.stroke(0);
    p.text('FPS: ' + fps.toFixed(2), 10, p.height - 10);
  };
}
