import * as Tone from "tone";
import { CursorState, InstrumentColumn } from "./transportSlice";

export function getQuantizedTransportPosition(time: number) {
  const offset = Tone.Time().toSeconds() - time;
  const tPos = Tone.TransportTime().toSeconds() - offset;
  return Tone.Time(tPos).toBarsBeatsSixteenths();
}

/**
 * Obtains the row index of the tracker respective to a NoteTime
 * @param time The bars-beats-sixteenths notetime
 * @returns The index
 *
 * @example
 * const index = barsBeatsSixteenthsToTransportIndex('0:0:3') // -> 3
 */
export function barsBeatsSixteenthsToTransportIndex(time: string): number {
  const [bar, beats, sixteenths] = time.split(":");
  let sum = Number(bar) * 4 * 4;

  if (beats) {
    sum += Number.parseInt(beats) * 4;
  }

  if (sixteenths) {
    sum += Number.parseInt(sixteenths);
  }

  return sum;
}

export function transportIndexToBarsBeatsSixteenths(index: number): string {
  const offsetIndex = index;
  const sixteenths = offsetIndex % 4;
  const beats = Math.floor(offsetIndex / 4) % 4;
  const bars = Math.floor(offsetIndex / 16);

  return `${bars}:${beats}:${sixteenths}`;
}

export const makeCellId = ({ instrumentId, columnId, rowIndex }: CursorState) =>
  `${instrumentId}-${rowIndex}-${columnId}`;

export function decodeCellId(cellId: string): CursorState {
  const [instrumentId, rowIndex, columnId] = cellId.split("-");

  return {
    instrumentId,
    rowIndex: Number.parseInt(rowIndex),
    columnId: columnId as InstrumentColumn,
  };
}
