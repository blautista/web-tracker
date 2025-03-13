import { Stack, styled } from "@mui/joy";
import { KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { selectInstrumentIds } from "../instruments/instrumentsSlice.ts";
import InstrumentTableHead from "../instruments/InstrumentTableHead.tsx";
import { selectTransportIndexPosition, stepTransportCursor } from "./slice/transportSlice.ts";
import TransportActions from "./TransportActions.tsx";
import { TransportRow } from "./TransportRow.tsx";

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
  const dispatch = useAppDispatch();
  const currentTransportIndex = useAppSelector((state) => selectTransportIndexPosition(state));

  const handleKeydown = (e: KeyboardEvent) => {
    const keyToDirection = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowRight: "right",
      ArrowLeft: "left",
    } as const;

    const direction = keyToDirection[e.key as keyof typeof keyToDirection];

    if (direction) {
      dispatch(stepTransportCursor(direction));
    }
  };

  return (
    <Stack>
      <TransportActions />
      <TableContainer alignItems="start" tabIndex={0} onKeyDown={handleKeydown}>
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
