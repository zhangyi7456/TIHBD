import { describe, expect, it } from "vitest";
import { assetCategories, assetDefinitions, assetSnapshot, assetWeeks, createAssetSeries, realAssetCycleData } from "./asset-cycle";

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
    expect(snapshot.percentile).not.toBeNull();
    expect(snapshot.percentile!).toBeGreaterThanOrEqual(0);
    expect(snapshot.percentile!).toBeLessThanOrEqual(100);
    expect(Number.isFinite(snapshot.momentum26!)).toBe(true);
  });

  it("validates five audited real or proxy series without demo fallback",()=>{
    expect(realAssetCycleData.assets).toHaveLength(5);
    expect(realAssetCycleData.assets.filter((asset)=>asset.provenance==="REAL")).toHaveLength(4);
    expect(realAssetCycleData.assets.filter((asset)=>asset.provenance==="PROXY")).toHaveLength(1);
    expect(realAssetCycleData.assets.every((asset)=>asset.observations.length>=100)).toBe(true);
  });

  it("keeps real lineage separate from deterministic demo assets",()=>{
    const real=assetSnapshot(assetDefinitions.find((asset)=>asset.id==="sse-a")!,assetWeeks.length-1);
    const demo=assetSnapshot(assetDefinitions.find((asset)=>asset.id==="money-fund")!,assetWeeks.length-1);
    expect(real.provenance).toBe("REAL");
    expect(real.sourceObservationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(demo.provenance).toBe("DEMO");
    expect(demo.sourceObservationDate).toBeNull();
  });
});
