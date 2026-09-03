import { initGGWave } from './ggwaveManager';

let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let scriptNode: ScriptProcessorNode | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;

export async function startListening(
  onSignalDetected: () => void,
  onMessageDecoded: (message: string) => void,
  onAudioData: (data: Float32Array) => void,
  onError: (error: Error) => void
) {
  try {
    const { instance, inst } = await initGGWave();

    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      }
    });

    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 48000,
      });
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    
    // We use ScriptProcessorNode. While deprecated, it is the most reliable way 
    // to get raw audio data into the main thread for our WASM ggwave instance 
    // without dealing with WebWorker WASM messaging complexities.
    const bufferSize = 2048; 
    scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

    scriptNode.onaudioprocess = (audioProcessingEvent) => {
      const inputBuffer = audioProcessingEvent.inputBuffer;
      const inputData = inputBuffer.getChannelData(0); // Float32Array
      
      // Pass copy to visualizer
      onAudioData(new Float32Array(inputData));

      // ggwave expects Int8Array mapping of the Float32Array bytes
      const bytes = new Int8Array(inputData.buffer, inputData.byteOffset, inputData.byteLength);
      
      const rxBytes = instance.decode(inst, bytes);
      
      // If it returned a non-empty Int8Array, we got a decoded payload
      if (rxBytes && rxBytes.length > 0) {
        const decodedString = new TextDecoder().decode(rxBytes);
        onMessageDecoded(decodedString);
      }
    };

    sourceNode.connect(scriptNode);
    scriptNode.connect(audioContext.destination);

  } catch (error: any) {
    console.error("Listening error:", error);
    onError(error);
  }
}

export function stopListening() {
  if (scriptNode && audioContext) {
    scriptNode.disconnect();
    if (sourceNode) sourceNode.disconnect();
    scriptNode = null;
    sourceNode = null;
  }
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
}
