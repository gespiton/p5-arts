// https://www.skytopia.com/project/fractal/2mandelbulb.html
// https://www.youtube.com/watch?v=NJCiUVGiNyA 

import p5 from "p5";


class PolarVector {
  r: number;
  theta: number;
  phi: number;
  constructor(r: number, theta: number, phi: number,) {
    this.r = r;
    this.theta = theta;
    this.phi = phi;
  }

  add(v: PolarVector) {
    this.r = this.r + v.r;
    this.theta = this.theta + v.theta;
    this.phi = this.phi + v.phi;
  }


  static fromCartesian(x: number, y: number, z: number, p: p5) {
    const r = p.sqrt(x * x + y * y + z * z);
    const theta = p.atan2(p.sqrt(x * x + y * y), z);
    const phi = p.atan2(y, x);
    return new PolarVector(r, theta, phi,);
  }
}

export function mandelbulb(p: p5) {
  const canvasWidth = 800;
  const canvasHeight = 800;


  p.setup = function () {
    p.frameRate(60);
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    p.pixelDensity(1);
    p.smooth();
    // p.noLoop();
    p.mouseClicked = () => {
      // if (p.isLooping()) {
      //   p.noLoop();
      // } else {
      //   p.loop();
      // }
    }
    p.background(0)
    setupBasic();
  };

  const DIM = 64;
  const orderOfMandelbulb = 8
  const mandelbulbPoints: p5.Vector[] = []
  function setupBasic() {
    for (let x = 0; x < DIM; x++) {
      for (let y = 0; y < DIM; y++) {
        let edge = false
        for (let z = 0; z < DIM; z++) {
          let nx = p.map(x, 0, DIM, -1, 1);
          let ny = p.map(y, 0, DIM, -1, 1);
          let nz = p.map(z, 0, DIM, -1, 1);



          let ite = 0;
          let maxIterations = 8;

          let zeta = p.createVector(0, 0, 0);
          while (ite < maxIterations) {
            let sphericalZ = PolarVector.fromCartesian(zeta.x, zeta.y, zeta.z, p);

            const newX = p.pow(sphericalZ.r, orderOfMandelbulb) * p.sin(orderOfMandelbulb * sphericalZ.theta) * p.cos(orderOfMandelbulb * sphericalZ.phi);
            const newY = p.pow(sphericalZ.r, orderOfMandelbulb) * p.sin(orderOfMandelbulb * sphericalZ.theta) * p.sin(orderOfMandelbulb * sphericalZ.phi);
            const newZ = p.pow(sphericalZ.r, orderOfMandelbulb) * p.cos(orderOfMandelbulb * sphericalZ.theta);

            zeta = p.createVector(newX + nx, newY + ny, newZ + nz);

            const r = (zeta.x * zeta.x + zeta.y * zeta.y + zeta.z * zeta.z);
            if (r > 2) {
              edge = false
              break;
            }
            ite++;
          }
          if (ite === maxIterations) {
            if (!edge) {
              edge = true
              mandelbulbPoints.push(p.createVector(x, y, z));
            }
          }
        }
      }
    }
  }

  function drawFrame() {
    console.log(mandelbulbPoints.length)
    for (let i = 0; i < mandelbulbPoints.length; i++) {
      const c = mandelbulbPoints[i];
      const x = p.map(c.x, 0, DIM, -DIM, DIM) * 3;
      const y = p.map(c.y, 0, DIM, -DIM, DIM) * 3;
      const z = p.map(c.z, 0, DIM, -DIM, DIM) * 3;

      p.push();
      p.translate(x, y, z);
      p.fill(255);
      p.stroke(255);
      p.sphere(0.5, 4, 4);
      p.pop();
    }
  }

  p.draw = function () {
    p.background(0);
    p.orbitControl();
    drawFrame();
  };

}
