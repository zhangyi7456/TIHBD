import { z } from "zod";
import realAssetCycleJson from "@/data/asset-cycle.real.json";

export type AssetCategory = "现金" | "衍生品" | "商品" | "美元资产" | "股票" | "债券" | "另类资产";
export type AssetState = "强势" | "趋势增强" | "中性" | "趋势反转" | "风险升温";
export type AssetProvenance = "REAL" | "PROXY" | "DEMO";
export type AssetDataStatus = "OK" | "MISSING" | "INSUFFICIENT_HISTORY";

export type AssetDefinition = {
  id: string;
  name: string;
  category: AssetCategory;
  row: number;
  metric1Label: string;
  metric2Label: string;
  seed: number;
};

export const assetCategories: Array<{ name: AssetCategory; color: string }> = [
  { name: "现金", color: "#b9d7ef" },
  { name: "衍生品", color: "#d8c7e8" },
  { name: "商品", color: "#efb2a2" },
  { name: "美元资产", color: "#a9d4c1" },
  { name: "股票", color: "#e6ed72" },
  { name: "债券", color: "#f2cf78" },
  { name: "另类资产", color: "#c8b7a4" },
];

export const assetDefinitions: AssetDefinition[] = [
  { id:"demand-deposit",name:"活期存款",category:"现金",row:1,metric1Label:"挂牌利率",metric2Label:"资金偏好",seed:2 },
  { id:"term-deposit",name:"定期存款",category:"现金",row:2,metric1Label:"1Y利率",metric2Label:"历史分位",seed:5 },
  { id:"money-fund",name:"货币基金",category:"现金",row:3,metric1Label:"7日年化",metric2Label:"规模动量",seed:8 },
  { id:"wealth-product",name:"理财产品",category:"现金",row:4,metric1Label:"业绩基准",metric2Label:"破净比例",seed:11 },
  { id:"structured-deposit",name:"结构性存款",category:"现金",row:5,metric1Label:"规模变化",metric2Label:"发行热度",seed:14 },
  { id:"ncd",name:"同业存单",category:"现金",row:6,metric1Label:"AAA收益率",metric2Label:"信用利差",seed:17 },
  { id:"stock-index-future",name:"股指期货",category:"衍生品",row:1,metric1Label:"年化基差",metric2Label:"持仓分位",seed:20 },
  { id:"treasury-future",name:"国债期货",category:"衍生品",row:2,metric1Label:"主力基差",metric2Label:"持仓分位",seed:23 },
  { id:"commodity-map",name:"上证A股映射",category:"商品",row:1,metric1Label:"周期暴露",metric2Label:"历史分位",seed:26 },
  { id:"ferrous",name:"黑色",category:"商品",row:2,metric1Label:"库存动量",metric2Label:"期限结构",seed:29 },
  { id:"base-metal",name:"有色",category:"商品",row:3,metric1Label:"价格动量",metric2Label:"库存分位",seed:32 },
  { id:"precious-metal",name:"贵金",category:"商品",row:4,metric1Label:"实际利率",metric2Label:"价格分位",seed:35 },
  { id:"agriculture",name:"农产品",category:"商品",row:5,metric1Label:"价格动量",metric2Label:"库存分位",seed:38 },
  { id:"energy-chemical",name:"能化",category:"商品",row:6,metric1Label:"裂解价差",metric2Label:"库存分位",seed:41 },
  { id:"us-treasury",name:"美债",category:"美元资产",row:1,metric1Label:"10Y收益率",metric2Label:"期限利差",seed:44 },
  { id:"china-usd-bond",name:"中资美元债",category:"美元资产",row:2,metric1Label:"信用利差",metric2Label:"违约压力",seed:47 },
  { id:"us-equity",name:"美股",category:"美元资产",row:3,metric1Label:"风险溢价",metric2Label:"估值分位",seed:50 },
  { id:"consumption",name:"消费",category:"股票",row:1,metric1Label:"ERP",metric2Label:"估值分位",seed:53 },
  { id:"chinext",name:"创业板",category:"股票",row:2,metric1Label:"ERP",metric2Label:"估值分位",seed:56 },
  { id:"cyclical-equity",name:"周期",category:"股票",row:3,metric1Label:"盈利动量",metric2Label:"估值分位",seed:59 },
  { id:"tmt",name:"TMT",category:"股票",row:4,metric1Label:"盈利动量",metric2Label:"拥挤度",seed:62 },
  { id:"financials",name:"金融",category:"股票",row:5,metric1Label:"ERP",metric2Label:"估值分位",seed:65 },
  { id:"sse-a",name:"上证A股",category:"股票",row:6,metric1Label:"ERP",metric2Label:"估值分位",seed:68 },
  { id:"utilities",name:"公用事业",category:"股票",row:7,metric1Label:"股息率",metric2Label:"拥挤度",seed:71 },
  { id:"hk-equity",name:"港股",category:"股票",row:8,metric1Label:"ERP",metric2Label:"估值分位",seed:74 },
  { id:"commercial-paper",name:"短融",category:"债券",row:1,metric1Label:"信用利差",metric2Label:"成交分位",seed:77 },
  { id:"abs",name:"ABS",category:"债券",row:2,metric1Label:"信用利差",metric2Label:"发行热度",seed:80 },
  { id:"medium-note",name:"中期票据",category:"债券",row:3,metric1Label:"信用利差",metric2Label:"成交分位",seed:83 },
  { id:"enterprise-bond",name:"企业债",category:"债券",row:4,metric1Label:"信用利差",metric2Label:"违约压力",seed:86 },
  { id:"local-bond",name:"地方债",category:"债券",row:5,metric1Label:"发行利差",metric2Label:"供给压力",seed:89 },
  { id:"treasury-policy",name:"国债及政策金融债",category:"债券",row:6,metric1Label:"10Y收益率",metric2Label:"期限利差",seed:92 },
  { id:"convertible",name:"可转债",category:"债券",row:7,metric1Label:"转股溢价",metric2Label:"估值分位",seed:95 },
  { id:"real-estate",name:"房地产",category:"另类资产",row:1,metric1Label:"价格同比",metric2Label:"库存周期",seed:98 },
  { id:"liquor",name:"酒类",category:"另类资产",row:2,metric1Label:"批价动量",metric2Label:"库存压力",seed:101 },
  { id:"art",name:"艺术品",category:"另类资产",row:3,metric1Label:"成交指数",metric2Label:"流拍比例",seed:104 },
];

