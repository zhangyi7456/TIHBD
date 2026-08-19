import { describe,expect,it } from "vitest"; import { observationSchema } from "./schema";
const valid={id:"obs-1",marketCellId:"cell-1",indicatorId:"credit-gap",value:30,unit:"天",sampleSize:12,observedAt:"2026-08-19",method:"配对询价",comparisonGroup:"陌生人与老客户",sourceNote:"测试",reviewerStatus:"草稿",createdAt:"2026-08-19T00:00:00.000Z"};
describe("observation schema",()=>{it("accepts structured observations",()=>expect(observationSchema.safeParse(valid).success).toBe(true));it("rejects zero sample size",()=>expect(observationSchema.safeParse({...valid,sampleSize:0}).success).toBe(false));});
