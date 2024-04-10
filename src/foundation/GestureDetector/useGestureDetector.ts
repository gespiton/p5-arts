import { DrawingUtils, FilesetResolver, HandLandmarkerResult, GestureRecognizer, NormalizedLandmark, Category, } from '@mediapipe/tasks-vision';
import { useCallback, useEffect, useRef } from 'react';

const runningMode = 'VIDEO';

const createHandLandMarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
  );
  const handLandMarker = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
      delegate: "GPU"
    },
    runningMode: runningMode,
    numHands: 2,
  });
  return handLandMarker;
};

export type HandPositionInfo = {
  fingerPosition: (NormalizedLandmark[] | null)[],
  handedness: Category[][]
}

function transformHandPositionInfo(result: HandLandmarkerResult): HandPositionInfo {
  const hand1 = result.landmarks[0];
  const hand2 = result.landmarks[1];
  // flip hand horizontally
  if (hand1) {
    for (let i = 0; i < hand1.length; i++) {
      hand1[i].x = 1 - hand1[i].x;
    }
  }
  if (hand2) {
    for (let i = 0; i < hand2.length; i++) {
      hand2[i].x = 1 - hand2[i].x;
    }
  }

  const hand1FingerTip = hand1 ? [hand1[4], hand1[8], hand1[12], hand1[16], hand1[20]] : null
  const hand2FingerTip = hand2 ? [hand2[0], hand2[4], hand2[8], hand2[12], hand2[16]] : null
  return {
    fingerPosition: [hand1FingerTip, hand2FingerTip],
    handedness: result.handedness
  }
}

export function useGestureDetector(config: {
  canvasElement: HTMLCanvasElement;
  videoElement: HTMLVideoElement;
  enableCameraButton: HTMLButtonElement;
  height: string;
  width: string;
  onResults: (results: HandPositionInfo) => void
}) {
  const { videoElement, enableCameraButton, canvasElement, height, width, onResults } =
    config;
  console.log(
    '🚀 ~ file: useGestureDetector.ts:30 ~ videoElement, enableCameraButton, canvasElement:',
    videoElement,
    enableCameraButton,
    canvasElement
  );
  const gestureRecognizerRef = useRef<GestureRecognizer>();
  const predictWebcam = useCallback(async () => {
    canvasElement.style.height = height;
    videoElement.style.height = height;
    canvasElement.style.width = width;
    videoElement.style.width = width;
    videoElement.hidden = true;
    // Now let's start detecting the stream.
    const gestureRecognizer = gestureRecognizerRef.current;
    if (!gestureRecognizer) {
      console.log('Wait! handLandmarker not loaded yet.');
      return;
    }
    // await handLandmarker.setOptions({ runningMode: 'VIDEO' });
    let startTimeMs = performance.now();
    const results = gestureRecognizer.recognizeForVideo(videoElement, startTimeMs);
    const canvasCtx = canvasElement.getContext('2d');

    if (canvasCtx === null) {
      console.log("🚀 ~ predictWebcam ~ canvasCtx:", canvasCtx)
      throw new Error('Canvas context is null');
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    onResults(transformHandPositionInfo(results))
    // test code, open this to draw hand
    const drawingUtils = new DrawingUtils(canvasCtx)
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 5,
        });
        drawingUtils.drawLandmarks(landmarks, { color: '#FF0000', lineWidth: 2 });
      }
    }
    canvasCtx.restore();

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  }, [canvasElement, height, onResults, videoElement, width]);

  const enableCam = useCallback(() => {
    // Enable the live webcam view and start detection.
    if (!gestureRecognizerRef.current) {
      console.log('Wait! objectDetector not loaded yet.');
      return;
    }

    // getUsermedia parameters.
    const constraints = {
      video: true,

    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoElement.srcObject = stream;
      videoElement.addEventListener('loadeddata', predictWebcam);
    });
  }, [videoElement, predictWebcam]);

  useEffect(
    function init() {
      if (!videoElement || !canvasElement) {
        console.log('Wait! videoElement and canvasElement not loaded yet.');
        return;
      }
      console.log('video and canvas loaded');
      createHandLandMarker().then((handLandmarker) => {
        gestureRecognizerRef.current = handLandmarker;
        const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
        console.log(
          '🚀 ~ file: useGestureDetector.ts:89 ~ init ~ hasGetUserMedia:',
          hasGetUserMedia
        );
        // If webcam supported, add event listener to button for when user
        // wants to activate it.
        if (hasGetUserMedia()) {
          setTimeout(() => {
            enableCam();
          }, 300);
          // enableCameraButton.addEventListener('click', enableCam);
        } else {
          console.warn('getUserMedia() is not supported by your browser');
        }
      });
    },

    [videoElement, canvasElement, enableCameraButton, enableCam]
  );
}
