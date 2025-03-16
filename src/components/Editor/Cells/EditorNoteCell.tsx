import { useAppSelector } from "../../../store/hooks.ts";

interface EditorNoteCellProps {
  instrumentId: string;
  noteId: string;
}

export function EditorNoteCell(props: EditorNoteCellProps) {
  const { instrumentId, noteId } = props;

  const { note } =
    useAppSelector((state) => state.instruments.entities[instrumentId].notes.entities[noteId]) ??
    {};

  if (!note) {
    return "---";
  }

  if (note.length === 2) {
    return note.split("").join("-");
  }

  return note;
}
