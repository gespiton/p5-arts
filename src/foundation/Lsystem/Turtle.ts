import p5 from "p5";
import { PerlinNoise } from "../utils/PerlinNoise";
import { ColorGenerator } from "../utils/colorGenerator";

export class Turtle {
  length: number;
  angle: number;
  p: p5;
  angleNoise: PerlinNoise
  constructor(p: p5, length: number, angle: number) {
    this.length = length;
    this.angle = angle;
    this.p = p;
    this.angleNoise = new PerlinNoise(
      {
        p: p,
        step: 0.01,
        xOffset: 0,
        range: [0, 2 * angle]
      }
    );
  }

  render(sentence: string) {
    const colorSystem = new ColorGenerator({
      a: this.p.createVector(0.5, 0.5, 0.5),
      b: this.p.createVector(0.5, 0.5, 0.5),
      c: this.p.createVector(1, 1, 1),
      d: this.p.createVector(0, this.p.random(0.5), 0.2),
      totalStep: sentence.length,
      p: this.p
    })
    for (let i = 0; i < sentence.length; i++) {
      const color = colorSystem.next();
      // console.log("🚀 ~ Turtle ~ render ~ color:", color)

      this.p.stroke(color.x, color.y, color.z, 200);
      let c = sentence.charAt(i);
      this.renderChar(c);
    }
  }

  renderChar(c: string, draw: boolean = true) {
    if (c === "F" || c === "G") {
      if (draw) {
        this.p.line(0, 0, 0, -this.length);
      }
      this.p.translate(0, -this.length);
    } else if (c === "+") {
      this.p.rotate(this.angleNoise.next());
    } else if (c === "-") {
      this.p.rotate(-this.angleNoise.next());
    } else if (c === "[") {
      this.p.push();
    } else if (c === "]") {
      this.p.pop();
    }
  }

  renderStepByStep(sentence: string, step: number) {
    const c = sentence.charAt(step);
    this.renderChar(c);
  }

  renderToStep(sentence: string, step: number) {
    for (let i = 0; i < step; i++) {
      const c = sentence.charAt(i);
      this.renderChar(c, i === step - 1);
    }
  }
}