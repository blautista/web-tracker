import { IconButton, Stack, Typography } from "@mui/joy";
import { memo } from "react";
import { CiPause1, CiPlay1, CiStop1 } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  pauseTransport,
  selectBpm,
  selectTransportPlaybackState,
  startTransport,
  stopTransport,
} from "./slice/transportSlice.ts";

const TransportActions = memo(function TransportActions() {
  const dispatch = useAppDispatch();

  const transportState = useAppSelector(selectTransportPlaybackState);
  const bpm = useAppSelector(selectBpm);

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
      <Typography level="body-lg">{bpm} bpm</Typography>
    </Stack>
  );
});

export default TransportActions;
