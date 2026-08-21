import { describe, expect, it } from "vitest";
import { assetCategories, assetDefinitions, assetSnapshot, assetWeeks, createAssetSeries } from "./asset-cycle";

describe("asset cycle visual prototype",()=>{
  it("keeps seven fixed categories and unique grid positions",()=>{
    expect(assetCategories).toHaveLength(7);
    const positions=assetDefinitions.map((asset)=>`${asset.category}-${asset.row}`);
    expect(new Set(positions).size).toBe(positions.length);
  });

  it("provides more than three years of deterministic weekly history",()=>{
    expect(assetWeeks.length).toBeGreaterThanOrEqual(156);
    expect(createAssetSeries(12)).toEqual(createAssetSeries(12));
  });

  it("calculates a bounded percentile and complete momentum snapshot",()=>{
    const snapshot=assetSnapshot(assetDefinitions[0],assetWeeks.length-1);
    expect(snapshot.percentile).toBeGreaterThanOrEqual(0);
    expect(snapshot.percentile).toBeLessThanOrEqual(100);
    expect(Number.isFinite(snapshot.momentum26)).toBe(true);
  });
});
