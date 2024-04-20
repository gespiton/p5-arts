import p5 from "p5";
import { CollatzConjectureNode, CollatzConjectureTree } from "../../../foundation/CollatzConjectureTree";

export function collatzConjecture(p: p5) {
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

  let root: CollatzConjectureNode
  const numberDrawnCount = new Map<number, number>()

  function setupBasic() {
    root = CollatzConjectureTree.createTree(10000)
    const startPos = p.createVector(50, p.height - 20)
    root.position = startPos
  }

  function renderNode(node: CollatzConjectureNode, level: number = 0) {
    console.log(node.value)
    numberDrawnCount.set(node.value, (numberDrawnCount.get(node.value) ?? 0) + 1)
    if (level > 71) return
    if (node) {
      p.push()
      p.noStroke()
      p.fill(255, 255, 255, 10)
      p.stroke(255, 255, 255, 90)
      p.line(0, 0, 0, -10)
      if (node.left) {
        const timesDrawn = numberDrawnCount.get(node.left.value) ?? 0
        p.rotate(-p.radians(4 + timesDrawn / 5))
        p.translate(0, -10)
        // node.left.position = p.createVector(node.position.x - 1 + timesDrawn / 10, node.position.y - yMovement)
        renderNode(node.left, level + 1)
      }
      if (node.right) {
        const timesDrawn = numberDrawnCount.get(node.right.value) ?? 0
        p.rotate(p.radians(7 + timesDrawn / 0.9))
        p.translate(0, -10)
        // node.right.position = p.createVector(node.position.x + xMovement + timesDrawn / 10, node.position.y - yMovement)
        renderNode(node.right, level + 1)
      }
      p.pop()
    }
  }

  function drawFrame() {
    p.translate(260, p.height)
    renderNode(root)
  }

  p.draw = function () {
    p.background(0)
    drawFrame();
  };

}

// import p5 from "p5";
// import { CollatzConjectureNode, CollatzConjectureTree } from "../../../foundation/CollatzConjectureTree";

// export function collatzConjecture(p: p5) {
//   const canvasWidth = 800;
//   const canvasHeight = 800;


//   p.setup = function () {
//     p.frameRate(10);
//     p.createCanvas(canvasWidth, canvasHeight, p.P2D);
//     p.pixelDensity(1);
//     p.smooth();
//     p.noLoop();
//     p.mouseClicked = () => {
//       if (p.isLooping()) {
//         p.noLoop();
//       } else {
//         p.loop();
//       }
//     }
//     p.background(0)
//     setupBasic();
//   };

//   let root: CollatzConjectureNode
//   const numberDrawnCount = new Map<number, number>()

//   function setupBasic() {
//     root = CollatzConjectureTree.createTree(10000)
//     const startPos = p.createVector(50, p.height - 20)
//     root.position = startPos
//   }

//   const levelLimit = 71
//   function renderNode(node: CollatzConjectureNode, level: number = 0, hue: number = 0) {
//     console.log("🚀 ~ renderNode ~ hue:", hue)
//     hue = hue % 360
//     if (hue < 0) hue += 360
//     numberDrawnCount.set(node.value, (numberDrawnCount.get(node.value) ?? 0) + 1)
//     if (level > levelLimit) return
//     if (node) {
//       p.push()
//       p.noStroke()
//       p.colorMode(p.HSB)
//       // p.fill(3, 150, 200, 10)
//       // @ts-ignore
//       // p.setLineDash([20, 20])
//       p.strokeWeight(20)
//       p.stroke(hue, 50, 100, 0.1)
//       // p.linewidth = 3
//       p.line(0, 0, 0, -10)
//       if (node.left) {
//         // even number
//         const timesDrawn = numberDrawnCount.get(node.left.value) ?? 0
//         p.rotate(-p.radians(4 + timesDrawn / 5))
//         p.translate(0, -10)
//         // node.left.position = p.createVector(node.position.x - 1 + timesDrawn / 10, node.position.y - yMovement)
//         renderNode(node.left, level + 1, hue + 360 / levelLimit)
//       }
//       if (node.right) {
//         // odd number
//         const timesDrawn = numberDrawnCount.get(node.right.value) ?? 0
//         p.rotate(p.radians(7 + timesDrawn / 0.6))
//         p.translate(0, -10)
//         // node.right.position = p.createVector(node.position.x + xMovement + timesDrawn / 10, node.position.y - yMovement)
//         renderNode(node.right, level + 1, hue - 1)
//       }
//       p.pop()
//     }
//   }

//   function drawFrame() {
//     p.translate(260, p.height)
//     renderNode(root)
//   }

//   p.draw = function () {
//     p.background(0)
//     drawFrame();
//   };

// }
