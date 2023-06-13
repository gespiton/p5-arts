import p5 from "p5";
import imgName from "./source2.png";
import { Particle } from "./Particle";
import transparentCircle from "../../resources/transparentCircle.png";
import { Mode } from "./constant";

// const IMG_RESIZED_WIDTH = 1000;
const IMG_SCAN_STEPS = 1;

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
      this.img.resize(this.p.width, 0);

      // Collects valid positions where a particle can spawn onto.
      this.indices = [];
      if (this.img === undefined) return;
      const img = this.img;

      for (let y = 0; y < img.height; y += IMG_SCAN_STEPS * 4) {
        for (let x = 0; x < img.width; x += IMG_SCAN_STEPS * 4) {
          let index = (x + y * img.width) * 4;
          const r = img.pixels[index];
          const g = img.pixels[index + 1];
          const b = img.pixels[index + 2];
          const a = img.pixels[index + 3];
          // calculate the blackness of the pixel in index using r g b a value
          const darkness =
            1 - ((r + g + b) * this.p.map(a, 1, 255, 0, 1)) / 3 / 255;
          // if the pixel is not black enough, then skip it
          if (darkness < 0.05) continue;
          // if the pixel is black enough, then push the index into the indices array
          this.indices.push(index);
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

    // calculate the points count of the white paper
    const paperWidth = this.p.width * 0.8;
    const paperHeight = paperWidth * 0.7;
    const startPointX = this.p.width / 2 - paperWidth / 2;
    const startPointY = this.p.height / 2 - paperHeight / 2;
    const getPointLocationAtPercentage = (percentage: number) => {
      const pIndex = Math.floor(paperWidth * paperHeight * percentage);
      const x = Math.floor(pIndex % paperWidth) + startPointX;
      const y = Math.floor(pIndex / paperWidth) + startPointY;
      return this.p.createVector(x, y);
    };

    // convert step to integer
    for (let i = 0; i < this.indices.length; i += step) {
      let index = this.indices[i];

      let x = (index / 4) % this.img.width;
      let y = index / 4 / this.img.width;

      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let a = img.pixels[index + 3];
      const transparency = this.p.map(
        1 - ((r + g + b) * this.p.map(a, 1, 255, 0, 1)) / 3 / 255,
        0,
        1,
        0,
        220
      );

      const whitePaperPointLocation = getPointLocationAtPercentage(
        i / this.indices.length
      );

      const newParticle = new Particle({
        id: i / step,
        x,
        y,
        p5: this.p,
        radius: 5,
        color: this.p.color(0, 0, 0, transparency),
        transparency,
        whitePaperPointLocation,
      });
      this.particles.push(newParticle);
    }
  }

  update() {}

  show() {
    this.particles.forEach((particle) => {
      particle.update();
      particle.show();
    });
  }

  changeMode(mode: Mode) {
    this.particles.forEach((particle) => {
      particle.changeMode(mode);
    });
  }
}
