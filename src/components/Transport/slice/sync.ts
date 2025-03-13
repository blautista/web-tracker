import * as Tone from "tone";
import { AppDispatch } from "../../../store/store";
import { transportPositionChanged } from "./transportSlice";
import { getQuantizedTransportPosition } from "./utils";

function syncPosition(dispatch: AppDispatch) {
  Tone.getTransport().scheduleRepeat(
    (time) => {
      dispatch(transportPositionChanged(getQuantizedTransportPosition(time)));
    },
    "16n",
    0,
  );
}

export function syncTransport(dispatch: AppDispatch) {
  syncPosition(dispatch);
}
