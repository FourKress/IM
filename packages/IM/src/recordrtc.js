import { RecordRTCPromisesHandler } from 'recordrtc';

export default class Recordrtc {
  constructor() {
    this.stream = '';
    this.recorder = null;
    this.isRecorder = false;
  }

  async getUserMedia(config) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(config);
      this.stream = stream;
      this.recorder = null;
      this.isRecorder = false;
    } catch (err) {
      alert('Unable to capture your camera. Please check console logs.');
      console.error(err);
    }
  }

  destroy() {
    this.recorder.destroy();
    this.recorder = null;
    this.isRecorder = false;
  }

  async startAudioRecording() {
    if (this.isRecorder) return;

    await this.getUserMedia({
      audio: true,
    });
    this.recorder = new RecordRTCPromisesHandler(this.stream, {
      type: 'audio',
      mimeType: 'audio/mp3',
    });
    this.recorder.startRecording();

    this.isRecorder = true;
  }

  async stopAudioRecording() {
    if (!this.isRecorder || !this.recorder) return;

    await this.recorder.stopRecording();
    const blob = await this.recorder.getBlob();

    this.destroy();

    // invokeSaveAsDialog(blob, '录音.mp3');
    return URL.createObjectURL(blob);
  }

  async startVideoRecording(videoElement) {
    if (this.isRecorder) return;

    await this.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });

    videoElement.muted = true;
    videoElement.volume = 0;
    videoElement.srcObject = this.stream;

    this.recorder = new RecordRTCPromisesHandler(this.stream, {
      type: 'video',
      mimeType: 'video/mp4',
    });
    this.recorder.startRecording();
    this.recorder.camera = this.stream;

    this.isRecorder = true;
  }

  async stopVideoRecording(videoElement) {
    if (!this.isRecorder || !this.recorder) return;

    await this.recorder.stopRecording();
    const blob = await this.recorder.getBlob();

    videoElement.src = videoElement.srcObject = null;
    videoElement.muted = false;
    videoElement.volume = 1;
    videoElement.src = URL.createObjectURL(blob);

    this.recorder.camera.stop();
    this.destroy();

    //视频下载 invokeSaveAsDialog（参数1为视频流blob,参数2为视频类型）
    // invokeSaveAsDialog(blob, 'video.mp4');
    return URL.createObjectURL(blob);
  }
}
