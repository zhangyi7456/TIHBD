# TIHBD

[在线预览](https://zhangyi7456.github.io/TIHBD/)

Traditional Industry Hidden Barrier Database / 中国传统行业隐形控制网络地图。

这是一个研究型 Web V1，用来比较圈外人进入传统行业时面对的关系、结构和认知壁垒，以及数字化绕过潜力。当前 52 个行业条目均为“研究先验 · 置信度 0.35 · 待证据校准”，不是官方统计或事实排名。

## 开发

```bash
npm install
npm run dev
```

质量检查：

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`main` 分支推送后，GitHub Actions 会运行检查、生成静态站点并自动发布到 GitHub Pages。

## 路由

- `/`：概览、壁垒排行、EEB × BPI 象限
- `/industries`：搜索、分类筛选与排序矩阵
- `/market-cells`：行业 × 地区 × 环节 × 时间的研究单元
- `/market-cells/[id]`：单元壁垒、圈外人惩罚、守门人迁移和验证计划
- `/compare`：两个 Market Cell 的对齐比较工作区
- `/gatekeepers`：传统守门人向数字或制度化守门人的迁移账本
- `/industry/[id]`：行业壁垒指纹、守门人迁移、证据状态和证伪条件
- `/evidence`：证据等级与登记规范
- `/methodology`：指标体系、瓶颈算法与伦理边界

## 评分

`W = 0.38RBI + 0.34SBI + 0.28CBI`

`EEB = 0.55W + 0.45 × max(RBI, SBI, CBI)`

BPI 为绕过潜力反变量，当前不直接进入 EEB。

证据置信度使用证据等级、直接性、新鲜度和可推广范围计算，并以 0.95 封顶，避免把模型输出包装成确定事实。Web V1 内置 3 条可核验来源和 6 个研究假设单元，用于验证数据链路，不代表证据覆盖已经完整。

Outsider Penalty（OP）由价格、账期、好货获得、信息和库存变现五项惩罚构成。当前权重分别为 15%、25%、20%、20%、20%，所有单元数值仍属于研究假设。
