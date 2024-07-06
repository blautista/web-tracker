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
            volume: 0,
            mute: false,
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

export default instrumentsSlice;

const { instrumentMuteChanged } = instrumentsSlice.actions;

const unmuteInstrument = createThunk((instrumentId: string, { getState, dispatch }) => {
  const volume = selectInstrumentVolume(getState(), instrumentId);
  toneSync.setInstrumentVolume(instrumentId, volume);

  dispatch(instrumentMuteChanged({ instrumentId, muted: false }));
});

const muteInstrument = createThunk((instrumentId: string, { dispatch }) => {
  toneSync.muteInstrument(instrumentId);

  dispatch(instrumentMuteChanged({ instrumentId, muted: true }));
});

export { muteInstrument, unmuteInstrument };
