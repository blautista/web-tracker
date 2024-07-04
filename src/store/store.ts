import { configureStore } from "@reduxjs/toolkit";
import instrumentsSlice, {
  instrumentAdded,
  instrumentNotesAdded,
  selectAllInstruments,
} from "../components/instruments/instrumentsSlice.ts";
import { toneSync } from "../components/instruments/instrumentSync.ts";
import { syncTransport } from "../components/Transport/slice/sync.ts";
import transportSlice, { selectBpm } from "../components/Transport/slice/transportSlice.ts";
import * as Tone from "tone";

const store = configureStore({
  reducer: {
    [transportSlice.name]: transportSlice.reducer,
    [instrumentsSlice.name]: instrumentsSlice.reducer,
  },
});

store.dispatch(instrumentAdded({ type: "square", name: "Square!" }));

store.dispatch(
  instrumentNotesAdded({
    instrumentId: store.getState().instruments.ids[0],
    notes: [
      { time: "0:0:2", note: "C4" },
      { time: "0:1:0", note: "C4" },
      { time: "0:1:3", note: "D4" },
      { time: "0:2:2", note: "C4" },
      { time: "0:3:0", note: "C4" },
      { time: "0:3:2", note: "G3" },
    ],
  }),
);

store.dispatch(instrumentAdded({ type: "triangle", name: "Triangle :O" }));

store.dispatch(
  instrumentNotesAdded({
    instrumentId: store.getState().instruments.ids[1],
    notes: [
      { time: "0:0:0", note: "C3", duration: "32n" },
      { time: "0:0:3", note: "C3", duration: "32n" },
      { time: "0:1:2", note: "C3", duration: "32n" },
      { time: "0:2:0", note: "B3", duration: "32n" },
      { time: "0:3:0", note: "E3", duration: "32n" },
      { time: "0:3:4", note: "C1", duration: "32n" },
    ],
  }),
);

toneSync.initInstruments(selectAllInstruments(store.getState()));
Tone.getTransport().bpm.value = selectBpm(store.getState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

syncTransport(store.dispatch);

export default store;
