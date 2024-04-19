import { useEffect } from 'react';
import { useRefWithUpdate } from './hooks/useCallbackRef';
import p5 from 'p5';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
`;

function P5Frame(props: { sketch: (p: p5) => void; autofit?: boolean }) {
  const canvasContainerRef = useRefWithUpdate<HTMLDivElement>();
  const canvasContainerNode = canvasContainerRef.current;
  const { sketch, autofit = true } = props;
  useEffect(() => {
    let pInstance: p5;
    if (canvasContainerNode) {
      pInstance = new p5(sketch, canvasContainerNode);
      setTimeout(() => {
        const canvas = canvasContainerNode.querySelector('canvas');
        if (canvas && autofit) {
          const scaleFactor = canvasContainerNode.clientWidth / canvas.width;
          canvas.style.transform = `scale(${scaleFactor})`;
          canvas.style.transformOrigin = '0 0';
          canvasContainerNode.style.height = `${canvas.height * scaleFactor}px`;
        }
      }, 1000);

      const originalKeyPressed = pInstance.keyPressed;
      pInstance.keyPressed = (event: KeyboardEvent) => {
        // save image when press s
        originalKeyPressed?.(event);
        if (event.key === 's') {
          pInstance.saveCanvas('p5Image', 'png');
          return;
        }
      };
    }
    return () => {
      console.log('remove p5 instance');
      pInstance?.remove();
    };
  }, [canvasContainerNode, sketch, autofit]);
  return <Container ref={canvasContainerRef} />;
}

export { P5Frame };
