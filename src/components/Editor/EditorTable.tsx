import { Stack } from "@mui/joy";
import { KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { editingToggled, stepTransportCursor } from "../Transport/slice/transportSlice.ts";
import InstrumentTableHead from "../instruments/InstrumentTableHead.tsx";
import { selectInstrumentIds } from "../instruments/instrumentsSlice.ts";
import { EditorRow } from "./Row/EditorRow.tsx";
import "./EditorTable.css";

const indexValues = Array(64)
  .fill(0)
  .map((_, i) => i);

function TransportHead() {
  const allInstruments = useAppSelector(selectInstrumentIds);

  return (
    <Stack
      direction="row"
      ml="30px"
      sx={(theme) => ({
        background: theme.palette.background.body,
      })}
    >
      {allInstruments.map((id) => (
        <InstrumentTableHead key={id} instrumentId={id} />
      ))}
    </Stack>
  );
}

function useEditorKeydown() {
  const dispatch = useAppDispatch();

  return (e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    switch (e.code) {
      case "Space":
        dispatch(editingToggled());
        break;

      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight": {
        const keyToDirection = {
          ArrowUp: "up",
          ArrowDown: "down",
          ArrowRight: "right",
          ArrowLeft: "left",
        } as const;

        const direction = keyToDirection[e.key as keyof typeof keyToDirection];
        dispatch(stepTransportCursor(direction));
        break;
      }
    }
  };
}

function EditorTable() {
  const handleKeydown = useEditorKeydown();

  return (
    <table className="editorTable" tabIndex={0} onKeyDown={handleKeydown}>
      <tbody>
        {indexValues.map((_, index) => {
          return <EditorRow index={index} key={index} />;
        })}
      </tbody>
    </table>
  );
}

export default EditorTable;
