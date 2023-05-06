import styled from 'styled-components';
import { useRefWithUpdate } from '../hooks/useCallbackRef';
import { useGestureDetector } from './useGestureDetector';

const Canvas = styled.canvas`
  width: 200px;
  height: 200px;
`;

const Video = styled.video`
  width: 200px;
  height: 200px;
`;

export function GestureDetector() {
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
      <button ref={enableCamButtonRef}>enable cam</button>
    </div>
  );
}
