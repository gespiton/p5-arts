import p5, { Vector } from "p5";
import { PerlinNoise } from "../../../foundation/utils/PerlinNoise";
import { NoiseLoop } from "../../../foundation/utils/NoiseLoop";

const PARTICLE_COUNT = 4000;
const EDGE_DISTANCE = 10;
const ANGLE_SCALE = 5
const PARTICLE_MOVE_DISTANCE = 15;
const PARTICLE_MOVE_VARIANCE = 1;
const initialRadius = 200;



export const sphereConnected = (p: p5) => {
  class Particle {
    pos: Vector;
    edgesCount = 0;
    xMovementNoise = new NoiseLoop(
      p,
      PARTICLE_MOVE_VARIANCE,
      -PARTICLE_MOVE_DISTANCE,
      PARTICLE_MOVE_DISTANCE
    );
    yMovementNoise = new NoiseLoop(
      p,
      PARTICLE_MOVE_VARIANCE,
      -PARTICLE_MOVE_DISTANCE,
      PARTICLE_MOVE_DISTANCE
    );
    zMovementNoise = new NoiseLoop(
      p,
      PARTICLE_MOVE_VARIANCE,
      -PARTICLE_MOVE_DISTANCE,
      PARTICLE_MOVE_DISTANCE
    );
    sizeNoise = new PerlinNoise({
      p: p,
      step: 0.3,
      xOffset: p.random(10000),
      range: [0.5, 1.5]
    });
    constructor(config: {
      pos: Vector;
    }) {
      this.pos = config.pos;
    }

    getPosition() {
      return p.createVector(
        this.pos.x + this.xMovementNoise.value(p.frameCount / 300),
        this.pos.y + this.yMovementNoise.value(p.frameCount / 300),
        this.pos.z + this.zMovementNoise.value(p.frameCount / 300)
      )
    }
  }
  const canvasWidth = 800;
  const canvasHeight = 800;


  const points: Particle[] = []
  const edges: [Particle, Particle][] = []
  p.setup = function () {
    p.frameRate(30);
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    p.pixelDensity(1);
    p.smooth();
    p.background(0)
    p.keyPressed = () => {
      // save image when press s
      if (p.key === 's') {
        p.saveCanvas('p5Image', 'png');
      }
    };


    let s = 0;
    let t = 0;

    const tIncrementNoise = new PerlinNoise({
      p,
      step: 0.1,
      xOffset: p.random(1000),
      range: [-ANGLE_SCALE / 2, ANGLE_SCALE / 3]
    });
    const sIncrementNoise = new PerlinNoise({
      p,
      step: 0.1,
      xOffset: p.random(10000),
      range: [-ANGLE_SCALE, ANGLE_SCALE]
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {

      let radius = initialRadius / 3 + (initialRadius * i / PARTICLE_COUNT) / 2;
      const radianS = p.radians(s);
      const radianT = p.radians(t);
      let rawX = radius * p.sin(radianT) * p.cos(radianS);
      let rawY = radius * p.sin(radianS) * p.sin(radianT);
      let rawZ = radius * p.cos(radianT);
      const noiseMultiplier =
        ((p.noise(rawX, rawY, rawZ) * (radius / 3) + radius)) / radius
      const vector = p.createVector(rawX, rawY, rawZ).mult(noiseMultiplier);
      let x = vector.x;
      let y = vector.y;
      let z = vector.z;
      points.push(
        new Particle({
          pos: p.createVector(x, y, z)
        }
        )
      )

      s = s + sIncrementNoise.next();
      t = t + tIncrementNoise.next();
    }

    // iterate through points and draw lines between each two point
    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      for (let j = i; j < points.length; j++) {
        const nextPoint = points[j];
        const distance = p.dist(
          point.pos.x,
          point.pos.y,
          point.pos.z,
          nextPoint.pos.x,
          nextPoint.pos.y,
          nextPoint.pos.z
        );
        if (distance < EDGE_DISTANCE) {
          edges.push([point, nextPoint])
          point.edgesCount += 1;
          nextPoint.edgesCount += 1;
        }
      }
    }

    console.log('edge count', edges.length)
  }


  function frame() {
    p.rotateX(10);
    p.rotateY(13);
    points.forEach((point, i) => {
      const pos = point.getPosition();
      p.push();
      p.translate(
        pos.x,
        pos.y,
        pos.z
      );
      p.noStroke()
      p.fill(255, 230)
      p.sphere(
        p.noise(pos.x / 4, pos.y / 4, pos.z / 4)
        * (13 / point.edgesCount),
        8, 8
      )
      p.pop();
    })
    edges.forEach(([point1, point2]) => {
      const weight = p.map(p.min(point1.edgesCount, point2.edgesCount), 1, 10, 200, 100);
      p.stroke(205, weight);
      p.strokeWeight(1)
      const newPoint1Pos = point1.getPosition();
      const newPoint2Pos = point2.getPosition();
      p.line(
        newPoint1Pos.x,
        newPoint1Pos.y,
        newPoint1Pos.z,
        newPoint2Pos.x,
        newPoint2Pos.y,
        newPoint2Pos.z
      )
    })
  }

  p.draw = function () {
    p.background(0)
    p.orbitControl();
    frame();
  };
}