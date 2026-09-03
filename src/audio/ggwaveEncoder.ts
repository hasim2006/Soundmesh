import { float32ToWav } from './wavExport';
import { initGGWave } from './ggwaveManager';

let audioContext: AudioContext | null = null;

export async function generateWavBlob(message: string): Promise<Blob> {
  const { instance, inst } = await initGGWave();
  const protocolId = instance.ProtocolId.GGWAVE_PROTOCOL_AUDIBLE_FAST;
  const txBytes = instance.encode(inst, message, protocolId, 25);
  const floatArray = new Float32Array(txBytes.buffer, txBytes.byteOffset, txBytes.byteLength / 4);
  return float32ToWav(floatArray, 48000);
}

export async function transmitMessage(
  message: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const { instance, inst } = await initGGWave();

  // Create an AudioContext with the specific sample rate
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 48000,
    });
  }

  // Ensure context is resumed (required by some browsers if not auto-resumed)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // Encode the message to ggwave audio format
  // 1 is GGWAVE_PROTOCOL_AUDIBLE_FAST
  const protocolId = instance.ProtocolId.GGWAVE_PROTOCOL_AUDIBLE_FAST;
  const volume = 20; // 0-100? Let's use 20 to avoid distortion, wait, let's use 50. Wait, 10 is the default in their C++ example.

  const txBytes = instance.encode(inst, message, protocolId, 25);
  
  // Since sampleFormatOut is F32, the returned Int8Array contains Float32 values
  // We view it as a Float32Array for the WebAudio API
  const floatArray = new Float32Array(txBytes.buffer, txBytes.byteOffset, txBytes.byteLength / 4);

  // Play the float array using WebAudio API
  const audioBuffer = audioContext.createBuffer(1, floatArray.length, 48000);
  audioBuffer.copyToChannel(floatArray, 0);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  
  const durationMs = (floatArray.length / 48000) * 1000;
  
  return new Promise((resolve) => {
    source.onended = () => {
      resolve();
    };
    source.start();

    // Emulate progress
    if (onProgress) {
      const startTime = performance.now();
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        let p = elapsed / durationMs;
        if (p >= 1) {
          p = 1;
          clearInterval(interval);
        }
        onProgress(p);
      }, 50);
    }
  });
}
