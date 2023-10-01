import { Button, Stack, Typography } from "@mui/joy";
import { memo } from "react";
import { useAppSelector } from "../../store/store.ts";
import { selectInstrumentById } from "./instrumentsSlice.ts";

type InstrumentTableHeadProps = {
  instrumentId: string;
};

const InstrumentTableHead = memo(function InstrumentTableHead({
  instrumentId,
}: InstrumentTableHeadProps) {
  const instrument = useAppSelector((state) => selectInstrumentById(state, instrumentId));

  return (
    <Stack p={1} width={200} borderRight={1} borderBottom={1}>
      <Typography>{instrument.name}</Typography>
      <Stack direction="row" spacing={1}>
        <Button color="danger" size="sm" variant="soft">
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
