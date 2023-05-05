import { createRef, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useGestureDetector } from './useGestureDetector';
import { useRefWithUpdate } from '../hooks/useCallbackRef';
import { Painting } from '../foundation/P5Frame';

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
  const videoRef = useRefWithUpdate<HTMLVideoElement>();
  const canvasRef = useRefWithUpdate<HTMLCanvasElement>();
  const enableCamButtonRef = useRefWithUpdate<HTMLButtonElement>();
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
      <Painting />
      <button ref={enableCamButtonRef}>enable cam</button>
    </div>
  );
};

export default MainPage;
