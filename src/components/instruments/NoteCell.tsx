import React from "react";
import { TableCell } from "../Transport/StyledTableCell.tsx";
import { NoteTime } from "./instrumentsSlice.ts";
import { Typography } from "@mui/joy";
import { useAppSelector } from "../../store/hooks.ts";

type NoteCellProps = { instrumentId: string; noteId: NoteTime };

export const NoteCell = React.memo(function NoteCell(props: NoteCellProps) {
  const { instrumentId, noteId } = props;

  const note = useAppSelector(
    (state) => state.instruments.entities[instrumentId].notes.entities[noteId],
  );

  const children = note ? note.note.split("").join("-") : "---";

  return (
    <TableCell>
      <Typography level="body-xs">{children}</Typography>
    </TableCell>
  );
});
