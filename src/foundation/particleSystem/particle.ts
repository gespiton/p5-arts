// Particle Systems with Image Textures (Image Texture)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/pUhv2CA0omA
// https://thecodingtrain.com/learning/nature-of-code/4.4-image-textures.html

import p5 from 'p5';
import image from './texture32.png';

// Texture Maker: https://editor.p5js.org/codingtrain/sketches/NS4rB1Yx-
// Image Texture: https://editor.p5js.org/codingtrain/sketches/TTVoNt58T
// Shader (WEBGL): https://editor.p5js.org/codingtrain/sketches/EXZmcc4m_

export class Particle {
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  r: number;
  lifetime: number;

  p: p5;
  img: p5.Image;
  constructor(x: number, y: number, p5: p5) {
    this.p = p5;
    this.pos = this.p.createVector(x, y);
    this.vel = p5.createVector(p5.random(), p5.random());
    this.vel.mult(p5.random(0.5, 2));
    this.acc = p5.createVector(0, 0);
    this.r = 64;
    this.lifetime = 255;
    this.img = p5.loadImage(image);
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

    this.lifetime -= 7;
  }

  show() {
    this.p.tint(150, 40, 80, this.lifetime);
    this.p.imageMode(this.p.CENTER);
    this.p.image(this.img, this.pos.x, this.pos.y, this.r, this.r);
    // ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
