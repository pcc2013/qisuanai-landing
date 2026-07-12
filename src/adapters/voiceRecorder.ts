// D:\nira-app\src\adapters\voiceRecorder.ts

import { BACKEND_CONFIG } from '../config/backend';

type Lang = 'en' | 'zh' | 'zh-TW' | 'id' | 'vi';

interface VoiceRecorderInterface {
  startRecording(): Promise<void>;
  stopRecording(): Promise<{ text: string }>;
  isRecording(): boolean;
}

class MockVoiceRecorder implements VoiceRecorderInterface {
  private recording = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  async startRecording(): Promise<void> {
    this.recording = true;
    this.timer = setTimeout(() => {
      this.recording = false;
    }, 8000);
  }

  async stopRecording(): Promise<{ text: string }> {
    if (this.timer) clearTimeout(this.timer);
    this.recording = false;
    return { text: '[Mock transcribed text]' };
  }

  isRecording(): boolean {
    return this.recording;
  }
}

class RealVoiceRecorder implements VoiceRecorderInterface {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recording = false;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.chunks = [];
      this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
      this.mediaRecorder.start();
      this.recording = true;
    } catch (e: any) {
      throw new Error(e.message || 'Failed to start recording');
    }
  }

  async stopRecording(): Promise<{ text: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) return reject(new Error('No recording active'));
      this.mediaRecorder.onstop = async () => {
        this.recording = false;
        const blob = new Blob(this.chunks, { type: 'audio/wav' });
        this.mediaRecorder!.stream.getTracks().forEach((t) => t.stop());
        this.mediaRecorder = null;
        // TODO: 上传到后端 Whisper API
        resolve({ text: '' });
      };
      this.mediaRecorder.stop();
    });
  }

  isRecording(): boolean {
    return this.recording;
  }
}

export const voiceRecorderAdapter: VoiceRecorderInterface =
  BACKEND_CONFIG.ONLINE
    ? new RealVoiceRecorder()
    : new MockVoiceRecorder();