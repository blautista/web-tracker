import React, { PropsWithChildren } from "react";
import { TableCell } from "../Transport/StyledTableCell.tsx";
import { NoteTime } from "./instrumentsSlice.ts";
import { Typography } from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  editorCursorChanged,
  InstrumentColumn,
  selectEditorCursor,
} from "../Transport/slice/transportSlice.ts";
import { shallowEqual } from "react-redux";

interface EditorCellProps extends PropsWithChildren {
  rowIndex: number;
  columnId: InstrumentColumn;
  instrumentId: string;
}

export const EditorCell = React.memo(function EditorCell(props: EditorCellProps) {
  const dispatch = useAppDispatch();
  const { children, ...cellCursorState } = props;

  const isCursorOnCell = useAppSelector((state) => {
    const cursorState = selectEditorCursor(state) ?? {};

    return shallowEqual(cursorState, cellCursorState);
  });

  function handleClick() {
    dispatch(editorCursorChanged(cellCursorState));
  }

  return (
    <TableCell
      style={{ background: isCursorOnCell ? "lightgray" : "white", flex: 1 }}
      onClick={handleClick}
    >
      {children}
    </TableCell>
  );
});

interface NoteCellProps {
  instrumentId: string;
  noteId: NoteTime;
}

export const NoteCell = React.memo(function NoteCell(props: NoteCellProps) {
  const { instrumentId, noteId } = props;

  const note = useAppSelector(
    (state) => state.instruments.entities[instrumentId].notes.entities[noteId],
  );

  const children = note ? note.note.split("").join("-") : "---";

  return <Typography level="body-xs">{children}</Typography>;
});
