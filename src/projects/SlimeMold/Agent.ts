import p5 from "p5";

const agentsNum = 1000;
const sensorOffset = 10;
const sensorAngle = Math.PI / 7;
const turnAngle = Math.PI / 5;

export class Agent {
  p: p5;
  x: number;
  y: number;
  dir: number;
  constructor(p: p5) {
    this.p = p;
    this.x = p.width / 2;
    this.y = p.height / 2;
    this.dir = p.random(p.TWO_PI);
  }

  updateDirection() {
    const right = this.sense(+sensorAngle);
    const center = this.sense(0);
    const left = this.sense(-sensorAngle);

    const threeWays = [left, center - 1, right];
    const minIndex = threeWays.indexOf(Math.min(left, center - 1, right));
    this.dir += turnAngle * (minIndex - 1);
  }

  sense(dirOffset: number) {
    const angle = this.dir + dirOffset;
    let x = this.p.floor(this.x + sensorOffset * this.p.cos(angle));
    let y = this.p.floor(this.y + sensorOffset * this.p.sin(angle));
    x = (x + this.p.width) % this.p.width;
    y = (y + this.p.height) % this.p.height;

    const index = (x + y * this.p.width) * 4;
    return this.p.pixels[index];
  }

  updatePosition() {
    this.x += this.p.cos(this.dir);
    this.y += this.p.sin(this.dir);
    this.x = (this.x + this.p.width) % this.p.width;
    this.y = (this.y + this.p.height) % this.p.height;

    const index =
      (this.p.floor(this.x) + this.p.floor(this.y) * this.p.width) * 4;
    this.p.pixels[index] = 0;
    this.p.pixels[index + 1] = 0;
    this.p.pixels[index + 2] = 0;
    this.p.pixels[index + 3] = 255;
  }
}

export class Agents {
  agents: Agent[];
  constructor(p5: p5) {
    this.agents = Array(agentsNum)
      .fill(0)
      .map((_) => new Agent(p5));
  }
  update() {
    this.agents.forEach((e) => e.updateDirection());
    this.agents.forEach((e) => e.updatePosition());
  }
}
