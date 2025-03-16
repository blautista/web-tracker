import clsx from "clsx";
import { PropsWithChildren } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import {
  CursorState,
  editorCursorChanged,
  selectIsCellSelected,
} from "../../Transport/slice/transportSlice.ts";
import { makeCellId } from "../../Transport/slice/utils.ts";

interface EditorCellProps extends PropsWithChildren, CursorState {}

export function EditorCell({ children, ...cellCursorState }: EditorCellProps) {
  const dispatch = useAppDispatch();

  const selected = useAppSelector((state) =>
    selectIsCellSelected(state, makeCellId(cellCursorState)),
  );

  function handleClick() {
    dispatch(editorCursorChanged(cellCursorState));
  }

  return (
    <td className={clsx("editorCell", { selected })} onClick={handleClick}>
      <div className="editorCellContainer">{children}</div>
    </td>
  );
}
