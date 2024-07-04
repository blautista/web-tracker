import TransportActions from "./TransportActions.tsx";
import { selectTransportIndexPosition } from "./slice/transportSlice.ts";
import { Stack, styled } from "@mui/joy";
import { TransportRow } from "./TransportRow.tsx";
import { selectInstrumentIds } from "../instruments/instrumentsSlice.ts";
import InstrumentTableHead from "../instruments/InstrumentTableHead.tsx";
import { useAppSelector } from "../../store/hooks.ts";

const TableContainer = styled(Stack)(({ theme }) => ({
  color: theme.palette.text.primary,
  background: theme.palette.background.level2,
  width: 800,
}));

const indexValues = Array(64)
  .fill(0)
  .map((_, i) => i);

function TransportHead() {
  const allInstruments = useAppSelector(selectInstrumentIds);

  return (
    <Stack
      direction="row"
      ml="30px"
      sx={(theme) => ({
        background: theme.palette.background.body,
      })}
    >
      {allInstruments.map((id) => (
        <InstrumentTableHead key={id} instrumentId={id} />
      ))}
    </Stack>
  );
}

function NotesTable() {
  const currentTransportIndex = useAppSelector((state) => selectTransportIndexPosition(state));

  return (
    <Stack>
      <TransportActions />
      <TableContainer alignItems="start">
        <TransportHead />
        {indexValues.map((_, index) => {
          return (
            <TransportRow
              index={index}
              key={index}
              isCurrentBeat={index === currentTransportIndex}
            />
          );
        })}
      </TableContainer>
    </Stack>
  );
}

export default NotesTable;
