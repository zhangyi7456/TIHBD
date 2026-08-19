import { z } from "zod";

export const categorySchema = z.enum(["食品农业","建筑工程","珠宝二手","专业批发","物流回收","地方服务"]);
export const industrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), name: z.string().min(2), category: categorySchema,
  rbi: z.number().min(0).max(100), sbi: z.number().min(0).max(100), cbi: z.number().min(0).max(100),
  bpi: z.number().min(0).max(100), confidence: z.literal(0.35), status: z.literal("研究先验"),
  mechanism: z.string(), killPoint: z.string(), oldGatekeeper: z.string(), newGatekeeper: z.string(), trend: z.enum(["下降","缓慢下降","稳定"])
});
export const industriesSchema = z.array(industrySchema).min(1);
export type Industry = z.infer<typeof industrySchema>;

export const evidenceSchema = z.object({
  id: z.string(), industryId: z.string(), title: z.string(), source: z.string(), url: z.string().url(),
  publishedAt: z.string(), grade: z.enum(["A","B","C","D"]), scope: z.string(), stage: z.string(),
  supports: z.enum(["支持","反驳","背景"]), variable: z.enum(["RBI","SBI","CBI","BPI"]),
  directness: z.number().min(0).max(1), generalizable: z.boolean(), summary: z.string(),
  claimId: z.string(), independenceGroupId: z.string(), methodQuality: z.number().min(0).max(1), reviewed: z.boolean(),
  scopeData: z.object({ country:z.string(), province:z.string().optional(), city:z.string().optional(), market:z.string().optional(), period:z.string(), channel:z.string().optional() })
});
export type Evidence = z.infer<typeof evidenceSchema>;

export const marketCellSchema = z.object({
  id: z.string(), industryId: z.string(), region: z.string(), stage: z.string(), period: z.string(),
  rbi: z.number(), sbi: z.number(), cbi: z.number(), bpi: z.number(), confidence: z.number().min(0).max(1),
  status: z.literal("研究假设"), note: z.string(),
  outsiderPenalty: z.object({ price: z.number().min(0).max(100), credit: z.number().min(0).max(100), quality: z.number().min(0).max(100), information: z.number().min(0).max(100), liquidation: z.number().min(0).max(100) })
});
export type MarketCell = z.infer<typeof marketCellSchema>;
