import { Instrument, InstrumentType, Note } from "./instrumentsSlice.ts";
import * as Tone from "tone";

type Synth = Tone.Synth | Tone.FMSynth | Tone.AMSynth;

const typeSynthFactory: Record<InstrumentType, () => Synth> = {
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

const instrumentMap = new Map<string, { synth: Synth; part: Tone.Part<Note> }>();

Tone.Transport.bpm.value = 120;

export function initInstruments(instruments: Instrument[]) {
  for (const instrument of instruments) {
    const { type, id, notes } = instrument;

    const synth = typeSynthFactory[type]();

    const part = new Tone.Part((time, note) => {
      synth.triggerAttackRelease(note.note, note.duration ?? "8n", time);
    }, Object.values(notes.entities)).start(0);

    part.loop = 2;
    part.loopEnd = "1m";

    instrumentMap.set(id, { synth, part });
  }
}
