import {
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../store/store.ts";
import * as Tone from "tone";
import { toneSync } from "./instrumentSync.ts";
import { InstrumentType } from "./synthFactory.ts";

export type NoteTime = `${number}:${number}:${number}`;

export type Note = { time: NoteTime; note: string; duration?: Tone.Unit.Time };
export type Notes = Note[];

const instrumentsAdapter = createEntityAdapter<Instrument>();
const notesAdapter = createEntityAdapter({ selectId: (note: Note) => note.time });

export type Instrument = {
  id: string;
  name: string;
  type: InstrumentType;
  playback: {
    volume: number;
    mute: boolean;
  };
  notes: EntityState<Note, NoteTime>;
};

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

    instrumentMuteChange: b.reducer(
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

const { instrumentMuteChange } = instrumentsSlice.actions;

export function unmuteInstrument(instrumentId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const volume = selectInstrumentVolume(getState(), instrumentId);
    toneSync.setInstrumentVolume(instrumentId, volume);

    dispatch(instrumentMuteChange({ instrumentId, muted: false }));
  };
}

export function muteInstrument(instrumentId: string) {
  return (dispatch: AppDispatch) => {
    toneSync.muteInstrument(instrumentId);

    dispatch(instrumentMuteChange({ instrumentId, muted: true }));
  };
}

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
