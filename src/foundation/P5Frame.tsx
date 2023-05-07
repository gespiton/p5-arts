import { useEffect } from 'react';
import { useRefWithUpdate } from '../hooks/useCallbackRef';
import p5 from 'p5';

function P5Frame(props: { sketch: (p: p5) => void }) {
  const canvasRef = useRefWithUpdate<HTMLDivElement>();
  const canvasNode = canvasRef.current;
  const { sketch } = props;
  useEffect(() => {
    let pInstance: p5;
    if (canvasNode) {
      pInstance = new p5(sketch, canvasNode);
    }
    return () => {
      pInstance?.remove();
    };
  }, [canvasNode, sketch]);
  return <div ref={canvasRef} />;
}

export { P5Frame };
