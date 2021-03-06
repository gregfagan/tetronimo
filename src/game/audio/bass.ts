import * as Tone from 'tone';

import { addMixer, generatePatterns } from './util';
import { gui, range, sample } from '../util';

export const monoBassSynth = () => {
  const bass = new Tone.MonoSynth();
  bass.oscillator.type = sample([
    'pulse',
    'pwm',
    'sine',
    'square',
    'triangle',
    'sawtooth',
    'fatsawtooth',
    'fattriangle',
    'fmsawtooth',
    'fmtriangle',
  ]);
  bass.envelope.set({
    attack: sample([0.01, '8n']),
  });

  bass.filterEnvelope.set({
    attack: sample([0.01, '8n']),
    decay: sample([0.01, '8n', '4n']),
  });
  return bass;
};
