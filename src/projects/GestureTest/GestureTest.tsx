import { useCallback, useMemo, useRef } from "react";
import { GestureDetector } from "../../foundation/GestureDetector/GestureDetector";
import { HandPositionInfo } from "../../foundation/GestureDetector/useGestureDetector";
import { createGestureDetectorDemoSketch } from "./sketch";
import { P5Frame } from "../../foundation/P5Frame";
export function GestureTest(){
  const handPositionRef = useRef<HandPositionInfo | null>(null);
  const onHandPosUpdated = useCallback((result: HandPositionInfo)=>{
    handPositionRef.current = result;
  } ,[handPositionRef]);
  const sketch = useMemo(()=> createGestureDetectorDemoSketch(handPositionRef),[handPositionRef]);
  return <div>
    <GestureDetector onHandPosUpdated={onHandPosUpdated}/>
    <P5Frame sketch={sketch}/>
  </div>
}