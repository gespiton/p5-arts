import p5, { Vector } from "p5";

export class FlowFields {
  cols: number;
  rows: number;
  flowfield: Vector[];
  p: p5;
  progress: number;
  step: number;
  constructor(p5: p5, cols: number, rows: number, step: number) {
    this.cols = cols;
    this.rows = rows;
    this.flowfield = new Array(cols * rows);
    this.p = p5;
    this.progress = 0;
    this.step = step;

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.flowfield[x + y * this.cols] = p5
          .createVector(p5.random(), p5.random())
          .setMag(1);
      }
    }
  }

  getFlow(cols: number, row: number): Vector {
    return this.flowfield[cols + row * this.cols];
  }

  updateFlow() {
    this.progress += this.step;
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const noise = this.p.noise(x, y, this.progress);
        this.flowfield[x + y * this.cols] = this.p.createVector(
          this.p.cos(this.p.TWO_PI * noise),
          this.p.sin(this.p.TWO_PI * noise)
        );
      }
    }
  }
}
