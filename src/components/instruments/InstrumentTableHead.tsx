import { Button, Stack, Typography } from "@mui/joy";
import { memo } from "react";
import {
  muteInstrument,
  selectInstrumentById,
  soloInstrument,
  unmuteInstrument,
  unsoloInstrument,
} from "./instrumentsSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";

type InstrumentTableHeadProps = {
  instrumentId: string;
};

const InstrumentTableHead = memo(function InstrumentTableHead({
  instrumentId,
}: InstrumentTableHeadProps) {
  const instrument = useAppSelector((state) => selectInstrumentById(state, instrumentId));
  const dispatch = useAppDispatch();

  const muted = instrument.playback.mute;
  const soloed = instrument.playback.solo;

  function handleMuteClick() {
    if (muted) {
      dispatch(unmuteInstrument(instrumentId));
    } else {
      dispatch(muteInstrument(instrumentId));
    }
  }

  function handleSoloClick() {
    if (soloed) {
      dispatch(unsoloInstrument(instrumentId));
    } else {
      dispatch(soloInstrument(instrumentId));
    }
  }

  return (
    <Stack p={1} width={200} borderRight={1} borderBottom={1}>
      <Typography>{instrument.name}</Typography>
      <Stack direction="row" spacing={1}>
        <Button
          color="danger"
          size="sm"
          variant={muted ? "solid" : "soft"}
          onClick={handleMuteClick}
        >
          M
        </Button>
        <Button
          color="warning"
          size="sm"
          variant={soloed ? "solid" : "soft"}
          onClick={handleSoloClick}
        >
          S
        </Button>
      </Stack>
    </Stack>
  );
});

export default InstrumentTableHead;
