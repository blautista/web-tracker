import {
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";

export type NoteTime = `${number}:${number}:${number}`;
export type InstrumentType = "square" | "triangle" | "sawtooth";
export type Note = { time: NoteTime; note: string };
export type Notes = Note[];

const instrumentsAdapter = createEntityAdapter<Instrument>();
const notesAdapter = createEntityAdapter({ selectId: (note: Note) => note.time });

export type Instrument = { id: string; type: InstrumentType; notes: EntityState<Note, NoteTime> };

const instrumentsSlice = createSlice({
  name: "instruments",
  initialState: instrumentsAdapter.getInitialState(),
  reducers: (b) => ({
    addInstrument: b.preparedReducer(
      (obj: { type: InstrumentType }) => {
        const id = nanoid();
        return { payload: { ...obj, id } };
      },
      (state, action) => {
        instrumentsAdapter.addOne(state, {
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
export const { selectIds: selectInstrumentIds, selectById: selectInstrumentById } =
  instrumentsAdapter.getSelectors();

export default instrumentsSlice;
