import p5 from 'p5';
import { P5Frame } from '../../foundation/P5Frame';
import { FlowFields } from '../../foundation/FlowFields/FlowFields';
import { Emitter } from '../../foundation/particleSystem/fire/emitter';

function distortedSpiritSketch(p: p5) {
  const col = 10;
  const row = 10;
  const canvasWidth = 800;
  const canvasHeight = 600;
  const flowFields = new FlowFields(p, col, row, 0.01);
  const emitter = new Emitter(200, 375, p);
  p.setup = function () {
    p.frameRate(30);
    p.createCanvas(canvasWidth, canvasHeight);
    p.pixelDensity(1);
  };

  p.draw = function () {
    p.clear(0, 0, 0, 0);
    p.background(0);
    p.blendMode(p.ADD);

    // draw force field
    // const rowStep = canvasHeight / row;
    // const colStep = canvasWidth / col;
    // for (let i = 0; i < row; i++) {
    //   for (let j = 0; j < col; j++) {
    //     const xStart = j * colStep + colStep / 2;
    //     const yStart = i * rowStep + rowStep / 2;
    //     const force = flowFields.getFlow(j, i);
    //     const angle = p.atan2(force.y, force.x);
    //     p.stroke(255);
    //     p.push();
    //     p.translate(xStart, yStart);
    //     p.rotate(angle);
    //     p.line(0, 0, 20, 0);
    //     p.pop();
    //   }
    // }

    // update fire
    emitter.applyForceField(flowFields);
    emitter.emit(1);
    emitter.show();
    emitter.update();

    // update flow fields
    flowFields.updateFlow();
  };
}

const MainPage = () => {
  return (
    <div>
      <P5Frame sketch={distortedSpiritSketch} />
    </div>
  );
};

export default MainPage;
