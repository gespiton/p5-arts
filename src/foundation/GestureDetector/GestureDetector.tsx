import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRefWithUpdate } from '../../hooks/useCallbackRef';
import { HandPositionInfo, useGestureDetector } from './useGestureDetector';

const Canvas = styled.canvas`
  width: 200px;
  height: 200px;
`;

const Video = styled.video`
  width: 200px;
  height: 200px;
`;

export function GestureDetector(props:{
onHandPosUpdated: (result: HandPositionInfo)=>void
}) {
  const videoRef = useRefWithUpdate<HTMLVideoElement>();
  const canvasRef = useRefWithUpdate<HTMLCanvasElement>();
  const enableCamButtonRef = useRefWithUpdate<HTMLButtonElement>();
  const [handPosition, setHandPosition] = useState<HandPositionInfo | null>(null);
  const onResult = useCallback<(result: HandPositionInfo)=>void>((result)=>{
    setHandPosition(result);
  },[]);

  useEffect(()=>{
    if(handPosition){
      onResult(handPosition);
    }
  } ,[handPosition, onResult]);

  useGestureDetector({
    videoElement: videoRef.current!,
    canvasElement: canvasRef.current!,
    enableCameraButton: enableCamButtonRef.current!,
    height: '200',
    width: '200',
    onResults:  props.onHandPosUpdated
  });
  return (
    <div>
      <Video hidden ref={videoRef} autoPlay playsInline />
      <Canvas ref={canvasRef} />
    </div>
  );
}
