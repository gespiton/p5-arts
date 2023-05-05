import React, { useEffect } from 'react';
import { useRefWithUpdate } from '../hooks/useCallbackRef';
import styled from 'styled-components';
import p5 from 'p5';
import { Oscillator } from './Oscillator';

const Canvas = styled.canvas`
  width: 200px;
  height: 200px;
`;

const s = (p: p5) => {
  let o: Oscillator | null = null;
  p.setup = function () {
    p.createCanvas(200, 200);
    o = new Oscillator(p, 200, 200);
  };

  p.draw = function () {
    p.background(255);
    o?.oscillate();
    o?.display();
  };
};

function P5Frame() {
  const canvasRef = useRefWithUpdate<HTMLDivElement>();
  const canvasNode = canvasRef.current;
  useEffect(() => {
    if (canvasNode) {
      console.log(
        '🚀 ~ file: Painting.tsx:31 ~ useEffect ~ canvasNode:',
        canvasNode
      );
      new p5(s, canvasNode);
    }
  }, [canvasNode]);
  return <div ref={canvasRef} />;
}

export { P5Frame as Painting };
