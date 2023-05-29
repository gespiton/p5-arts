import {
  BaseParticle,
  BaseParticleConfig,
} from '../../foundation/particleSystem/BaseParticle';
import { NoiseLoop } from '../../foundation/utils/NoiseLoop';
import { Mode } from './constant';

type ParticleConfig = BaseParticleConfig & {
  transparency: number;
};

export class Particle extends BaseParticle {
  xNoiseLoop: NoiseLoop;
  yNoiseLoop: NoiseLoop;
  radiusNoiseLoop: NoiseLoop;
  transparency: number;
  constructor(props: ParticleConfig) {
    super(props);
    this.transparency = props.transparency;
    this.vel = this.p.createVector(
      this.p.random(-0.3, 0.3),
      this.p.random(-0.3, 0.3)
    );

    const diameter = 2;
    const offsetMax = 3;
    const offsetMin = -3;
    this.xNoiseLoop = new NoiseLoop(
      this.p,
      this.p.random(diameter),
      offsetMin,
      offsetMax
    );
    this.yNoiseLoop = new NoiseLoop(
      this.p,
      this.p.random(diameter),
      offsetMin,
      offsetMax
    );

    this.radiusNoiseLoop = new NoiseLoop(
      this.p,
      this.p.random(diameter),
      3,
      10
    );
  }

  changeMode(mode: Mode) {
    if (mode === Mode.WHITE_PAPER) {
      this.color = this.p.color(255, 255, 255, this.transparency);
    } else if (mode === Mode.DAY_TIME) {
      this.color = this.p.color(0, 0, 0, this.transparency);
    }
  }

  update() {
    // const force = this.origin
    //   .copy()
    //   .sub(this.pos)
    //   .mult(this.p.random(0.01, 0.05));
    // // subtract this.pos from this.origin and create new var called force

    // // console.log("🚀 ~ file: Particle.ts:14 ~ Particle ~ update ~ this.pos:", this.pos)
    // // console.log("🚀 ~ file: Particle.ts:14 ~ Particle ~ update ~ this.origin:", this.origin)
    // this.applyForce(force);
    // super.update();
    // this.lifetime -= 2;
    const loopEvery = 60;
    const percent = (this.p.frameCount % loopEvery) / loopEvery;
    const xNoise = this.xNoiseLoop.value(percent);
    const yNoise = this.yNoiseLoop.value(percent);
    this.pos = this.origin.copy().add(xNoise, yNoise);
    this.r = this.radiusNoiseLoop.value(percent);
  }
}
