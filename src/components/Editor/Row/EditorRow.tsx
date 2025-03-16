import clsx from "clsx";
import { useAppSelector } from "../../../store/hooks.ts";
import {
  selectEditorSteppedIndex,
  selectIsEditing,
  selectTransportIndexPosition,
} from "../../Transport/slice/transportSlice.ts";
import { selectInstrumentIds } from "../../instruments/instrumentsSlice.ts";
import { EditorIndexCell } from "../Cells/EditorIndexCell.tsx";
import { InstrumentRow } from "./InstrumentRow.tsx";

interface EditorRowProps {
  index: number;
}

export function EditorRow({ index }: EditorRowProps) {
  const steppedIndex = useAppSelector(selectEditorSteppedIndex);
  const instrumentIds = useAppSelector(selectInstrumentIds);
  const transportIndex = useAppSelector(selectTransportIndexPosition);
  const isEditing = useAppSelector(selectIsEditing);

  const selected = steppedIndex === index;
  const playing = transportIndex === index;
  const editing = selected && isEditing;

  return (
    <tr className={clsx("editorRow", { selected, playing, editing })}>
      <EditorIndexCell index={index} />
      {instrumentIds.map((instrumentId) => (
        <InstrumentRow key={instrumentId} instrumentId={instrumentId} index={index} />
      ))}
    </tr>
  );
}
