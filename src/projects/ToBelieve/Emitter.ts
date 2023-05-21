import p5 from 'p5';
import imgName from './source.png';
import { Particle } from './Particle';
import transparentCircle from '../../resources/transparentCircle.png';

const IMG_RESIZED_WIDTH = 600;
const IMG_SCAN_STEPS = 1;
const SPIN_MULTIPLIER = 45;
const MIN_PARTICLE_COUNT = 200;
const MAX_PARTICLE_COUNT = 700;
const MIN_PARTICLE_SIZE = 12;
const MAX_PARTICLE_SIZE = 50;
const MIN_FORCE = 0.4;
const MAX_FORCE = 0.6;
const REPULSION_RADIUS = 100;
const REPULSION_STRENGTH = 0.25;

export class Emitter {
  p: p5;
  img: p5.Image | undefined;
  indices: number[] = [];
  particleCount: number;
  particles: Particle[] = [];
  circleImg: p5.Image | undefined;

  constructor(p: p5, particleCount: number) {
    this.p = p;
    this.particleCount = particleCount;
    this.loadImg();
  }

  loadImg() {
    this.p.loadImage(transparentCircle, (newImg) => {
      this.circleImg = newImg;
    });
    this.p.loadImage(imgName, (newImg) => {
      this.img = newImg;
      this.img.loadPixels();
      this.img.resize(IMG_RESIZED_WIDTH, 0);

      // Collects valid positions where a particle can spawn onto.
      this.indices = [];
      if (this.img === undefined) return;
      const img = this.img;

      for (let x = 0; x < img.width; x += IMG_SCAN_STEPS * 4) {
        for (let y = 0; y < img.height; y += IMG_SCAN_STEPS * 4) {
          let index = (x + y * img.width) * 4;
          const r = img.pixels[index];
          const g = img.pixels[index + 1];
          const b = img.pixels[index + 2];
          const a = img.pixels[index + 3];
          // calculate the blakness of the pixel in index using r g b a value
          const darkness =
            1 - ((r + g + b) * this.p.map(a, 1, 255, 0, 1)) / 3 / 255;
          // if the pixel is not black enough, then skip it
          if (darkness < 0.1) continue;
          // if the pixel is black enough, then push the index into the indices array
          this.indices.push(index);

          // if (a > 20) {

          // let a = img.pixels[index + 3];
          // if (a > 20) {
          //   this.indices.push(index);
          // } else {
          //   console.log('skip', a);
          // }
        }
      }

      this.spawnParticles();
    });
  }

  spawnParticles() {
    if (this.indices.length === 0 || this.img === undefined) {
      return;
    }

    const img = this.img;
    const step = Math.max(
      Math.floor(this.indices.length / this.particleCount),
      1
    );
    // convert step to integer

    console.log(
      '🚀 ~ file: Emitter.ts:78 ~ spawnParticles ~ this.indices.length:',
      this.indices.length
    );
    for (let i = 0; i < this.indices.length; i += step) {
      let index = this.indices[i];

      let x = (index / 4) % this.img.width;
      let y = index / 4 / this.img.width;

      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let a = img.pixels[index + 3];

      const newParticle = new Particle({
        x,
        y,
        p5: this.p,
        radius: 5,
        color: this.p.color(r, g, b, a),
        // img: this.circleImg,
      });
      this.particles.push(newParticle);
    }
  }

  update() {}

  show() {
    this.particles.forEach((particle) => {
      particle.show();
    });
  }
}
