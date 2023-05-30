import p5 from 'p5';
import {
  BaseParticle,
  BaseParticleConfig,
} from '../../foundation/particleSystem/BaseParticle';
import { NoiseLoop } from '../../foundation/utils/NoiseLoop';
import { Mode } from './constant';

type ParticleConfig = BaseParticleConfig & {
  transparency: number;
  whitePaperPointLocation: p5.Vector;
};

export class Particle extends BaseParticle {
  xNoiseLoop: NoiseLoop = new NoiseLoop(this.p, 0, 0, 0);
  yNoiseLoop: NoiseLoop = new NoiseLoop(this.p, 0, 0, 0);
  radiusNoiseLoop: NoiseLoop = new NoiseLoop(this.p, 0, 0, 0);
  transparency: number;
  whitePaperPointLocation: p5.Vector;

  constructor(props: ParticleConfig) {
    super(props);
    this.transparency = props.transparency;
    this.vel = this.p.createVector(
      this.p.random(-0.3, 0.3),
      this.p.random(-0.3, 0.3)
    );

    this.resetNoise(2, 3);

    this.whitePaperPointLocation = props.whitePaperPointLocation;
  }

  resetNoise(diameter: number, offset: number) {
    const offsetMax = offset;
    const offsetMin = -offset;
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

  currentMode: Mode = Mode.DAY_TIME;
  delay: number = 0;
  changeMode(mode: Mode) {
    this.currentMode = mode;
    if (mode === Mode.WHITE_PAPER) {
      // this.resetNoise(2, 5);
      this.delay = this.p.random(
        this.p.frameCount + 50,
        this.p.frameCount + 100
      );
      this.color = this.p.color(255, 255, 255, this.transparency);
    } else if (mode === Mode.DAY_TIME) {
      this.resetNoise(2, 3);
      this.vel = this.p.createVector(0, 0);
      this.color = this.p.color(0, 0, 0, this.transparency);
    }
  }

  update() {
    const loopEvery = 60;
    const percent = (this.p.frameCount % loopEvery) / loopEvery;
    const xNoise = this.xNoiseLoop.value(percent);
    const yNoise = this.yNoiseLoop.value(percent);

    const pastDelay = this.p.frameCount > this.delay;
    if (pastDelay && this.currentMode === Mode.WHITE_PAPER) {
      const force = this.whitePaperPointLocation
        .copy()
        .sub(this.pos)
        .mult(0.0015);
      this.applyForce(force);
      const dragForce = this.vel.copy().mult(-0.1);
      this.applyForce(dragForce);
      super.update();
      this.pos = this.pos.add(xNoise, yNoise);
    } else {
      this.pos = this.origin.copy().add(xNoise, yNoise);
      this.r = this.radiusNoiseLoop.value(percent);
    }
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
  }
}
