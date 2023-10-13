import { Button, Stack, Typography } from "@mui/joy";
import { memo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import {
  muteInstrument,
  selectInstrumentById,
  toggleInstrumentMute,
  unmuteInstrument,
} from "./instrumentsSlice.ts";

type InstrumentTableHeadProps = {
  instrumentId: string;
};

const InstrumentTableHead = memo(function InstrumentTableHead({
  instrumentId,
}: InstrumentTableHeadProps) {
  const instrument = useAppSelector((state) => selectInstrumentById(state, instrumentId));
  const dispatch = useAppDispatch();
  const muted = instrument.playback.mute;

  function handleMuteClick() {
    if (muted) {
      dispatch(unmuteInstrument({ instrumentId }));
    } else {
      dispatch(muteInstrument({ instrumentId }));
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
        <Button color="warning" size="sm" variant="soft">
          S
        </Button>
      </Stack>
    </Stack>
  );
});

export default InstrumentTableHead;
