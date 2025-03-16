import { useAppSelector } from "../../../store/hooks.ts";
import { NoteTime } from "../../instruments/instrumentsSlice.ts";

interface EditorNoteCellProps {
  instrumentId: string;
  noteId: NoteTime;
}

export function EditorNoteCell(props: EditorNoteCellProps) {
  const { instrumentId, noteId } = props;

  const note = useAppSelector(
    (state) => state.instruments.entities[instrumentId].notes.entities[noteId],
  );

  if (note) {
    return note.note.split("").join("-");
  }

  return "---";
}
