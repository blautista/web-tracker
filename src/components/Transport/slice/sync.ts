import { AppDispatch } from "../../../store/store";
import { transportPositionChanged, transportStateChanged } from "./transportSlice";
import * as Tone from "tone";
import { getQuantizedTransportPosition } from "./utils";

function syncPlayback(dispatch: AppDispatch) {
  function handlePlaybackEvent() {
    dispatch(transportStateChanged(Tone.getTransport().state));
  }

  Tone.getTransport().on("start", handlePlaybackEvent);
  Tone.getTransport().on("stop", handlePlaybackEvent);
  Tone.getTransport().on("pause", handlePlaybackEvent);
}

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
  syncPlayback(dispatch);
  syncPosition(dispatch);
}
