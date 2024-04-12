import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRefWithUpdate } from '../hooks/useCallbackRef';
import { GestureDetectorCore, HandPositionInfo } from './GestureDetectorCore';

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

  const videoElement = videoRef.current;
  const canvasElement = canvasRef.current;

  useMemo(()=>{
    console.log('i run once')
  },[])

  useMemo(() => {
    if(!videoElement || !canvasElement ){
      console.log('Not all elements are ready')
      return null;
    }
    console.log('creating gesture detector')
    return GestureDetectorCore.getInstance({
      canvasElement,
      videoElement,
      height: '200px',
      width: '200px',
      onResults: props.onHandPosUpdated
    })}, [
      videoElement,
      canvasElement,
      props.onHandPosUpdated
    ])
  return (
    <div>
      <Video hidden ref={videoRef} autoPlay playsInline />
      <Canvas ref={canvasRef} />
    </div>
  );
}
