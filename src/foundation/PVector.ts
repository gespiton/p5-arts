export class PVector {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: PVector) {
    this.x += v.x;
    this.y += v.y;
  }
}
