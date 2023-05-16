import p5, { Vector } from "p5";

class FlowFields {
  cols: number;
  rows: number;
  flowfield: Vector[];
  p: p5;
  progress: number ;
  constructor(p5: p5, cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.flowfield = new Array(cols * rows);
    this.p = p5;
    this.progress = 0;

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

  updateFlow(progress?: number) {
    if (progress) {
      this.progress = progress;
    }
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.flowfield[x + y * this.cols] = this.p
          .createVector(
            this.p.noise(x * 0.01, y * 0.01, this.progress * 0.01),
            this.p.noise(x * 0.01, y * 0.01, this.progress * 0.01)
          )
          .setMag(1);
      }
    }
  }
}
