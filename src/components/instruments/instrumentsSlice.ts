import {
  EntityState,
  PayloadAction,
  createEntityAdapter,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import * as Tone from "tone";
import { createThunk } from "../../store/createThunk.ts";
import type { RootState } from "../../store/store.ts";
import { toneSync } from "./instrumentSync.ts";
import { InstrumentType } from "./synthFactory.ts";

export type Note = {
  // {bars}:{beats}:{sixteenths}
  time: string;
  note: string;
  duration?: Tone.Unit.Time;
  pattern: number;
};
export type Notes = Note[];

const instrumentsAdapter = createEntityAdapter<Instrument>();
const notesAdapter = createEntityAdapter({
  selectId: (note: Note) => note.time,
});

export interface Instrument {
  id: string;
  name: string;
  type: InstrumentType;
  playback: {
    volume: number;
    mute: boolean;
    solo: boolean;
  };
  notes: EntityState<Note, string>;
}

const instrumentsSlice = createSlice({
  name: "instruments",
  initialState: instrumentsAdapter.getInitialState(),
  reducers: {
    instrumentAdded: {
      prepare(obj: { type: InstrumentType; name?: string }) {
        const id = nanoid();
        return { payload: { ...obj, id } };
      },
      reducer(state, action: PayloadAction<{ type: InstrumentType; name?: string; id: string }>) {
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
    },

    instrumentNotesAdded(state, action: PayloadAction<{ instrumentId: string; notes: Notes }>) {
      const { instrumentId: id, notes } = action.payload;
      const instrument = state.entities[id];

      if (instrument) {
        notesAdapter.setMany(instrument.notes, notes);
      }
    },

    instrumentMuteChanged(state, action: PayloadAction<{ instrumentId: string; muted: boolean }>) {
      const { instrumentId, muted } = action.payload;
      const instrument = state.entities[instrumentId];

      if (instrument) {
        instrument.playback.mute = muted;
      }
    },

    instrumentSoloChanged(state, action: PayloadAction<{ instrumentId: string; soloed: boolean }>) {
      const { instrumentId, soloed } = action.payload;
      const instrument = state.entities[instrumentId];

      if (instrument) {
        instrument.playback.solo = soloed;
      }
    },

    noteAddedByCursor(state, action: PayloadAction<{ instrumentId: string; note: Note }>) {
      const { instrumentId, note } = action.payload;
      const instrument = state.entities[instrumentId];

      if (instrument) {
        notesAdapter.setOne(instrument.notes, note);
      }
    },
  },
});

export const { instrumentAdded, instrumentNotesAdded, noteAddedByCursor } =
  instrumentsSlice.actions;

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
    for (const instrument of nonSoloedInstruments) {
      if (instrument.playback.mute) {
        toneSync.muteInstrument(instrument.id);
      } else {
        toneSync.setInstrumentVolume(instrument.id, instrument.playback.volume);
      }
    }

    return;
  }

  for (const instrument of soloedInstruments) {
    toneSync.setInstrumentVolume(instrument.id, instrument.playback.volume);
  }

  for (const instrument of nonSoloedInstruments) {
    toneSync.muteInstrument(instrument.id);
  }
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
