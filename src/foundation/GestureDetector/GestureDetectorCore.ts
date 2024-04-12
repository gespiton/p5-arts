import { Category, DrawingUtils, GestureRecognizer, HandLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";

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

class GestureDetectorCore {
  canvasElement: HTMLCanvasElement;
  videoElement: HTMLVideoElement;
  height: number;
  width: number;
  showHand: boolean;
  onResults: (results: HandPositionInfo) => void;
  gestureRecognizer: GestureRecognizer | null = null;
  offlineCanvas: OffscreenCanvas | null = null;
  worker: Worker | null = null;

  static instance: GestureDetectorCore | null = null;

  static getInstance(config: {
    canvasElement: HTMLCanvasElement;
    videoElement: HTMLVideoElement;
    height: number;
    width: number;
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
    height: number;
    width: number;
    showHand?: boolean;
    onResults: (results: HandPositionInfo) => void
  }) {
    console.log('new GestureDetectorCore')
    this.canvasElement = config.canvasElement;
    this.videoElement = config.videoElement;
    this.height = config.height;
    this.width = config.width;
    this.showHand = config.showHand ?? true;
    this.onResults = config.onResults;
    this.init();
  }

  init() {
    this.canvasElement.style.height = `${this.height}px`;
    this.videoElement.style.height = `${this.height}px`;
    this.canvasElement.style.width = `${this.width}px`;
    this.videoElement.style.width = `${this.width}px`;
    this.worker = new Worker(new URL('./gesture-detector-worker.ts', import.meta.url));
    this.worker.postMessage({ type: 'init' });
    this.worker.onmessage = this.onWorkerMessage;
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
    }
  }

  enableCam() {
    const constraints = { video: { width: 640, height: 480 } };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.videoElement.srcObject = stream;
      this.videoElement.hidden = false;
      this.videoElement.onloadedmetadata = () => {
        this.videoElement.play();
        this.offlineCanvas = new OffscreenCanvas(this.width, this.height);
        this.videoElement.hidden = true;
        this.predictWebcam();
      };
    })
  }

  predictWebcam = () => {
    // Now let's start detecting the stream.
    const imageBitMap = this.getRecentFrame();
    if (imageBitMap) {
      this.worker?.postMessage({ type: 'predict', imageBitMap, timestamp: Date.now() }, [imageBitMap]);
    }
  }

  onWorkerMessage = (message: MessageEvent) => {
    if (message.data.type === 'result') {
      const result = message.data.result;
      if (result) {
        this.onResults(transformHandPositionInfo(result))
      }

      if (this.showHand) {
        const canvasCtx = this.canvasElement.getContext('2d');
        if (canvasCtx === null) {
          console.log("🚀 ~ predictWebcam ~ canvasCtx:", canvasCtx)
          throw new Error('Canvas context is null');
        }
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        const drawingUtils = new DrawingUtils(canvasCtx)
        if (result.landmarks) {
          for (const landmarks of result.landmarks) {
            drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 5,
            });
            drawingUtils.drawLandmarks(landmarks, { color: '#FF0000', lineWidth: 2 });
          }
        }
        canvasCtx.restore();
      }
    }
    requestAnimationFrame(this.predictWebcam);
  }


  getRecentFrame() {
    if (this.offlineCanvas) {
      const ctx = this.offlineCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, this.offlineCanvas.width, this.offlineCanvas.height);
        ctx.drawImage(this.videoElement, 0, 0, this.offlineCanvas.width, this.offlineCanvas.height);
        return this.offlineCanvas.transferToImageBitmap()
        // console.log("🚀 ~ GestureDetectorCore ~ getRecentFrame ~ blob:", blob)
      }
    }
    return null;
  }

}

export {
  GestureDetectorCore
}
