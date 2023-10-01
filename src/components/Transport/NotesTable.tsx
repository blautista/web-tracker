import styled from "@emotion/styled";
import * as Tone from "tone";
import { NoteCell } from "./NoteCell.tsx";
import { IndexCell } from "./IndexCell.tsx";
import { useAppSelector } from "../../store/store.ts";
import TransportActions from "./TransportActions.tsx";
import { selectTransportIndexPosition } from "./transportSlice.ts";
import { Stack } from "@mui/joy";
import { Notes, NoteTime, selectInstrumentIds } from "./instrumentsSlice.ts";
import { memo } from "react";

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

function numToHex(n: number) {
  const hex = n.toString(16);
  return hex.padStart(2, "0");
}

function getTransportValues(until: number) {
  return Array(until)
    .fill(0)
    .map((_, i) => {
      return indexToTransportPosition(i);
    });
}

function indexToTransportPosition(i: number): NoteTime {
  return `${Math.floor(i / 16)}:${Math.floor(i / 4) % 4}:${i % 4}`;
}

const pianoNotes: Notes = [
  { time: "0:0:2", note: "C4" },
  { time: "0:1:0", note: "C4" },
  { time: "0:1:3", note: "D4" },
  { time: "0:2:2", note: "C4" },
  { time: "0:3:0", note: "C4" },
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

const InstrumentRow = memo(function InstrumentRow({
  instrumentId,
  index,
}: {
  instrumentId: string;
  index: number;
}) {
  const pos = indexToTransportPosition(index);

  return (
    <>
      <NoteCell instrumentId={instrumentId} noteId={pos} />
    </>
  );
});

console.log(getTransportValues(100));

const TransportRow = memo(function TransportRow({
  index,
  isCurrentBeat,
}: {
  index: number;
  isCurrentBeat: boolean;
}) {
  const instrumentIds = useAppSelector((state) => selectInstrumentIds(state.instruments));

  const style = isCurrentBeat ? { background: "red" } : {};
  const hex = numToHex(index);

  return (
    <TableRow style={style}>
      <IndexCell>{hex.toUpperCase()}</IndexCell>
      {instrumentIds.map((instrumentId) => (
        <InstrumentRow key={instrumentId} instrumentId={instrumentId} index={index} />
      ))}
    </TableRow>
  );
});

const indexValues = Array(64)
  .fill(0)
  .map((_, i) => i);

function NotesTable() {
  const currentTransportIndex = useAppSelector((state) => selectTransportIndexPosition(state));

  return (
    <Stack>
      <TransportActions />
      <TableContainer>
        {indexValues.map((_, index) => {
          return (
            <TransportRow
              index={index}
              key={index}
              isCurrentBeat={index === currentTransportIndex}
            />
          );
        })}
      </TableContainer>
    </Stack>
  );
}

export default NotesTable;
