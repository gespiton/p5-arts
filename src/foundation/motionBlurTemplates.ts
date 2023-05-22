import p5 from 'p5';
let result: number[] = [];
let t: number = 0,
  c: number;

export function createMotionBlurDrawFunction(p: p5, drawSketch: () => void) {
  // function c01(x: number): number {
  //   return constrain(x, 0, 1);
  // }

  // function ease(p: number): number {
  //   return 3 * p * p - 2 * p * p * p;
  // }

  // function ease(p: number, g: number): number {
  //   if (p < 0.5) return 0.5 * Math.pow(2 * p, g);
  //   else return 1 - 0.5 * Math.pow(2 * (1 - p), g);
  // }

  const draw_ = (): void => {
    drawSketch();
  };

  function map(
    x: number,
    a: number,
    b: number,
    c: number,
    d: number,
    constr: boolean
  ): number {
    return constr
      ? p.constrain(p.map(x, a, b, c, d), Math.min(c, d), Math.max(c, d))
      : p.map(x, a, b, c, d);
  }

  function softplus(q: number, p: number): number {
    const qq = q + p;
    if (qq <= 0) {
      return 0;
    }
    if (qq >= 2 * p) {
      return qq - p;
    }
    return (1 / (4 * p)) * qq * qq;
  }

  const mn = 0.5 * Math.sqrt(3);
  const ia = Math.atan(Math.sqrt(0.5));

  function push(): void {
    // p.pushMatrix();
    // p.pushStyle();
    p.push();
  }

  function pop(): void {
    p.pop();
  }

  function draw(): void {
    let samplesPerFrame = 5;
    let numFrames = 80;
    let shutterAngle = 0.5;

    // p.loadPixels();
    for (let i = 0; i < p.width * p.height * 4; i++) {
      result[i] = 0;
    }

    c = 0;
    for (let sa = 0; sa < samplesPerFrame; sa++) {
      t = p.map(
        p.frameCount - 1 + (sa * shutterAngle) / samplesPerFrame,
        0,
        numFrames,
        0,
        1
      );
      t %= 1;
      draw_();
      p.loadPixels();
      const pixels = p.pixels;
      for (let i = 0; i < pixels.length; i++) {
        result[i] += pixels[i];
      }
    }

    p.loadPixels();
    for (let i = 0; i < p.pixels.length; i++) {
      p.pixels[i] = result[i] / samplesPerFrame;
    }
    p.updatePixels();

    // if (p.frameCount === numFrames) {
    //   // stop p5js from looping
    //   p.noLoop();
    // }
  }

  return draw;
}
