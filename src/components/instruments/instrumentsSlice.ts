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

export type NoteTime = `${number}:${number}:${number}`;
export type InstrumentType = "square" | "triangle" | "sawtooth";
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
    addInstrument: b.preparedReducer(
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

    addNotesToInstrument: b.reducer(
      (state, action: PayloadAction<{ instrumentId: string; notes: Notes }>) => {
        const { instrumentId: id, notes } = action.payload;
        const instrument = state.entities[id];

        if (instrument) {
          notesAdapter.setMany(instrument.notes, notes);
        }
      },
    ),

    muteInstrument: b.asyncThunk(
      ({ instrumentId }: { instrumentId: string }) => {
        toneSync.setInstrumentVolume(instrumentId, -200);
        return instrumentId;
      },
      {
        fulfilled(state, action) {
          const instrument = state.entities[action.payload];

          if (instrument) {
            instrument.playback.mute = !instrument.playback.mute;
          }
        },
      },
    ),

    unmuteInstrument: b.asyncThunk(
      ({ instrumentId }: { instrumentId: string }, { getState }) => {
        const volume = selectInstrumentVolume(getState() as RootState, instrumentId);
        toneSync.setInstrumentVolume(instrumentId, volume);
        return instrumentId;
      },
      {
        fulfilled(state, action) {
          const instrument = state.entities[action.payload];

          if (instrument) {
            instrument.playback.mute = !instrument.playback.mute;
          }
        },
      },
    ),
  }),
});

export const { addInstrument, addNotesToInstrument, unmuteInstrument, muteInstrument } =
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

export default instrumentsSlice;
