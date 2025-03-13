import { PayloadAction } from "@reduxjs/toolkit";
import * as Tone from "tone";
import { PlaybackState } from "tone";
import { createAppSlice } from "../../../store/createAppSlice.ts";
import { createThunk } from "../../../store/createThunk.ts";
import type { RootState } from "../../../store/store.ts";
import { barsBeatsSixteenthsToTransportIndex } from "./utils.ts";
import { Instrument, selectAllInstruments } from "../../instruments/instrumentsSlice.ts";

export type InstrumentColumn = "note" | "volume";

type CursorState = {
  rowIndex: number;
  columnId: InstrumentColumn;
  instrumentId: string;
} | null;

interface EditorState {
  editing: boolean;
  cursor: CursorState;
  frame: number;
}

interface TransportState {
  state: PlaybackState;
  position: string;
  bpm: number;
  rowsPerFrame: number;
  editor: EditorState;
  visibleColumns: InstrumentColumn[];
}

const initialState: TransportState = {
  state: "stopped",
  position: "0:0:0",
  bpm: 110,
  rowsPerFrame: 64,
  editor: {
    editing: false,
    frame: 0,
    cursor: null,
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
      state.editor.cursor = action.payload;
    },

    editorCursorMoved(
      state,
      {
        payload: { direction, instruments },
      }: PA<{ direction: Direction; instruments: Instrument[] }>,
    ) {
      const cursor = state.editor.cursor;
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
});

export const {
  transportStateChanged,
  transportPositionChanged,
  editorCursorChanged,
  editorCursorMoved,
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

export function selectBpm(state: RootState) {
  return state.transport.bpm;
}

export function selectEditorCursor(state: RootState) {
  return state.transport.editor.cursor;
}

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

export { changeBpm, pauseTransport, startTransport, stopTransport, stepTransportCursor };
