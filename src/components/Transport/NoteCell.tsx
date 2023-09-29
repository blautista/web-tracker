import React from "react";
import { TableCell } from "./StyledTableCell.tsx";

export const NoteCell = React.memo(function NoteCell({ children }: { children: string }) {
  return <TableCell>{children}</TableCell>;
});
