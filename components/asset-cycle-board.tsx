"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Database, RotateCcw, TrendingUp } from "lucide-react";
import {
  assetCategories,
  assetDefinitions,
  assetSnapshot,
  assetWeeks,
  realAssetCycleData,
  type AssetState,
} from "@/lib/asset-cycle";

const windows = { "半年": 26, "1年": 52, "3年": 156 } as const;
type WindowLabel = keyof typeof windows;
type Filter = "全部资产" | "风险升温" | "趋势反转" | "趋势增强";

function formatNumber(value: number | null, digits = 1, suffix = "") {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}${suffix}`;
}

function Sparkline({ values, state }: { values: Array<number | null>; state: AssetState }) {
  const valid = values.filter((value): value is number => value !== null);
  if (valid.length < 2) return <div className="h-10 flex items-center text-[10px] text-black/40">当周无可用趋势</div>;
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;
  const points = values
    .map((value, index) => value === null ? null : `${((index / (values.length - 1)) * 100).toFixed(2)},${(36 - ((value - min) / range) * 32).toFixed(2)}`)
    .filter(Boolean)
    .join(" ");
  const stroke = state === "风险升温" ? "#a62d24" : state === "强势" || state === "趋势增强" ? "#265c47" : "#25241f";
  return <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-10 w-full" aria-hidden="true"><line x1="0" y1="36" x2="100" y2="36" stroke="rgba(0,0,0,.16)" strokeWidth=".7"/><polyline points={points} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>;
}

export function AssetCycleBoard() {
  const [windowLabel, setWindowLabel] = useState<WindowLabel>("1年");
  const [weekIndex, setWeekIndex] = useState(assetWeeks.length - 1);
  const [filter, setFilter] = useState<Filter>("全部资产");
  const assets = useMemo(() => assetDefinitions.map((definition) => ({ definition, snapshot: assetSnapshot(definition, weekIndex) })), [weekIndex]);
  const verified = assets.filter(({ snapshot }) => snapshot.provenance !== "DEMO" && snapshot.current !== null);
  const counts = assets.reduce((result, { snapshot }) => ({ ...result, [snapshot.provenance]: result[snapshot.provenance] + 1 }), { REAL: 0, PROXY: 0, DEMO: 0 });
  const missing = assets.filter(({ snapshot }) => snapshot.dataStatus === "MISSING").length;
  const strong = verified.filter(({ snapshot }) => snapshot.state === "强势" || snapshot.state === "趋势增强").length;
  const stressed = verified.filter(({ snapshot }) => snapshot.state === "风险升温").length;
  const momentumValues = verified.map(({ snapshot }) => snapshot.momentum13).filter((value): value is number => value !== null);
  const averageMomentum = momentumValues.length ? momentumValues.reduce((sum, value) => sum + value, 0) / momentumValues.length : null;
  const dates = verified.map(({ snapshot }) => snapshot.sourceObservationDate).filter((value): value is string => Boolean(value));
  const dataCutoff = dates.length ? [...dates].sort().at(-1) : null;
  const visible = (state: AssetState) => filter === "全部资产" || state === filter;

  return <div>
    <section className="border-y hairline py-5 flex flex-wrap items-end gap-5">
      <div><span className="eyebrow">趋势线窗口</span><div className="flex mt-2">{Object.keys(windows).map((label) => <button key={label} onClick={() => setWindowLabel(label as WindowLabel)} className={`px-4 py-2 text-xs border hairline -mr-px ${windowLabel === label ? "bg-black text-white" : ""}`}>{label}</button>)}</div></div>
      <label className="grow min-w-72"><span className="eyebrow flex justify-between"><span>观测周</span><b className="text-[color:var(--ink)]">{assetWeeks[weekIndex]}</b></span><input aria-label="观测周" type="range" min="0" max={assetWeeks.length - 1} value={weekIndex} onChange={(event) => setWeekIndex(Number(event.target.value))} className="w-full mt-4 accent-[color:var(--accent)]"/></label>
      <div><span className="eyebrow">状态筛选</span><select value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="block bg-transparent border-b hairline py-2 mt-1 min-w-40">{["全部资产", "风险升温", "趋势反转", "趋势增强"].map((item) => <option key={item}>{item}</option>)}</select></div>
    </section>

    <div className="py-3 border-b hairline flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[color:var(--muted)]">
      <span className="flex items-center gap-2 text-[color:var(--ink)]"><Database size={13}/><b>数据状态</b></span>
      <span>{assetWeeks[weekIndex]} · 最新观测 {dataCutoff ?? "—"}</span>
      <span>REAL（真实） {counts.REAL}</span><span>PROXY（代理） {counts.PROXY}</span><span>DEMO（演示） {counts.DEMO}</span><span>缺失 {missing}</span>
      <span className="ml-auto">数据集 {realAssetCycleData.algorithmVersion}</span>
    </div>

    <section className="grid grid-cols-2 md:grid-cols-4 border-b hairline">
      <div className="py-6 md:border-r hairline"><span className="eyebrow">当前观测周</span><b className="block serif text-3xl mt-2">{assetWeeks[weekIndex]}</b></div>
      <div className="py-6 md:px-6 md:border-r hairline"><span className="eyebrow">真实序列强势资产</span><b className="block serif text-3xl mt-2 text-[color:var(--green)]">{strong}</b></div>
      <div className="py-6 md:px-6 md:border-r hairline"><span className="eyebrow">真实序列风险升温</span><b className="block serif text-3xl mt-2 text-[color:var(--accent)]">{stressed}</b></div>
      <div className="py-6 md:pl-6"><span className="eyebrow">REAL/PROXY 13周平均动量</span><b className="block serif text-3xl mt-2">{formatNumber(averageMomentum, 1, "%")}</b></div>
    </section>

    <section className="mt-8 overflow-x-auto pb-4"><div className="min-w-[1220px]">
      <div className="grid grid-cols-7 gap-2 mb-2">{assetCategories.map((category) => <div key={category.name} className="border-t-4 border-black px-3 py-3" style={{ background: category.color }}><span className="serif text-xl">{category.name}</span><small className="float-right mt-1 text-black/55">{assets.filter(({ definition }) => definition.category === category.name).length}</small></div>)}</div>
      <div className="grid grid-cols-7 grid-rows-8 gap-2 [grid-auto-flow:column]">{assetCategories.flatMap((category, column) => assets.filter(({ definition }) => definition.category === category.name).map(({ definition, snapshot }) => {
        const sliced = snapshot.series.slice(Math.max(0, weekIndex - windows[windowLabel] + 1), weekIndex + 1);
        const isVisible = visible(snapshot.state);
        return <article key={definition.id} tabIndex={0} className={`group relative min-h-32 border border-black/45 px-3 pt-3 pb-2 transition-all duration-200 focus:z-20 hover:z-20 focus:-translate-y-1 hover:-translate-y-1 focus:shadow-[5px_6px_0_rgba(0,0,0,.18)] hover:shadow-[5px_6px_0_rgba(0,0,0,.18)] ${isVisible ? "opacity-100" : "opacity-20"} ${snapshot.provenance === "DEMO" ? "bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.12)_0,rgba(255,255,255,.12)_5px,transparent_5px,transparent_10px)]" : ""}`} style={{ gridColumn: column + 1, gridRow: definition.row, backgroundColor: category.color }}>
          <div className="flex items-start justify-between gap-2"><h3 className="font-semibold text-sm leading-4">{definition.name}</h3><span className={`text-[10px] tabular-nums ${snapshot.change !== null && snapshot.change < 0 ? "text-[#8d211a]" : "text-[#225b42]"}`}>{formatNumber(snapshot.change, 1, "%")}</span></div>
          <div className="mt-1 text-[8px] tracking-[.08em] text-black/50">{snapshot.provenance} · {snapshot.sourceObservationDate?.slice(5) ?? "演示"}</div>
          <Sparkline values={sliced} state={snapshot.state}/>
          <div className="grid grid-cols-2 gap-2 text-[10px] tabular-nums"><span>{snapshot.metric1Label}<b className="block text-xs">{formatNumber(snapshot.metric1, 1, "%")}</b></span><span>{snapshot.metric2Label}<b className="block text-xs">{snapshot.metric2 === null ? "—" : `${snapshot.metric2.toFixed(0)}%`}</b></span></div>
          <div className="flex justify-between mt-2 text-[9px] text-black/55"><span>{snapshot.dataStatus === "MISSING" ? "数据缺失" : snapshot.state}</span><span>{windowLabel}</span></div>
          <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-72 -translate-x-1/2 border border-black bg-[#fbfaf6] p-4 text-xs shadow-[7px_8px_0_rgba(0,0,0,.16)] group-hover:block group-focus:block">
            <b className="serif text-lg">{definition.name}</b><p className="mt-1 text-[color:var(--muted)]">{definition.category} · {assetWeeks[weekIndex]} · {snapshot.provenance}</p>
            <dl className="mt-3 grid grid-cols-2 gap-y-2"><dt>本周涨跌</dt><dd className="text-right">{formatNumber(snapshot.change, 2, "%")}</dd><dt>4周动量</dt><dd className="text-right">{formatNumber(snapshot.momentum4, 2, "%")}</dd><dt>13周动量</dt><dd className="text-right">{formatNumber(snapshot.momentum13, 2, "%")}</dd><dt>26周动量</dt><dd className="text-right">{formatNumber(snapshot.momentum26, 2, "%")}</dd><dt>历史分位</dt><dd className="text-right">{snapshot.percentile === null ? "样本不足" : `${snapshot.percentile.toFixed(1)}%`}</dd><dt>状态</dt><dd className="text-right">{snapshot.dataStatus}</dd></dl>
            <div className="mt-3 border-t hairline pt-3 leading-5 text-[color:var(--muted)]"><p><b className="text-[color:var(--ink)]">源所有者：</b>{snapshot.sourceOwner}</p><p><b className="text-[color:var(--ink)]">获取通道：</b>{snapshot.provider}</p><p><b className="text-[color:var(--ink)]">观测日：</b>{snapshot.sourceObservationDate ?? "不适用"}</p>{snapshot.proxyReason && <p className="mt-2 text-[#8d211a]">{snapshot.proxyReason}</p>}</div>
          </div>
        </article>;
      }))}</div>
    </div></section>

    <section className="mt-8 border-y hairline py-6 grid md:grid-cols-3 gap-7 text-sm">
      <div className="flex gap-3"><TrendingUp size={18}/><p><b>空间记忆</b><span className="block mt-1 text-[color:var(--muted)]">资产位置固定，每周只更新趋势和状态。</span></p></div>
      <div className="flex gap-3"><RotateCcw size={18}/><p><b>历史截面</b><span className="block mt-1 text-[color:var(--muted)]">只使用在当周快照时点已可用的观测；无未来数据。</span></p></div>
      <div className="flex gap-3"><AlertTriangle size={18}/><p><b>数据边界</b><span className="block mt-1 text-[color:var(--muted)]">5项真实/代理序列，其余30项是布局用演示数据；不构成投资建议。</span></p></div>
    </section>
  </div>;
}
