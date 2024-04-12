/* eslint-disable no-restricted-globals */

import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

const createHandLandMarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
  );
  const handLandMarker = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2,
  });
  return handLandMarker;
};

let gestureRecognizer: GestureRecognizer | null = null;

self.onmessage = function (message) {
  if (message.data.type === 'init') {
    createHandLandMarker().then((handLandMarker) => {
      gestureRecognizer = handLandMarker;
    })
  }

  if (message.data.type === 'predict') {
    const result = gestureRecognizer?.recognizeForVideo(message.data.imageBitMap, message.data.timestamp)
    postMessage({ type: 'result', result });
  }
}
