import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourceDefinitions = [
  { assetId:"sse-a",symbol:"sh000002",name:"上证A股指数",provenance:"REAL",valueType:"PRICE_INDEX",sourceOwner:"上海证券交易所",provider:"腾讯财经公开行情接口",sourceUrl:"https://www.sse.com.cn/market/sseindex/indexlist/s/i000002/",maxAgeDays:10 },
  { assetId:"chinext",symbol:"sz399006",name:"创业板指数",provenance:"REAL",valueType:"PRICE_INDEX",sourceOwner:"深圳证券信息有限公司",provider:"腾讯财经公开行情接口",sourceUrl:"https://www.szse.cn/market/trend/index.html",maxAgeDays:10 },
  { assetId:"hk-equity",symbol:"hkHSI",name:"恒生指数",provenance:"REAL",valueType:"PRICE_INDEX",sourceOwner:"恒生指数有限公司",provider:"腾讯财经公开行情接口",sourceUrl:"https://www.hsi.com.hk/eng/indexes/all-indexes/hsi",maxAgeDays:10 },
  { assetId:"us-equity",symbol:"usINX",name:"S&P 500",provenance:"REAL",valueType:"PRICE_INDEX",sourceOwner:"S&P Dow Jones Indices",provider:"腾讯财经公开行情接口",sourceUrl:"https://www.spglobal.com/spdji/en/indices/equity/sp-500/",maxAgeDays:10 },
  { assetId:"treasury-policy",symbol:"sh511260",name:"十年国债ETF国泰",provenance:"PROXY",valueType:"PROXY_PRICE",sourceOwner:"上海证券交易所",provider:"腾讯财经公开行情接口",sourceUrl:"https://www.sse.com.cn/assortment/fund/list/info/market/index.shtml?FUNDID=511260",maxAgeDays:10,proxyTarget:"中国国债总回报",proxyReason:"官方国债总财富指数的稳定公开历史接口与再发布授权尚未落实；ETF价格为可交易真实代理。",knownBasisRisk:"包含基金费用、跟踪误差、流动性和久期偏差，不等于10年国债收益率或国债总财富指数。" },
];

function isoWeek(dateText) {
  const date=new Date(`${dateText}T12:00:00Z`);
  const thursday=new Date(date);
  const day=(date.getUTCDay()+6)%7;
  thursday.setUTCDate(date.getUTCDate()-day+3);
  const firstThursday=new Date(Date.UTC(thursday.getUTCFullYear(),0,4,12));
  const firstDay=(firstThursday.getUTCDay()+6)%7;
  firstThursday.setUTCDate(firstThursday.getUTCDate()-firstDay+3);
  const week=1+Math.round((thursday-firstThursday)/604800000);
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2,"0")}`;
}

function timestamps(definition,dateText) {
  const marketCloseAt=definition.symbol.startsWith("us")?`${dateText}T20:00:00Z`:`${dateText}T07:00:00Z`;
  const providerAvailableAt=definition.symbol.startsWith("us")?`${dateText}T23:00:00Z`:`${dateText}T09:00:00Z`;
  return {marketCloseAt,providerAvailableAt};
}

async function fetchDaily(definition) {
  const endpoint=`http://web.ifzq.gtimg.cn/appstock/app/kline/kline?param=${definition.symbol},day,,,1023`;
  const response=await fetch(endpoint,{redirect:"follow",headers:{"user-agent":"TIHBD asset-cycle updater/0.2"}});
  if(!response.ok) throw new Error(`${definition.symbol}: HTTP ${response.status}`);
  const json=await response.json();
  const container=json.data?.[definition.symbol]??json.data?.[definition.symbol.replace("usINX","us.INX")];
  const rows=container?.day;
  if(!Array.isArray(rows)||rows.length<100) throw new Error(`${definition.symbol}: insufficient rows`);
  return rows.map(([date,open,close,high,low,volume])=>({date,open:Number(open),close:Number(close),high:Number(high),low:Number(low),volume:Number(volume)})).filter((row)=>Number.isFinite(row.close));
}

function aggregateWeekly(definition,daily) {
  const byWeek=new Map();
  for(const row of daily) byWeek.set(isoWeek(row.date),row);
  return [...byWeek.entries()].map(([weekId,row])=>({weekId,value:row.close,sourceObservationDate:row.date,...timestamps(definition,row.date),status:"OK"}));
}

const assets=[];
for(const definition of sourceDefinitions) {
  const daily=await fetchDaily(definition);
  assets.push({...definition,rawFrequency:"DAILY",displayFrequency:"WEEKLY_LAST_VALID_CLOSE",timezone:definition.symbol.startsWith("us")?"America/New_York":"Asia/Shanghai",observations:aggregateWeekly(definition,daily)});
}

const output={schemaVersion:"1.0.0",algorithmVersion:"asset-weekly-asof-v1",generatedAt:new Date().toISOString(),snapshotRule:"观察周后的周一08:00 Asia/Shanghai；仅使用providerAvailableAt不晚于snapshotAsOf的记录",dataMode:"MIXED_REAL_PROXY",assets};
await writeFile(resolve("data/asset-cycle.real.json"),`${JSON.stringify(output,null,2)}\n`,"utf8");
console.log(`updated ${assets.length} assets / ${assets.reduce((sum,item)=>sum+item.observations.length,0)} weekly observations`);
