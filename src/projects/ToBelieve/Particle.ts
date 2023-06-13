import p5 from "p5";
import {
  BaseParticle,
  BaseParticleConfig,
} from "../../foundation/particleSystem/BaseParticle";
import { NoiseLoop } from "../../foundation/utils/NoiseLoop";
import {
  DAY_TO_NIGHT_TRANSITION_DELAY,
  DAY_TO_NIGHT_TRANSITION_DURATION,
  Mode,
  PARTICLE_COUNT,
} from "./constant";

type ParticleConfig = BaseParticleConfig & {
  transparency: number;
  whitePaperPointLocation: p5.Vector;
  id: number;
};

export class Particle extends BaseParticle {
  xNoiseLoop: NoiseLoop = new NoiseLoop(this.p, 0, 0, 0);
  yNoiseLoop: NoiseLoop = new NoiseLoop(this.p, 0, 0, 0);
  radiusNoiseLoop: NoiseLoop = new NoiseLoop(this.p, 0, 0, 0);
  transparency: number;
  whitePaperPointLocation: p5.Vector;
  id: number;

  constructor(props: ParticleConfig) {
    super(props);
    this.transparency = props.transparency;
    this.vel = this.p.createVector(
      this.p.random(-0.3, 0.3),
      this.p.random(-0.3, 0.3)
    );

    this.resetNoise(2, 3);

    this.whitePaperPointLocation = props.whitePaperPointLocation;
    this.id = props.id;
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
  delayUntilFrame: number = 0;
  transitionUntilFrame: number = 0;
  reachingDestination = true;
  changeMode(mode: Mode) {
    this.currentMode = mode;
    if (mode === Mode.WHITE_PAPER) {
      this.transitionUntilFrame =
        this.p.frameCount + DAY_TO_NIGHT_TRANSITION_DURATION;
      // this.resetNoise(2, 5);
      const baseDelay =
        this.p.map(
          this.id,
          0,
          PARTICLE_COUNT,
          0,
          DAY_TO_NIGHT_TRANSITION_DELAY
        ) + this.p.random(0, 20);
      this.delayUntilFrame = this.p.frameCount + baseDelay;
      this.color = this.p.color(255, 255, 255, this.transparency);
      const forceToDestination = this.whitePaperPointLocation
        .copy()
        .sub(this.pos);
      // calculate a velocity perpendicular to the forceToDestination
      this.vel = this.p
        .createVector(forceToDestination.y, -forceToDestination.x)
        .mult(0.2);
    } else if (mode === Mode.DAY_TIME) {
      const baseDelay = this.p.map(this.id, 0, PARTICLE_COUNT, 0, 200);
      this.delayUntilFrame = this.p.frameCount + baseDelay;
      this.reachingDestination = false;
      this.resetNoise(2, 3);
      this.vel = this.p.createVector(0, 0);
      this.color = this.p.color(0, 0, 0, this.transparency);
      this.transitionUntilFrame = this.p.frameCount + 300;
    }
  }

  update() {
    const loopEvery = 60;
    const percent = (this.p.frameCount % loopEvery) / loopEvery;
    const xNoise = this.xNoiseLoop.value(percent);
    const yNoise = this.yNoiseLoop.value(percent);

    const pastDelay = this.p.frameCount > this.delayUntilFrame;
    const inTransition = this.p.frameCount < this.transitionUntilFrame;
    if (inTransition && this.currentMode === Mode.WHITE_PAPER) {
      if (pastDelay) {
        const forceMultiplier = this.p.random(0.004, 0.04);
        const force = this.whitePaperPointLocation
          .copy()
          .sub(this.pos)
          .mult(forceMultiplier);
        this.applyForce(force);
        const dragForce = this.vel.copy().mult(-0.05);
        this.applyForce(dragForce);
        super.update();
        this.pos = this.pos.add(xNoise, yNoise);
        this.r = this.radiusNoiseLoop.value(percent);
      }
    } else if (
      inTransition &&
      this.currentMode === Mode.DAY_TIME &&
      !this.reachingDestination
    ) {
      const force = this.origin.copy().sub(this.pos).mult(0.35);
      this.applyForce(force);
      const dragForce = this.vel.copy().mult(-0.5);
      this.applyForce(dragForce);
      super.update();
      // this.pos = this.pos.add(xNoise, yNoise);
      // this.r = this.radiusNoiseLoop.value(percent);
      const currentSpeed = this.vel.mag();
      if (currentSpeed < 0.1) {
        this.reachingDestination = true;
      }
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

  moveToDestination() {}
}
