import { RecordRTCPromisesHandler, invokeSaveAsDialog } from 'recordrtc';

export default class Recordrtc {
  constructor() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.stream = stream;
        this.recorder = null;
        this.isRecorder = false;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async startAudioRecording() {
    if (this.isRecorder) return;
    this.recorder = new RecordRTCPromisesHandler(this.stream, {
      type: 'audio',
    });
    this.recorder.startRecording();
    this.isRecorder = true;
  }

  async stopAudioRecording() {
    if (!this.isRecorder || !this.recorder) return;
    await this.recorder.stopRecording();
    this.isRecorder = false;
    const blob = await this.recorder.getBlob();
    const file = new File([blob], '录音', {
      type: 'audio/mp3',
    });
    invokeSaveAsDialog(file, '录音');
  }
}
