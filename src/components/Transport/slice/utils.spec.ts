import { expect, test } from "vitest";
import { barsBeatsSixteenthsToTransportIndex } from "./utils";

test("barsBeatsSixteenthsToTransportIndex", () => {
  expect(barsBeatsSixteenthsToTransportIndex("0:0:3")).toBe(2);
  expect(barsBeatsSixteenthsToTransportIndex("0:1:0")).toBe(3);
  expect(barsBeatsSixteenthsToTransportIndex("1:0:0")).toBe(15);
});
