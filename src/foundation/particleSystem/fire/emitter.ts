// Particle Systems with Image Textures (Image Texture)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/pUhv2CA0omA
// https://thecodingtrain.com/learning/nature-of-code/4.4-image-textures.html

import p5 from 'p5';
import { Particle } from './particle';
import { FlowFields } from '../../FlowFields/FlowFields';

// Texture Maker: https://editor.p5js.org/codingtrain/sketches/NS4rB1Yx-
// Image Texture: https://editor.p5js.org/codingtrain/sketches/TTVoNt58T
// Shader (WEBGL): https://editor.p5js.org/codingtrain/sketches/EXZmcc4m_

export class Emitter {
  position: p5.Vector;
  particles: Particle[];
  p: p5;
  constructor(x: number, y: number, p: p5) {
    this.position = new p5.Vector(x, y);
    this.particles = [];
    this.p = p;
  }

  emit(num: number) {
    for (let i = 0; i < num; i++) {
      this.particles.push(
        new Particle(this.position.x, this.position.y, this.p)
      );
    }
  }

  applyForce(force: p5.Vector) {
    for (let particle of this.particles) {
      particle.applyForce(force);
    }
  }

  applyForceField(flowFields: FlowFields) {
    for (let particle of this.particles) {
      const { x, y } = particle.pos;
      // let force = forces[x + y * cols]
      const force = flowFields.getFlowAtPixel(x, y)?.setMag(1);
      if (force) {
        particle.applyForce(force);
      }
    }

    // move center
    const force = flowFields
      .getFlowAtPixel(this.position.x, this.position.y)
      ?.setMag(10);
    if (force) {
      this.position.add(force);
    }
  }

  checkEdge() {
    if (this.position.x < 0) {
      this.position.x = this.p.width;
    }
    if (this.position.x > this.p.width) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = this.p.height;
    }
    if (this.position.y > this.p.height) {
      this.position.y = 0;
    }
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].finished()) {
        this.particles.splice(i, 1);
      }
    }
    this.checkEdge();
  }

  show() {
    for (let particle of this.particles) {
      particle.show();
    }
  }
}
