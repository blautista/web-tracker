import { Stack, Theme } from "@mui/joy";
import { useAppSelector } from "../../store/hooks.ts";
import InstrumentTableHead from "../instruments/InstrumentTableHead.tsx";
import { selectInstrumentIds } from "../instruments/instrumentsSlice.ts";
import "./EditorTable.css";

export function TransportHead() {
  const allInstruments = useAppSelector(selectInstrumentIds);

  return (
    <Stack
      direction="row"
      ml="30px"
      sx={(theme: Theme) => ({
        background: theme.palette.background.body,
      })}
    >
      {allInstruments.map((id) => (
        <InstrumentTableHead key={id} instrumentId={id} />
      ))}
    </Stack>
  );
}
