import { Stack } from "@mui/joy";
import { KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  addNoteInCursor,
  editingToggled,
  stepTransportCursor,
} from "../Transport/slice/transportSlice.ts";
import InstrumentTableHead from "../instruments/InstrumentTableHead.tsx";
import { selectInstrumentIds } from "../instruments/instrumentsSlice.ts";
import "./EditorTable.css";
import { EditorRow } from "./Row/EditorRow.tsx";

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

const keyboardCodeNoteMap = {
  KeyZ: "C",
  KeyS: "C#",
  KeyX: "D",
  KeyD: "D#",
  KeyC: "E",
  KeyV: "F",
  KeyG: "F#",
  KeyB: "G",
  KeyH: "G#",
  KeyN: "A",
  KeyJ: "A#",
  KeyM: "B",
};

function keyboardCodeToNote(code: string): string | undefined {
  return keyboardCodeNoteMap[code as keyof typeof keyboardCodeNoteMap];
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

    const note = keyboardCodeToNote(e.code);

    if (note) {
      dispatch(addNoteInCursor({ note }));
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