const observationSchema = z.object({
  weekId: z.string().regex(/^\d{4}-W\d{2}$/),
  value: z.number().finite(),
  sourceObservationDate: z.string(),
  marketCloseAt: z.string().datetime(),
  providerAvailableAt: z.string().datetime(),
  status: z.literal("OK"),
});

const realAssetSchema = z.object({
  assetId: z.string(),
  name: z.string(),
  provenance: z.enum(["REAL", "PROXY"]),
  valueType: z.enum(["PRICE_INDEX", "PROXY_PRICE"]),
  sourceOwner: z.string(),
  provider: z.string(),
  sourceUrl: z.string().url(),
  proxyTarget: z.string().optional(),
  proxyReason: z.string().optional(),
  knownBasisRisk: z.string().optional(),
  observations: z.array(observationSchema).min(100),
});

const realDatasetSchema = z.object({
  schemaVersion: z.string(),
  algorithmVersion: z.string(),
  generatedAt: z.string().datetime(),
  snapshotRule: z.string(),
  dataMode: z.literal("MIXED_REAL_PROXY"),
  assets: z.array(realAssetSchema).length(5),
});

export const realAssetCycleData = realDatasetSchema.parse(realAssetCycleJson);
const realAssetsById = new Map(realAssetCycleData.assets.map((asset) => [asset.assetId, asset]));

export const assetWeeks = [...new Set(realAssetCycleData.assets.flatMap((asset) => asset.observations.map((item) => item.weekId)))].sort();

export function createAssetSeries(seed:number) {
  return assetWeeks.map((_,index) => 100 + Math.sin((index + seed) / 9) * (5 + seed % 6) + Math.cos((index + seed * 2) / 21) * 7 + index * ((seed % 7) - 3) / 180);
}

export function assetSnapshot(definition:AssetDefinition, weekIndex:number) {
  const realAsset=realAssetsById.get(definition.id);
  const observationsByWeek=new Map(realAsset?.observations.map((item)=>[item.weekId,item]));
  const series: Array<number|null>=realAsset
    ? assetWeeks.map((week)=>observationsByWeek.get(week)?.value??null)
    : createAssetSeries(definition.seed);
  const current=series[weekIndex]??null;
  const at=(weeks:number)=>series[weekIndex-weeks]??null;
  const rate=(weeks:number)=>current!==null&&at(weeks)!==null?((current/at(weeks)!)-1)*100:null;
  const change=rate(1);
  const momentum4=rate(4);
  const momentum13=rate(13);
  const momentum26=rate(26);
  const pastMomentum26=series.slice(0,Math.max(0,weekIndex-26)).map((value,index)=>{
    const earlier=series[index];
    const later=series[index+26];
    return earlier!==null&&later!==null?((later/earlier)-1)*100:null;
  }).filter((value):value is number=>value!==null).slice(-260);
  const percentile=momentum26!==null&&pastMomentum26.length>=104
    ? pastMomentum26.filter((value)=>value<=momentum26).length/pastMomentum26.length*100
    : null;
  let state:AssetState="中性";
  if(momentum13!==null&&momentum4!==null) {
    if(momentum13>5) state="强势";
    else if(momentum13>1.5&&momentum4>momentum13/3) state="趋势增强";
    else if(momentum13<-5) state="风险升温";
    else if(momentum4>1.2&&momentum13<0) state="趋势反转";
  }
  const observation=realAsset?observationsByWeek.get(assetWeeks[weekIndex]):undefined;
  const provenance:AssetProvenance=realAsset?.provenance??"DEMO";
  const dataStatus:AssetDataStatus=current===null?"MISSING":percentile===null?"INSUFFICIENT_HISTORY":"OK";
  return {
    series,current,change,momentum4,momentum13,momentum26,percentile,state,
    metric1:momentum13,metric2:percentile,
    metric1Label:realAsset?"13周动量":definition.metric1Label,
    metric2Label:realAsset?"26周动量分位":definition.metric2Label,
    provenance,dataStatus,
    sourceObservationDate:observation?.sourceObservationDate??null,
    providerAvailableAt:observation?.providerAvailableAt??null,
    sourceOwner:realAsset?.sourceOwner??"确定性演示生成器",
    provider:realAsset?.provider??"本地演示序列",
    sourceUrl:realAsset?.sourceUrl??null,
    valueType:realAsset?.valueType??"DEMO_INDEX",
    proxyReason:realAsset?.proxyReason??null,
    knownBasisRisk:realAsset?.knownBasisRisk??null,
  };
}
