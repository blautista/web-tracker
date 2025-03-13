import * as Tone from "tone";
import { selectBpm } from "../components/Transport/slice/transportSlice";
import { toneSync } from "../components/instruments/instrumentSync";
import {
  instrumentAdded,
  instrumentNotesAdded,
  selectAllInstruments,
} from "../components/instruments/instrumentsSlice";
import type { AppDispatch, RootState } from "./store";

export function makeFakeInitialState(dispatch: AppDispatch, getState: () => RootState) {
  dispatch(instrumentAdded({ type: "square", name: "Square!" }));

  dispatch(
    instrumentNotesAdded({
      instrumentId: getState().instruments.ids[0],
      notes: [
        { time: "0:0:2", note: "C4", pattern: 0 },
        { time: "0:1:0", note: "C4", pattern: 0 },
        { time: "0:1:3", note: "D4", pattern: 0 },
        { time: "0:2:2", note: "C4", pattern: 0 },
        { time: "0:3:0", note: "C4", pattern: 0 },
        { time: "0:3:2", note: "G3", pattern: 0 },
      ],
    }),
  );

  dispatch(instrumentAdded({ type: "triangle", name: "Triangle :O" }));

  dispatch(
    instrumentNotesAdded({
      instrumentId: getState().instruments.ids[1],
      notes: [
        { time: "0:0:0", note: "C3", duration: "32n", pattern: 0 },
        { time: "0:0:3", note: "C3", duration: "32n", pattern: 0 },
        { time: "0:1:2", note: "C3", duration: "32n", pattern: 0 },
        { time: "0:2:0", note: "B3", duration: "32n", pattern: 0 },
        { time: "0:3:0", note: "E3", duration: "32n", pattern: 0 },
        { time: "0:3:4", note: "C1", duration: "32n", pattern: 0 },
      ],
    }),
  );

  toneSync.initInstruments(selectAllInstruments(getState()));
  Tone.getTransport().bpm.value = selectBpm(getState());
}
