import { IGenerator } from "./IGenerator";
import p5 from "p5";

export class ColorGenerator implements IGenerator<p5.Vector> {
  a: p5.Vector;
  b: p5.Vector;
  c: p5.Vector;
  d: p5.Vector;
  totalStep: number;
  currentStep: number = 0;
  p: p5
  constructor(
    config: {
      /**
       * The total number of steps the generator will take to fulfill a cycle
       */
      totalStep: number,
      a: p5.Vector,
      b: p5.Vector,
      c: p5.Vector,
      d: p5.Vector,
      p: p5
    }
  ) {
    this.totalStep = config.totalStep;
    this.a = config.a;
    this.b = config.b;
    this.c = config.c;
    this.d = config.d;
    this.p = config.p;
  }

  next() {
    ++this.currentStep;
    const newA = this.a.copy();
    const newB = this.b.copy();
    const newC = this.c.copy();
    const newD = this.d.copy();
    const t = newC.mult((this.currentStep / this.totalStep)).add(newD).mult(6.28318);
    return this.p.createVector(Math.cos(t.x), Math.cos(t.y), Math.cos(t.z)).mult(newB).add(newA);
  }
}


// // cosine based palette, 4 vec3 params
// vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
// {
//     return a + b*cos( 6.28318*(c*t+d) );
// }
