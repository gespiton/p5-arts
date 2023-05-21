import p5, { Vector } from 'p5';

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

  getFlowAtPixel(x: number, y: number): Vector | undefined {
    const col = this.p.constrain(
      Math.floor(x / (this.p.width / this.cols)),
      0,
      this.cols - 1
    );
    const row = this.p.constrain(
      Math.floor(y / (this.p.height / this.rows)),
      0,
      this.rows - 1
    );
    return this.getFlow(col, row);
  }

  updateFlow() {
    this.progress += this.step;
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const noise = this.p.map(
          this.p.noise(x, y, this.progress),
          0,
          1,
          0,
          this.p.TWO_PI
        );
        this.flowfield[x + y * this.cols] = this.p.createVector(
          this.p.cos(this.p.TWO_PI * noise),
          this.p.sin(this.p.TWO_PI * noise)
        );
      }
    }
  }
}
