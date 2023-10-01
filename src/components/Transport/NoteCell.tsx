import React from "react";
import { TableCell } from "./StyledTableCell.tsx";
import { useAppSelector } from "../../store/store.ts";
import { NoteTime } from "./instrumentsSlice.ts";

type NoteCellProps = { instrumentId: string; noteId: NoteTime };

export const NoteCell = React.memo(function NoteCell(props: NoteCellProps) {
  const { instrumentId, noteId } = props;

  const note = useAppSelector(
    (state) => state.instruments.entities[instrumentId].notes.entities[noteId],
  );
  console.log(note);

  const children = note ? note.note.split("").join("-") : "---";

  return <TableCell>{children}</TableCell>;
});
