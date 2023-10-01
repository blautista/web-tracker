import { NoteCell } from "./NoteCell.tsx";
import { memo } from "react";
import { NoteTime } from "./instrumentsSlice.ts";
import { Stack } from "@mui/joy";

function indexToTransportPosition(i: number): NoteTime {
  return `${Math.floor(i / 16)}:${Math.floor(i / 4) % 4}:${i % 4}`;
}

export const InstrumentRow = memo(function InstrumentRow({
  instrumentId,
  index,
}: {
  instrumentId: string;
  index: number;
}) {
  const pos = indexToTransportPosition(index);

  return (
    <Stack direction="row" width={200} borderRight={1} borderBottom={1}>
      <NoteCell instrumentId={instrumentId} noteId={pos} />
    </Stack>
  );
});
