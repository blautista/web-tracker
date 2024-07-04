import { selectInstrumentIds } from "../instruments/instrumentsSlice.ts";
import { IndexCell } from "./IndexCell.tsx";
import { memo } from "react";
import { Stack, styled } from "@mui/joy";
import { InstrumentRow } from "../instruments/InstrumentRow.tsx";
import { useAppSelector } from "../../store/hooks.ts";

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
  const instrumentIds = useAppSelector(selectInstrumentIds);

  return (
    <TableRow
      sx={
        isCurrentBeat
          ? (theme) => ({ background: theme.palette.primary.softActiveBg })
          : (theme) => ({ background: theme.palette.background.level1 })
      }
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
