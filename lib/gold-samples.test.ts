import { describe, expect, it } from "vitest";
import { goldSamples, marketCells } from "./data";

describe("gold sample cohort", () => {
  it("contains five paired comparisons", () => {
    expect(goldSamples).toHaveLength(5);
    expect(goldSamples.every((sample) => sample.cells.length === 2)).toBe(true);
  });

  it("references unique, existing market cells", () => {
    const ids = goldSamples.flatMap((sample) => sample.cellIds);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => marketCells.some((cell) => cell.id === id))).toBe(true);
  });

  it("keeps all first-stage samples explicitly uncalibrated", () => {
    expect(goldSamples.every((sample) => sample.status === "候选")).toBe(true);
  });
});
