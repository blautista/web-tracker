import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import * as Tone from "tone";
import store, { RootState } from "../../store/store.ts";
import { PlaybackState } from "tone";

function barsBeatsSixteenthsToIndex(str: string): number {
  const [bar, beats, sixteenths] = str.split(":");
  let sum = Number(bar) * 4 * 4;

  if (beats) {
    sum += parseInt(beats) * 4;
  }

  if (sixteenths) {
    sum += parseInt(sixteenths);
  }

  return sum - 1;
}

type TransportState = {
  state: PlaybackState;
  position: string;
};

const initialState: TransportState = {
  state: "stopped",
  position: "0:0:0",
};

const transportSlice = createSlice({
  name: "transport",
  initialState,
  reducers: (b) => ({
    setTransportState: b.reducer((state, action: PayloadAction<PlaybackState>) => {
      state.state = action.payload;
    }),

    setTransportPosition: b.reducer((state, action: PayloadAction<string>) => {
      state.position = action.payload;
    }),

    stopTransport: b.asyncThunk<void, void>(() => {
      Tone.Transport.stop();
    }),

    startTransport: b.asyncThunk<void, void>(async () => {
      await Tone.start();
      Tone.Transport.start();
    }),

    pauseTransport: b.asyncThunk<void, void>(() => {
      Tone.Transport.pause();
    }),
  }),
});

export const {
  setTransportState,
  setTransportPosition,
  stopTransport,
  startTransport,
  pauseTransport,
} = transportSlice.actions;

export function selectTransportPlaybackState(state: RootState) {
  return state.transport.state;
}

export function selectTransportPosition(state: RootState) {
  return state.transport.position;
}

export function selectTransportIndexPosition(state: RootState) {
  return barsBeatsSixteenthsToIndex(state.transport.position) + 1;
}

export default transportSlice;

function handleEvent() {
  store.dispatch(setTransportState(Tone.Transport.state));
}

Tone.Transport.on("start", handleEvent);
Tone.Transport.on("stop", handleEvent);
Tone.Transport.on("pause", handleEvent);

function getQuantizedTransportPosition(time: number) {
  const offset = Tone.Time().toSeconds() - time;
  const tPos = Tone.TransportTime().toSeconds() - offset;
  return Tone.Time(tPos).toBarsBeatsSixteenths();
}

Tone.Transport.scheduleRepeat(
  (time) => {
    store.dispatch(setTransportPosition(getQuantizedTransportPosition(time)));
  },
  "16n",
  0,
);
