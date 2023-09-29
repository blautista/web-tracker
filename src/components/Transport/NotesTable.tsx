import styled from "@emotion/styled";
import * as Tone from "tone";
import { NoteCell } from "./NoteCell.tsx";
import { IndexCell } from "./IndexCell.tsx";
import { TableCell } from "./StyledTableCell.tsx";
import { useAppSelector } from "../../store/store.ts";
import TransportActions from "./TransportActions.tsx";
import { selectTransportIndexPosition } from "./transportSlice.ts";
import { Stack } from "@mui/joy";

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  background: lightgray;
  width: 400px;
`;

const TableRow = styled.div`
  display: flex;
  height: 20px;
`;

function getHexValues(until: number) {
  return Array(until)
    .fill(0)
    .map((_, i) => {
      const hex = i.toString(16);
      return hex.padStart(2, "0");
    });
}

type Note = { time: string; note: string };
type Notes = Note[];

function barsBeatsSixteenthsToIndex(str: string): number {
  const [bar, beats, sixteenths] = str.split(":");
  let sum = Number(bar) * 4 * 4;

  if (beats) {
    sum += parseInt(beats) * 4;
  }

  if (sixteenths) {
    sum += parseInt(sixteenths);
  }

  return sum - 1;
}

const pianoNotes: Notes = [
  { time: "0:0:2", note: "C4" },
  { time: "0:1", note: "C4" },
  { time: "0:1:3", note: "D4" },
  { time: "0:2:2", note: "C4" },
  { time: "0:3", note: "C4" },
  { time: "0:3:2", note: "G3" },
];

const keys = new Tone.PolySynth(Tone.Synth, {
  volume: -8,
  oscillator: {
    partials: [1, 2, 1],
  },
}).toDestination();

const pianoPart = new Tone.Part((time, chord) => {
  keys.triggerAttackRelease(chord.note, "8n", time);
}, pianoNotes).start(0);

pianoPart.loop = 2;

Tone.Transport.bpm.value = 120;
pianoPart.loopEnd = "1m";

const notes = pianoNotes.map((note) => ({ i: barsBeatsSixteenthsToIndex(note.time), ...note }));
const indexValues = getHexValues(100);

let a = performance.now();

function NotesTable() {
  const currentBeat = useAppSelector((state) => selectTransportIndexPosition(state));
  console.log(performance.now() - a);
  a = performance.now();
  return (
    <Stack>
      <TransportActions />
      <TableContainer>
        {indexValues.map((e, i) => {
          const relatedNote = notes.find((note) => note.i === i);

          const style = currentBeat === i ? { background: "red" } : {};
          return (
            <TableRow style={style} key={i}>
              <IndexCell>{e.toUpperCase()}</IndexCell>
              <NoteCell>{relatedNote ? relatedNote.note.split("").join("-") : "---"}</NoteCell>
              <TableCell>---</TableCell>
            </TableRow>
          );
        })}
      </TableContainer>
    </Stack>
  );
}

export default NotesTable;
