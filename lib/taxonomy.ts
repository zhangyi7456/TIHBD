export const taxonomyVersion = "1.0.0";
export const sectors = [
  "农林牧渔与食品流通","建筑、工程与地产后市场","能源、矿产与大宗材料","制造业配套与专业批发","交通物流、口岸与仓储","再生资源、环保与循环经济","医药健康与专业服务","本地生活与公共服务","二手、收藏与非标资产","商贸渠道、品牌授权与产业集群"
] as const;
const sectorMap:Record<string,typeof sectors[number]>={
  食品农业:"农林牧渔与食品流通",建筑工程:"建筑、工程与地产后市场",珠宝二手:"二手、收藏与非标资产",专业批发:"制造业配套与专业批发",物流回收:"再生资源、环保与循环经济",地方服务:"本地生活与公共服务"
};
export function classifyIndustry(category:string,name:string){
  let sector=sectorMap[category]??"商贸渠道、品牌授权与产业集群";
  if(/港口|报关|冷链|货运/.test(name)) sector="交通物流、口岸与仓储";
  if(/中药/.test(name)) sector="医药健康与专业服务";
  if(/钢材|砂石|煤炭|工业气体|成品油/.test(name)) sector="能源、矿产与大宗材料";
  if(/白酒|美妆|陶瓷.*经销/.test(name)) sector="商贸渠道、品牌授权与产业集群";
  const stageType=/屠宰|拆解|处置|制造/.test(name)?"加工/处置":/批发|贸易|经销/.test(name)?"批发/经销":/服务|维保|工程|分包|劳务/.test(name)?"服务/项目":/交易|经纪|撮合/.test(name)?"交易撮合":"综合经营";
  return {sector,industryFamily:name.replace(/专业市场|区域|一级|传统|经营性/g,"").split("/")[0],stageType,businessModel:stageType};
}
