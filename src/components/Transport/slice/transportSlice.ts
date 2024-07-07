import { PayloadAction } from "@reduxjs/toolkit";
import * as Tone from "tone";
import { PlaybackState } from "tone";
import type { RootState } from "../../../store/store.ts";
import { barsBeatsSixteenthsToTransportIndex } from "./utils.ts";
import { createAppSlice } from "../../../store/createAppSlice.ts";
import { createThunk } from "../../../store/createThunk.ts";

interface TransportState {
  state: PlaybackState;
  position: string;
  bpm: number;
}

const initialState: TransportState = {
  state: "stopped",
  position: "0:0:0",
  bpm: 110,
};

const transportSlice = createAppSlice({
  name: "transport",
  initialState,
  reducers: (b) => ({
    transportStateChanged: b.reducer((state, action: PayloadAction<PlaybackState>) => {
      state.state = action.payload;
    }),

    transportPositionChanged: b.reducer((state, action: PayloadAction<string>) => {
      state.position = action.payload;
    }),

    bpmChanged: b.reducer((state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    }),
  }),
});

export const { transportStateChanged, transportPositionChanged } = transportSlice.actions;

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

export default transportSlice;

const { bpmChanged } = transportSlice.actions;

const startTransport = createThunk(() => {
  Tone.getTransport().start();
});

const pauseTransport = createThunk(() => {
  Tone.getTransport().pause();
});

const stopTransport = createThunk(() => {
  Tone.getTransport().stop();
});

const changeBpm = createThunk((bpm: number, { dispatch }) => {
  Tone.getTransport().bpm.value = bpm;

  dispatch(bpmChanged(bpm));
});

export { changeBpm, stopTransport, startTransport, pauseTransport };
