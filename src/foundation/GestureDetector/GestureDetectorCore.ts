import { Category, DrawingUtils, FilesetResolver, GestureRecognizer, HandLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";

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

class GestureDetectorCore {
  canvasElement: HTMLCanvasElement;
  videoElement: HTMLVideoElement;
  height: string;
  width: string;
  onResults: (results: HandPositionInfo) => void;
  gestureRecognizer: GestureRecognizer | null = null;

  static instance: GestureDetectorCore | null = null;

  static getInstance(config: {
    canvasElement: HTMLCanvasElement;
    videoElement: HTMLVideoElement;
    height: string;
    width: string;
    onResults: (results: HandPositionInfo) => void
  }) {
    if (!this.instance) {
      this.instance = new GestureDetectorCore(config);
    }
    return this.instance;
  }

  private constructor(config: {
    canvasElement: HTMLCanvasElement;
    videoElement: HTMLVideoElement;
    height: string;
    width: string;
    onResults: (results: HandPositionInfo) => void
  }) {
    console.log('new GestureDetectorCore')
    this.canvasElement = config.canvasElement;
    this.videoElement = config.videoElement;
    this.height = config.height;
    this.width = config.width;
    this.onResults = config.onResults;
    this.init();
  }

  init() {
    createHandLandMarker().then((handLandMarker) => {
      this.gestureRecognizer = handLandMarker;
      const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
      console.log(
        '🚀 ~ file: useGestureDetector.ts:89 ~ init ~ hasGetUserMedia:',
        hasGetUserMedia
      );
      // If webcam supported, add event listener to button for when user
      // wants to activate it.
      if (hasGetUserMedia()) {
        setTimeout(() => {
          this.enableCam();
        }, 300);
      } else {
        console.warn('getUserMedia() is not supported by your browser');
      }
    })
  }

  enableCam() {
    if (this.gestureRecognizer) {
      const constraints = { video: { width: 640, height: 480 } };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        this.videoElement.srcObject = stream;
        this.videoElement.hidden = false;
        // this.videoElement.addEventListener('loadeddata', this.predictWebcam)
        this.videoElement.onloadedmetadata = () => {
          this.videoElement.play();
          this.predictWebcam();
        };
      })
    }
  }

  predictWebcam = () => {
    console.log('predictWebcam() run')
    this.canvasElement.style.height = this.height;
    this.videoElement.style.height = this.height;
    this.canvasElement.style.width = this.width;
    this.videoElement.style.width = this.width;
    this.videoElement.hidden = true;

    // Now let's start detecting the stream.
    if (!this.gestureRecognizer) {
      console.log('Wait! handLandmarker not loaded yet.');
      return;
    }
    // await handLandmarker.setOptions({ runningMode: 'VIDEO' });
    let startTimeMs = performance.now();
    const results = this.gestureRecognizer.recognizeForVideo(this.videoElement, startTimeMs);
    const canvasCtx = this.canvasElement.getContext('2d');

    if (canvasCtx === null) {
      console.log("🚀 ~ predictWebcam ~ canvasCtx:", canvasCtx)
      throw new Error('Canvas context is null');
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.onResults(transformHandPositionInfo(results))
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
    window.requestAnimationFrame(this.predictWebcam);
  }

}

export {
  GestureDetectorCore
}
