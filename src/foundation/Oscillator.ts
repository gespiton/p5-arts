import { PVector } from './PVector';
import p5 from 'p5';
export class Oscillator {
  // Using a PVector to track two angles!
  angle: PVector;
  velocity: PVector;
  amplitude: PVector;
  p: p5;
  width: number;
  height: number;

  constructor(p5: p5, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.p = p5;
    this.angle = new PVector();
    this.velocity = new PVector(
      this.p.random(-0.05, 0.05),
      this.p.random(-0.05, 0.05)
    );
    // Random velocities and amplitudes
    this.amplitude = new PVector(100, 100);
  }

  oscillate() {
    this.angle.add(this.velocity);
  }

  display() {
    // Oscillating on the x-axis
    let x = this.p.sin(this.angle.x) * this.amplitude.x;
    // Oscillating on the y-axis
    let y = this.p.sin(this.angle.y) * this.amplitude.y;

    this.p.push();
    this.p.translate(this.width / 2, this.height / 2);
    this.p.stroke(0);
    this.p.fill(175);
    // Drawing the Oscillator as a line connecting a circle
    this.p.line(0, 0, x, y);
    this.p.ellipse(x, y, 16, 16);
    this.p.pop();
  }
}
