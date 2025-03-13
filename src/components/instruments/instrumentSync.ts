import * as Tone from "tone";
import { Instrument, Note } from "./instrumentsSlice.ts";
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

  const part = new Tone.Part((time, note) => {
    synth.triggerAttackRelease(note.note, note.duration ?? "8n", time);
  }, Object.values(notes.entities)).start(0);

  part.loop = true;

  instrumentMap.set(id, { synth, part });

  if (mute) {
    muteInstrument(id);
  } else {
    setInstrumentVolume(id, volume);
  }
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
