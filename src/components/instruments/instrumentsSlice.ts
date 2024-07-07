import {
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as Tone from "tone";
import { createThunk } from "../../store/createThunk.ts";
import type { RootState } from "../../store/store.ts";
import { toneSync } from "./instrumentSync.ts";
import { InstrumentType } from "./synthFactory.ts";

export type NoteTime = `${number}:${number}:${number}`;

export type Note = { time: NoteTime; note: string; duration?: Tone.Unit.Time };
export type Notes = Note[];

const instrumentsAdapter = createEntityAdapter<Instrument>();
const notesAdapter = createEntityAdapter({ selectId: (note: Note) => note.time });

export interface Instrument {
  id: string;
  name: string;
  type: InstrumentType;
  playback: {
    volume: number;
    mute: boolean;
    solo: boolean;
  };
  notes: EntityState<Note, NoteTime>;
}

const instrumentsSlice = createSlice({
  name: "instruments",
  initialState: instrumentsAdapter.getInitialState(),
  reducers: (b) => ({
    instrumentAdded: b.preparedReducer(
      (obj: { type: InstrumentType; name?: string }) => {
        const id = nanoid();
        return { payload: { ...obj, id } };
      },
      (state, action) => {
        instrumentsAdapter.addOne(state, {
          name: `Instrument ${state.ids.length}`,
          ...action.payload,
          playback: {
            volume: -4,
            mute: false,
            solo: false,
          },
          notes: notesAdapter.getInitialState(),
        });
      },
    ),

    instrumentNotesAdded: b.reducer(
      (state, action: PayloadAction<{ instrumentId: string; notes: Notes }>) => {
        const { instrumentId: id, notes } = action.payload;
        const instrument = state.entities[id];

        if (instrument) {
          notesAdapter.setMany(instrument.notes, notes);
        }
      },
    ),

    instrumentMuteChanged: b.reducer(
      (state, action: PayloadAction<{ instrumentId: string; muted: boolean }>) => {
        const { instrumentId, muted } = action.payload;
        const instrument = state.entities[instrumentId];

        if (instrument) {
          instrument.playback.mute = muted;
        }
      },
    ),

    instrumentSoloChanged: b.reducer(
      (state, action: PayloadAction<{ instrumentId: string; soloed: boolean }>) => {
        const { instrumentId, soloed } = action.payload;
        const instrument = state.entities[instrumentId];

        if (instrument) {
          instrument.playback.solo = soloed;
        }
      },
    ),
  }),
});

export const { instrumentAdded, instrumentNotesAdded } = instrumentsSlice.actions;

export const {
  selectIds: selectInstrumentIds,
  selectById: selectInstrumentById,
  selectAll: selectAllInstruments,
} = instrumentsAdapter.getSelectors<RootState>((state) => state.instruments);

export function selectInstrumentVolume(state: RootState, instrumentId: string) {
  return selectInstrumentPlayback(state, instrumentId).volume;
}

export function selectInstrumentPlayback(state: RootState, instrumentId: string) {
  return selectInstrumentById(state, instrumentId).playback;
}

function selectAllSoloedInstruments(state: RootState) {
  return selectAllInstruments(state).filter((instrument) => instrument.playback.solo);
}

function selectAllNonSoloedInstruments(state: RootState) {
  return selectAllInstruments(state).filter((instrument) => !instrument.playback.solo);
}

export default instrumentsSlice;

const { instrumentMuteChanged, instrumentSoloChanged } = instrumentsSlice.actions;

const unmuteInstrument = createThunk((instrumentId: string, { getState, dispatch }) => {
  const volume = selectInstrumentVolume(getState(), instrumentId);
  toneSync.setInstrumentVolume(instrumentId, volume);

  dispatch(instrumentMuteChanged({ instrumentId, muted: false }));
});

const muteInstrument = createThunk((instrumentId: string, { dispatch }) => {
  toneSync.muteInstrument(instrumentId);

  dispatch(instrumentMuteChanged({ instrumentId, muted: true }));
});

const updateInstrumentVolumes = createThunk((_, { getState }) => {
  const state = getState();

  const soloedInstruments = selectAllSoloedInstruments(state);
  const nonSoloedInstruments = selectAllNonSoloedInstruments(state);

  const atLeastOneSoloedInstrument = soloedInstruments.length > 0;

  if (!atLeastOneSoloedInstrument) {
    nonSoloedInstruments.forEach((instrument) => {
      if (instrument.playback.mute) {
        toneSync.muteInstrument(instrument.id);
      } else {
        toneSync.setInstrumentVolume(instrument.id, instrument.playback.volume);
      }
    });
    return;
  }

  soloedInstruments.forEach((instrument) => {
    toneSync.setInstrumentVolume(instrument.id, instrument.playback.volume);
  });

  nonSoloedInstruments.forEach((instrument) => {
    toneSync.muteInstrument(instrument.id);
  });
});

const soloInstrument = createThunk((instrumentId: string, { dispatch }) => {
  dispatch(instrumentSoloChanged({ instrumentId, soloed: true }));
  dispatch(updateInstrumentVolumes());
});

const unsoloInstrument = createThunk((instrumentId: string, { dispatch }) => {
  dispatch(instrumentSoloChanged({ instrumentId, soloed: false }));
  dispatch(updateInstrumentVolumes());
});

export { muteInstrument, unmuteInstrument, soloInstrument, unsoloInstrument };
