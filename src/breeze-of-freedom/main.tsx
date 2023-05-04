import { createRef, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useGestureDetector } from './useGestureDetector';
import { useCallbackRef } from 'use-callback-ref';

const DemosSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const Canvas = styled.canvas`
  width: 200px;
  height: 200px;
`;

const Video = styled.video`
  width: 200px;
  height: 200px;
`;

const MainPage = () => {
  const [, forceUpdate] = useState<number>();
  const forceUpdateFn = useCallback(() => {
    forceUpdate(Math.random());
  }, [forceUpdate]);

  const videoRef = useCallbackRef<HTMLVideoElement>(null, forceUpdateFn);
  const canvasRef = useCallbackRef<HTMLCanvasElement>(null, forceUpdateFn);
  const enableCamButtonRef = useCallbackRef<HTMLButtonElement>(
    null,
    forceUpdateFn
  );
  useGestureDetector({
    videoElement: videoRef.current!,
    canvasElement: canvasRef.current!,
    enableCameraButton: enableCamButtonRef.current!,
    height: '200',
    width: '200',
  });
  return (
    <div>
      <Video ref={videoRef} autoPlay playsInline />
      <Canvas ref={canvasRef} />
      <button ref={enableCamButtonRef}>enable cam</button>
    </div>
  );
};

export default MainPage;
