import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { useCallback, useEffect, useRef } from 'react';

const runningMode = 'VIDEO';

const createHandLandMarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.1.0-alpha-11/wasm'
  );
  const handLandMarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task`,
    },
    runningMode: runningMode,
    numHands: 2,
  });
  return handLandMarker;
};

export function useGestureDetector(config: {
  canvasElement: HTMLCanvasElement;
  videoElement: HTMLVideoElement;
  enableCameraButton: HTMLButtonElement;
  height: string;
  width: string;
}) {
  const { videoElement, enableCameraButton, canvasElement, height, width } =
    config;
  console.log(
    '🚀 ~ file: useGestureDetector.ts:30 ~ videoElement, enableCameraButton, canvasElement:',
    videoElement,
    enableCameraButton,
    canvasElement
  );
  const handLandMarkerRef = useRef<HandLandmarker>();
  const predictWebcam = useCallback(async () => {
    canvasElement.style.height = height;
    videoElement.style.height = height;
    canvasElement.style.width = width;
    videoElement.style.width = width;
    // Now let's start detecting the stream.
    const handLandmarker = handLandMarkerRef.current;
    if (!handLandmarker) {
      console.log('Wait! handLandmarker not loaded yet.');
      return;
    }
    // await handLandmarker.setOptions({ runningMode: 'VIDEO' });
    let startTimeMs = performance.now();
    const results = handLandmarker.detectForVideo(videoElement, startTimeMs);
    const canvasCtx = canvasElement.getContext('2d');

    if (canvasCtx === null) {
      throw new Error('Canvas context is null');
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
      }
    }
    canvasCtx.restore();

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  }, [videoElement, canvasElement, height, width]);

  const enableCam = useCallback(() => {
    // Enable the live webcam view and start detection.
    if (!handLandMarkerRef.current) {
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
        handLandMarkerRef.current = handLandmarker;
        const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
        console.log(
          '🚀 ~ file: useGestureDetector.ts:89 ~ init ~ hasGetUserMedia:',
          hasGetUserMedia
        );
        // If webcam supported, add event listener to button for when user
        // wants to activate it.
        if (hasGetUserMedia()) {
          enableCameraButton.addEventListener('click', enableCam);
        } else {
          console.warn('getUserMedia() is not supported by your browser');
        }
      });
    },

    [videoElement, canvasElement, enableCameraButton, enableCam]
  );
}
