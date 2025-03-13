import { Stack } from "@mui/joy";
import { memo } from "react";
import { EditorCell, NoteCell } from "./NoteCell.tsx";
import { NoteTime } from "./instrumentsSlice.ts";

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
      <EditorCell rowIndex={index} columnId="note" instrumentId={instrumentId}>
        <NoteCell instrumentId={instrumentId} noteId={pos} />
      </EditorCell>
      <EditorCell rowIndex={index} columnId="volume" instrumentId={instrumentId}>
        <NoteCell instrumentId={instrumentId} noteId={pos} />
      </EditorCell>
    </Stack>
  );
});
