import { EditorNoteCell } from "../Cells/EditorNoteCell.tsx";
import { EditorCell } from "../Cells/EditorCell.tsx";
import { transportIndexToBarsBeatsSixteenths } from "../../Transport/slice/utils.ts";

interface InstrumentRowProps {
  instrumentId: string;
  index: number;
}

export function InstrumentRow({ instrumentId, index }: InstrumentRowProps) {
  const pos = transportIndexToBarsBeatsSixteenths(index);

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
}
