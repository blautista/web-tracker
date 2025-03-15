import { Stack, styled, Theme } from "@mui/joy";
import { memo } from "react";
import { useAppSelector } from "../../store/hooks.ts";
import { InstrumentRow } from "../instruments/InstrumentRow.tsx";
import { selectInstrumentIds } from "../instruments/instrumentsSlice.ts";
import { IndexCell } from "./IndexCell.tsx";
import { selectEditorSteppedIndex } from "./slice/transportSlice.ts";

const TableRow = styled(Stack)({
  height: 20,
});

export const TransportRow = memo(function TransportRow({
  index,
  isCurrentBeat,
}: {
  index: number;
  isCurrentBeat: boolean;
}) {
  const steppedIndex = useAppSelector(selectEditorSteppedIndex);
  const instrumentIds = useAppSelector(selectInstrumentIds);

  const isRowStepped = steppedIndex === index;

  return (
    <TableRow
      sx={(theme: Theme) => ({
        background: isRowStepped
          ? theme.palette.danger.softActiveBg
          : isCurrentBeat
            ? theme.palette.primary.softActiveBg
            : theme.palette.background.level1,
      })}
      role="row"
      direction="row"
    >
      <IndexCell index={index} />
      {instrumentIds.map((instrumentId) => (
        <InstrumentRow key={instrumentId} instrumentId={instrumentId} index={index} />
      ))}
    </TableRow>
  );
});
