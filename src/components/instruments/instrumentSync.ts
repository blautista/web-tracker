import { Instrument, Note } from "./instrumentsSlice.ts";
import * as Tone from "tone";
import { AnySynth, createSynth } from "./synthFactory.ts";

const instrumentMap = new Map<
  string,
  { volume?: Tone.Volume; synth: AnySynth; part: Tone.Part<Note> }
>();

function initInstrument(instrument: Instrument) {
  const {
    type,
    id,
    notes,
    playback: { mute, volume },
  } = instrument;

  const synth = createSynth(type);

  if (mute) {
    muteInstrument(id);
  } else {
    setInstrumentVolume(id, volume);
  }

  const part = new Tone.Part((time, note) => {
    synth.triggerAttackRelease(note.note, note.duration ?? "8n", time);
  }, Object.values(notes.entities)).start(0);

  instrumentMap.set(id, { synth, part });
}

/**
 * Initializes all instruments with their respective parts within the transport.
 * @param instruments The instruments to use
 */
function initInstruments(instruments: Instrument[]) {
  instruments.forEach(initInstrument);
}

function setInstrumentVolume(instrumentId: string, db: number) {
  const instrument = instrumentMap.get(instrumentId);

  if (instrument) {
    instrument.synth.volume.value = db;
  }
}

function muteInstrument(instrumentId: string) {
  setInstrumentVolume(instrumentId, -100);
}

export const toneSync = { initInstruments, setInstrumentVolume, muteInstrument };
