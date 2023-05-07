import p5 from 'p5';
import { IGenerator } from './IGenerator';

export class PerlinNoise implements IGenerator<number> {
  step: number;
  xOffset: number;
  yOffset: number | undefined;
  zOffset: number | undefined;
  p: p5;
  range: [number, number] = [0, 1];

  static singleton: PerlinNoise | undefined;

  static getInstance(props: {
    p: p5;
    step: number;
    xOffset: number;
    yOffset?: number;
    zOffset?: number;
    range?: [number, number];
  }) {
    if (!this.singleton) {
      this.singleton = new PerlinNoise(props);
    }
    return this.singleton;
  }

  constructor(props: {
    p: p5;
    step: number;
    xOffset: number;
    yOffset?: number;
    zOffset?: number;
    range?: [number, number];
  }) {
    const { step, xOffset, yOffset, zOffset, p, range } = props;
    this.step = step;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.zOffset = zOffset;
    this.p = p;
    if (range) {
      this.range = range;
    }
  }
  next() {
    const res = this.p.noise(this.xOffset, this.yOffset, this.zOffset);
    this.xOffset += this.step;
    if (this.yOffset) {
      this.yOffset += this.step;
    }
    if (this.zOffset) {
      this.zOffset += this.step;
    }
    return this.p.map(res, 0, 1, this.range[0], this.range[1]);
  }
}
