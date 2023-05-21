import {
  BaseParticle,
  BaseParticleConfig,
} from '../../foundation/particleSystem/BaseParticle';
import p5 from 'p5';

export class Particle extends BaseParticle {
  constructor(props: BaseParticleConfig) {
    super(props);
    this.vel = this.p.createVector(
      this.p.random(-0.3, 0.3),
      this.p.random(-0.3, 0.3)
    );
  }

  update() {
    const force = this.origin
      .copy()
      .sub(this.pos)
      .mult(this.p.random(0.01, 0.05));
    // subtract this.pos from this.origin and create new var called force

    // console.log("🚀 ~ file: Particle.ts:14 ~ Particle ~ update ~ this.pos:", this.pos)
    // console.log("🚀 ~ file: Particle.ts:14 ~ Particle ~ update ~ this.origin:", this.origin)
    this.applyForce(force);
    super.update();
    this.lifetime -= 2;
  }
}
