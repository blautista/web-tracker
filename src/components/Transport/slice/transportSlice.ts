import { PayloadAction } from "@reduxjs/toolkit";
import * as Tone from "tone";
import { PlaybackState } from "tone";
import { createAppSlice } from "../../../store/createAppSlice.ts";
import { createThunk } from "../../../store/createThunk.ts";
import type { RootState } from "../../../store/store.ts";
import { toneSync } from "../../instruments/instrumentSync.ts";
import {
  Instrument,
  noteAddedByCursor,
  selectAllInstruments,
} from "../../instruments/instrumentsSlice.ts";
import {
  barsBeatsSixteenthsToTransportIndex,
  makeCellId,
  transportIndexToBarsBeatsSixteenths,
} from "./utils.ts";

export type InstrumentColumn = "note" | "volume";

export interface CursorState {
  rowIndex: number;
  columnId: InstrumentColumn;
  instrumentId: string;
}

interface EditorState {
  editing: boolean;
  frame: number;
}

interface TransportState {
  state: PlaybackState;
  position: string;
  bpm: number;
  rowsPerFrame: number;
  cursor: CursorState | null;
  editor: EditorState;
  visibleColumns: InstrumentColumn[];
}

const initialState: TransportState = {
  state: "stopped",
  position: "0:0:0",
  bpm: 110,
  rowsPerFrame: 64,
  cursor: null,
  editor: {
    editing: false,
    frame: 0,
  },
  visibleColumns: ["note", "volume"],
};

function circularClamp(n: number, max: number, min = 0) {
  if (n < 0) {
    return max;
  }

  if (n > max) {
    return min;
  }

  return n;
}

type Direction = "up" | "down" | "left" | "right";

type PA<T> = PayloadAction<T>;

const transportSlice = createAppSlice({
  name: "transport",
  initialState,
  reducers: {
    transportStateChanged(state, action: PA<PlaybackState>) {
      state.state = action.payload;
    },

    transportPositionChanged(state, action: PayloadAction<string>) {
      state.position = action.payload;
    },

    bpmChanged(state, action: PayloadAction<number>) {
      state.bpm = action.payload;
    },

    editorCursorChanged(state, action: PayloadAction<CursorState>) {
      state.cursor = action.payload;
    },

    editingToggled(state) {
      state.editor.editing = !state.editor.editing;
    },

    editorCursorMoved(
      state,
      {
        payload: { direction, instruments },
      }: PA<{ direction: Direction; instruments: Instrument[] }>,
    ) {
      const cursor = state.cursor;
      const { visibleColumns } = state;

      if (!cursor) return;

      if (direction === "up") {
        cursor.rowIndex = circularClamp(cursor.rowIndex - 1, state.rowsPerFrame - 1);
        return;
      }

      if (direction === "down") {
        cursor.rowIndex = circularClamp(cursor.rowIndex + 1, state.rowsPerFrame - 1);
        return;
      }

      const columnIndex = visibleColumns.indexOf(cursor.columnId);

      if (direction === "right") {
        if (columnIndex === visibleColumns.length - 1) {
          const newInstrumentIndex = circularClamp(
            instruments.findIndex((instrument) => cursor.instrumentId === instrument.id) + 1,
            instruments.length - 1,
          );

          cursor.instrumentId = instruments[newInstrumentIndex].id;
          cursor.columnId = visibleColumns[0];
        } else {
          cursor.columnId = visibleColumns[columnIndex + 1];
        }
      }

      if (direction === "left") {
        if (columnIndex === 0) {
          const newInstrumentIndex = circularClamp(
            instruments.findIndex((instrument) => cursor.instrumentId === instrument.id) - 1,
            instruments.length - 1,
          );

          cursor.instrumentId = instruments[newInstrumentIndex].id;
          cursor.columnId = visibleColumns[visibleColumns.length - 1];
        } else {
          cursor.columnId = visibleColumns[columnIndex - 1];
        }
      }
    },
  },
  extraReducers(b) {
    b.addCase(noteAddedByCursor, (state) => {
      if (state.cursor) {
        state.cursor.rowIndex++;
      }
    });
  },
});

export const {
  transportStateChanged,
  transportPositionChanged,
  editorCursorChanged,
  editorCursorMoved,
  editingToggled,
} = transportSlice.actions;

export function selectTransportPlaybackState(state: RootState) {
  return state.transport.state;
}

export function selectTransportPosition(state: RootState) {
  return state.transport.position;
}

export function selectTransportIndexPosition(state: RootState) {
  return barsBeatsSixteenthsToTransportIndex(state.transport.position) + 1;
}

export const selectBpm = (state: RootState) => state.transport.bpm;

export const selectEditorCursor = (state: RootState) => state.transport.cursor;

export const selectIsEditing = (state: RootState) => state.transport.editor.editing;

export const selectEditorSteppedIndex = (state: RootState) => state.transport.cursor?.rowIndex;

export const selectIsCellSelected = (state: RootState, cellId: string) =>
  state.transport.cursor ? makeCellId(state.transport.cursor) === cellId : false;

export default transportSlice;

const { bpmChanged } = transportSlice.actions;

const startTransport = createThunk(async (_, { dispatch }) => {
  await Tone.start();
  Tone.getTransport().start();
  dispatch(transportStateChanged("started"));
});

const pauseTransport = createThunk((_, { dispatch }) => {
  Tone.getTransport().pause();
  dispatch(transportStateChanged("paused"));
});

const stopTransport = createThunk((_, { dispatch }) => {
  Tone.getTransport().stop();
  dispatch(transportStateChanged("stopped"));
});

const changeBpm = createThunk((bpm: number, { dispatch }) => {
  Tone.getTransport().bpm.value = bpm;

  dispatch(bpmChanged(bpm));
});

const stepTransportCursor = createThunk(
  (direction: "up" | "down" | "left" | "right", { getState, dispatch }) => {
    const allInstruments = selectAllInstruments(getState());

    dispatch(editorCursorMoved({ direction, instruments: allInstruments }));
  },
);

const addNoteInCursor = createThunk(({ note }: { note: string }, { getState, dispatch }) => {
  const state = getState();
  const isEditing = selectIsEditing(state);

  if (!isEditing) return;

  const cursor = selectEditorCursor(state);

  if (cursor) {
    const createdNote = {
      note: `${note}4`,
      time: transportIndexToBarsBeatsSixteenths(cursor.rowIndex),
      pattern: 0,
    };

    toneSync.setPartNote(cursor.instrumentId, createdNote);

    dispatch(
      noteAddedByCursor({
        instrumentId: cursor.instrumentId,
        note: createdNote,
      }),
    );
  }
});

export {
  addNoteInCursor,
  changeBpm,
  pauseTransport,
  startTransport,
  stepTransportCursor,
  stopTransport,
};
