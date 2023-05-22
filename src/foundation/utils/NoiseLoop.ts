import p5 from 'p5';

export class NoiseLoop {
  diameter: number;
  min: number;
  max: number;
  cx: number;
  cy: number;
  p: p5;

  constructor(p: p5, diameter: number, min: number, max: number) {
    this.p = p;
    this.diameter = diameter;
    this.min = min;
    this.max = max;
    this.cx = p.random(1000);
    this.cy = p.random(1000);
  }

  value(percent: number) {
    const angle = percent * this.p.TWO_PI;
    const xoff = this.p.map(
      this.p.cos(angle),
      -1,
      1,
      this.cx,
      this.cx + this.diameter
    );
    const yoff = this.p.map(
      this.p.sin(angle),
      -1,
      1,
      this.cy,
      this.cy + this.diameter
    );
    let r = this.p.noise(xoff, yoff);
    return this.p.map(r, 0, 1, this.min, this.max);
  }
}
