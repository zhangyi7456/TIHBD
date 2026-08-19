import { describe, expect, it } from "vitest";
import { aggregateClaims, calculateEEB, calculateOutsiderPenalty, classifyQuadrant, confidenceFromEvidence, evidenceWeight, smoothEEB } from "./algorithm";
describe("EEB bottleneck model", () => {
  it("keeps a single extreme bottleneck visible", () => expect(calculateEEB({ rbi:30,sbi:100,cbi:30,bpi:20 })).toBe(74.6));
  it("returns 60 for balanced scores", () => expect(calculateEEB({ rbi:60,sbi:60,cbi:60,bpi:50 })).toBe(60));
  it("clamps invalid numeric inputs", () => expect(calculateEEB({ rbi:-10,sbi:120,cbi:30,bpi:0 })).toBe(68.3));
  it("classifies high and bypassable markets", () => expect(classifyQuadrant({ rbi:90,sbi:70,cbi:90,bpi:70 })).toBe("高壁垒·可重构"));
});
describe("outsider penalty",()=>{
  it("weights credit more heavily",()=>expect(calculateOutsiderPenalty({price:0,credit:100,quality:0,information:0,liquidation:0})).toBe(25));
  it("returns 100 at the upper bound",()=>expect(calculateOutsiderPenalty({price:100,credit:100,quality:100,information:100,liquidation:100})).toBe(100));
});
describe("evidence engine v1",()=>{
  const base={grade:"A" as const,directness:1,generalizable:true,ageYears:0,methodQuality:1};
  it("moves estimates in both directions",()=>{expect(aggregateClaims(50,[{...base,direction:"支持",independenceGroupId:"a"}]).estimate).toBeGreaterThan(50);expect(aggregateClaims(50,[{...base,direction:"反驳",independenceGroupId:"b"}]).estimate).toBeLessThan(50)});
  it("widens intervals when claims conflict",()=>{const aligned=aggregateClaims(50,[{...base,direction:"支持",independenceGroupId:"a"}]);const conflict=aggregateClaims(50,[{...base,direction:"支持",independenceGroupId:"a"},{...base,direction:"反驳",independenceGroupId:"b"}]);expect(conflict.upper-conflict.lower).toBeGreaterThan(aligned.upper-aligned.lower)});
  it("deduplicates evidence groups",()=>expect(aggregateClaims(50,[{...base,direction:"支持",independenceGroupId:"a"},{...base,direction:"支持",independenceGroupId:"a"}]).effectiveEvidenceCount).toBe(1));
  it("provides a smooth bottleneck estimate",()=>expect(smoothEEB({rbi:60,sbi:60,cbi:60,bpi:0})).toBe(60));
});
describe("evidence confidence", () => {
  it("keeps unsupported priors at 0.35", () => expect(confidenceFromEvidence([])).toBe(.35));
  it("weights A evidence above D evidence", () => expect(evidenceWeight({grade:"A",directness:1,generalizable:true,ageYears:0})).toBeGreaterThan(evidenceWeight({grade:"D",directness:1,generalizable:true,ageYears:0})));
  it("caps confidence below certainty", () => expect(confidenceFromEvidence(Array(20).fill({grade:"A",directness:1,generalizable:true,ageYears:0}))).toBe(.95));
});
