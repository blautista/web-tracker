import React, { memo } from "react";
import { IconButton, Stack } from "@mui/joy";
import { CiPause1, CiPlay1, CiStop1 } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import {
  pauseTransport,
  selectTransportPlaybackState,
  startTransport,
  stopTransport,
} from "./transportSlice.ts";

const TransportActions = memo(function TransportActions() {
  const transportState = useAppSelector(selectTransportPlaybackState);
  const dispatch = useAppDispatch();

  return (
    <Stack direction="row">
      <IconButton
        disabled={transportState === "started"}
        onClick={() => {
          dispatch(startTransport());
        }}
      >
        <CiPlay1
          style={{ color: transportState === "started" ? "lightgray" : "green", fontSize: 20 }}
        />
      </IconButton>
      <IconButton
        disabled={transportState !== "started"}
        onClick={() => {
          dispatch(pauseTransport());
        }}
      >
        <CiPause1
          style={{ color: transportState !== "started" ? "lightgray" : "red", fontSize: 20 }}
        />
      </IconButton>
      <IconButton
        disabled={transportState === "stopped"}
        onClick={() => {
          dispatch(stopTransport());
        }}
      >
        <CiStop1
          style={{ color: transportState === "stopped" ? "lightgray" : "red", fontSize: 20 }}
        />
      </IconButton>
    </Stack>
  );
});

export default TransportActions;
