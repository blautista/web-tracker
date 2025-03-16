import { expect, test } from "vitest";
import { barsBeatsSixteenthsToTransportIndex, transportIndexToBarsBeatsSixteenths } from "./utils";

test("barsBeatsSixteenthsToTransportIndex", () => {
  expect(barsBeatsSixteenthsToTransportIndex("0:0:3")).toBe(3);
  expect(barsBeatsSixteenthsToTransportIndex("0:1:0")).toBe(4);
  expect(barsBeatsSixteenthsToTransportIndex("1:0:0")).toBe(16);
});

test("transportIndexToBarsBeatsSixteenths", () => {
  expect(transportIndexToBarsBeatsSixteenths(3)).toBe("0:0:3");
  expect(transportIndexToBarsBeatsSixteenths(4)).toBe("0:1:0");
  expect(transportIndexToBarsBeatsSixteenths(16)).toBe("1:0:0");
});
