import { memo } from "react";
import { NoteTime } from "../../instruments/instrumentsSlice.ts";
import { EditorNoteCell } from "../Cells/EditorNoteCell.tsx";
import { EditorCell } from "../Cells/EditorCell.tsx";

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
    <>
      <EditorCell rowIndex={index} columnId="note" instrumentId={instrumentId}>
        <EditorNoteCell instrumentId={instrumentId} noteId={pos} />
      </EditorCell>
      <EditorCell rowIndex={index} columnId="volume" instrumentId={instrumentId}>
        <EditorNoteCell instrumentId={instrumentId} noteId={pos} />
      </EditorCell>
    </>
  );
});
