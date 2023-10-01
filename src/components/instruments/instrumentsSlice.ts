import {
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store/store.ts";

export type NoteTime = `${number}:${number}:${number}`;
export type InstrumentType = "square" | "triangle" | "sawtooth";
export type Note = { time: NoteTime; note: string; duration?: string };
export type Notes = Note[];

const instrumentsAdapter = createEntityAdapter<Instrument>();
const notesAdapter = createEntityAdapter({ selectId: (note: Note) => note.time });

export type Instrument = {
  id: string;
  name: string;
  type: InstrumentType;
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
  }),
});

export const { addInstrument, addNotesToInstrument } = instrumentsSlice.actions;
export const {
  selectIds: selectInstrumentIds,
  selectById: selectInstrumentById,
  selectAll: selectAllInstruments,
} = instrumentsAdapter.getSelectors<RootState>((state) => state.instruments);

export default instrumentsSlice;
