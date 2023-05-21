import p5 from 'p5';

export type BaseParticleConfig = {
  x: number;
  y: number;
  p5: p5;
  initialVelocity?: p5.Vector;
  initialAcceleration?: p5.Vector;
  randomInitialVelocity?: boolean;
  randomInitialAcceleration?: boolean;
  radius?: number;
  lifetime?: number;
  color?: p5.Color;
  img?: p5.Image;
};

export class BaseParticle {
  pos: p5.Vector;
  origin: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  r: number;
  lifetime: number;
  color?: p5.Color;
  img?: p5.Image;

  p: p5;
  constructor(config: BaseParticleConfig) {
    const {
      x,
      y,
      p5,
      initialAcceleration = p5.createVector(0, 0),
      initialVelocity = p5.createVector(0, 0),
      radius = 64,
      lifetime = 255,
      color,
    } = config;
    this.p = p5;
    this.pos = this.p.createVector(x, y);
    this.origin = this.p.createVector(x, y);
    this.vel = initialVelocity;
    if (config.randomInitialVelocity) {
      this.vel = p5.createVector(p5.random(), p5.random());
    }
    this.acc = initialAcceleration;
    if (config.randomInitialAcceleration) {
      this.acc = p5.createVector(0, 0);
    }
    this.r = radius;
    this.lifetime = lifetime;
    this.color = color;
    this.img = config.img;
  }

  finished() {
    return this.lifetime < 0;
  }

  applyForce(force: p5.Vector) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.lifetime -= 10;
  }

  show() {
    if (this.img) {
      const color = this.color || this.p.color(255);
      const [r, g, b] = color
        ?.toString('r,g,b')
        .split(',')
        .map((x) => parseInt(x));
      this.p.tint(r, g, b, this.lifetime);
      this.p.imageMode(this.p.CENTER);
      this.p.image(this.img, this.pos.x, this.pos.y, this.r, this.r);
    } else {
      if (this.color) {
        this.p.fill(this.color);
      }
      this.p.ellipse(this.pos.x, this.pos.y, this.r);
    }
  }
}
