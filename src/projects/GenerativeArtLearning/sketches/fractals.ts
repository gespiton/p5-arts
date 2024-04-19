import p5 from "p5";

export function fractals(p: p5) {
  const canvasWidth = 800;
  const canvasHeight = 800;


  p.setup = function () {
    p.frameRate(10);
    p.createCanvas(canvasWidth, canvasHeight, p.P2D);
    p.pixelDensity(1);
    p.smooth();
    p.noLoop();
    p.mouseClicked = () => {
      if (p.isLooping()) {
        p.noLoop();
      } else {
        p.loop();
      }
    }
    p.background(0)
    setupBasic();
  };

  class Branch {
    level: number
    index: number
    position: p5.Vector
    endPosition: p5.Vector
    children: Branch[] = []

    constructor(config: {
      level: number,
      index: number,
      position: p5.Vector,
    }) {
      this.level = config.level;
      this.index = config.index;
      this.position = config.position;
      this.endPosition = p.createVector(this.position.x + 150, this.position.y + 15)
      this.updateMe(config.position.x, config.position.y)
      if (this.level < maxLevel) {
        debugger
        for (let i = 0; i < numOfChildren; i++) {
          const child = new Branch({
            level: this.level + 1,
            index: i,
            position: this.endPosition,
          })
          this.children.push(child)
        }
      }
    }

    updateMe(ex: number, why: number) {
      this.position = p.createVector(ex, why)
      const endX = ex + this.level * (p.random(100) - 50)
      const endY = why + 50 + this.level * (p.random(50))
      this.endPosition = p.createVector(endX, endY)
    }

    drawMe() {
      p.strokeWeight(maxLevel - this.level + 1)
      p.stroke(255, 255, 255)
      p.line(this.position.x, this.position.y, this.endPosition.x, this.endPosition.y)
      p.ellipse(this.position.x, this.position.y, 5, 5)
      for (const child of this.children) {
        child.drawMe()
      }
    }
  }

  const maxLevel = 4
  const numOfChildren = 3
  let trunk: Branch;


  function setupBasic() {
    trunk = new Branch({
      level: 0,
      index: 0,
      position: p.createVector(p.width / 2, 10),
    })
  }

  function drawFrame() {
    trunk.drawMe();
  }

  p.draw = function () {
    // p.orbitControl();
    drawFrame();
  };
}
