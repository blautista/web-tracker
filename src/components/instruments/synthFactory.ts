import * as Tone from "tone";

export type InstrumentType = "square" | "triangle" | "sawtooth";
export type AnySynth = Tone.Synth | Tone.FMSynth | Tone.AMSynth;

export const typeSynthFactory: Record<InstrumentType, () => AnySynth> = {
  square() {
    return new Tone.Synth({
      volume: -4,
      oscillator: {
        type: "square",
      },
    }).toDestination();
  },

  sawtooth() {
    return new Tone.Synth({
      volume: -8,
      oscillator: {
        partials: [1, 2, 1],
      },
    }).toDestination();
  },

  triangle() {
    return new Tone.Synth({
      volume: -4,
      oscillator: {
        type: "triangle",
      },
    }).toDestination();
  },
};

export function createSynth(name: InstrumentType) {
  return typeSynthFactory[name]();
}
