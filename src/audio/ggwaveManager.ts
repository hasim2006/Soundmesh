import ggwaveFactory from 'ggwave';

export type GGWaveInstance = any; // We'll type this loosely as the methods are dynamic

let instance: GGWaveInstance | null = null;
let inst: any = null;

export async function initGGWave() {
  if (instance && inst) return { instance, inst };
  
  instance = await ggwaveFactory();
  const params = instance.getDefaultParameters();
  params.sampleFormatInp = instance.SampleFormat.GGWAVE_SAMPLE_FORMAT_F32;
  params.sampleFormatOut = instance.SampleFormat.GGWAVE_SAMPLE_FORMAT_F32;
  params.sampleRateInp = 48000;
  params.sampleRateOut = 48000;
  
  inst = instance.init(params);
  return { instance, inst };
}
