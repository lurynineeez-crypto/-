# GLM 执行任务书：种植方舱原型集成与整理

你是执行模型，负责在现有项目里做代码改造。Codex 会在你完成后审查你的改动。请严格按本任务书执行，不要自由扩展硬件或重写项目。

## 一、项目背景

这是一个种植方舱可视化管理系统原型。

技术栈已确定：

- 前端：Vue 3 + TypeScript
- 三维：Three.js，预留 GLTFLoader/GLTF 格式模型
- 图表：ECharts
- 后端：Node.js NestJS
- 实时通信：WebSocket
- 数据库：MySQL + InfluxDB
- 缓存/消息：Redis + MQTT
- 设备协议：暂不处理

硬件边界非常重要：只能使用现有文档和当前项目中已经定义的传感器、执行器、设备点位，不允许新增任何硬件、传感器、执行器、摄像头、称重、视觉、机械臂等设备。所有“专业功能”都必须由已有数据、规则、流程、报表、算法、追溯和人工录入扩展出来。

## 二、当前状态

当前前端为了避免页面失控，已经收敛成一个稳定核心：

- `frontend/src/App.vue`
- `frontend/src/components/AppHeaderShell.vue`
- `frontend/src/components/AppPrimaryNav.vue`
- `frontend/src/components/OverviewWorkspace.vue`
- `frontend/src/components/EnvironmentGrowthControlPanels.vue`
- `frontend/src/components/ProfessionalBatchPanels.vue`
- `frontend/src/components/AlarmMaintenancePanels.vue`
- `frontend/src/data/navigation.ts`

还有一些高级模块仍在组件目录里，但当前没有系统接回主入口：

- `frontend/src/components/CultivationAdvancedPanels.vue`
- `frontend/src/components/UserSystemPanels.vue`
- `frontend/src/components/EngineeringDeliveryPanels.vue`
- `frontend/src/components/AdminSupportPanels.vue`

你的目标不是继续堆页面，而是把这些能力按用户使用路径重新集成，减少重复信息和重复操作。

## 三、硬性禁止

不得做以下事情：

- 不得新增硬件、点位、设备、传感器或执行器。
- 不得新增一个大杂烩页面来展示所有功能。
- 不得把旧的重复模块原样全部塞回 `App.vue`。
- 不得引入新的前端依赖，除非必须且先说明理由。
- 不得破坏当前能构建的基础状态。
- 不得出现中文乱码、mojibake、残缺标签或未闭合模板。
- 不得把 `App.vue` 再变成几千行的巨型文件。
- 不得只做视觉堆砌，必须服务真实种植、运维、管理和交付路径。

## 四、执行顺序

### Phase 0：基线审计

先阅读以下文件：

- `frontend/src/App.vue`
- `frontend/src/data/navigation.ts`
- `frontend/src/components/AppHeaderShell.vue`
- `frontend/src/components/OverviewWorkspace.vue`
- `frontend/src/components/EnvironmentGrowthControlPanels.vue`
- `frontend/src/components/ProfessionalBatchPanels.vue`
- `frontend/src/components/AlarmMaintenancePanels.vue`
- `frontend/src/components/CultivationAdvancedPanels.vue`
- `frontend/src/components/UserSystemPanels.vue`
- `frontend/src/components/EngineeringDeliveryPanels.vue`
- `frontend/src/components/AdminSupportPanels.vue`

然后运行：

```bash
npm run build --workspace frontend
```

输出一段简短基线说明：当前入口、当前已渲染模块、未渲染模块、主要重复点、主要风险。

### Phase 1：恢复干净中文与信息层级

修复当前核心页面里的英文占位和乱码风险。

重点文件：

- `frontend/src/App.vue`
- `frontend/src/components/AppHeaderShell.vue`
- `frontend/src/data/navigation.ts`

要求：

- 页面主文案使用简洁中文。
- 不要长篇解释系统功能。
- 顶部只保留用户真正需要判断的信息：当前批次、阶段、评分、风险、下一步动作。
- 构建必须通过。

### Phase 2：抽离主入口模拟数据

把 `App.vue` 中的大量 mock 数据、状态派生、演示数据抽到独立文件或 composable。

推荐新建其一：

- `frontend/src/data/integrated-workbench.ts`
- 或 `frontend/src/composables/useWorkbenchData.ts`

要求：

- `App.vue` 只负责状态编排、视图选择、事件连接。
- 类型定义清晰，尽量复用现有 `types`。
- 不要改变业务含义。
- 不要新增硬件字段。

### Phase 3：按用户路径接回高级模块

逐步接回高级模块，但必须按用户路径分组渲染，不得散开。

目标路径：

1. 总控首页
   - 总览
   - 方舱三维/点位
   - 大屏
   - 智能分析

2. 日常作业
   - 今日任务
   - 电子巡检
   - SOP
   - 移动端简化视图
   - 通知与帮助

3. 种植生命周期
   - 批次管理
   - 生长阶段
   - 采收
   - 清舱复盘
   - 异常归因
   - 下批优化建议
   - 日历、配方、生物安全作为辅助面板，不要独立成大页面

4. 生产决策
   - 环境评分
   - 均匀性分析
   - 稳定性风险
   - 质量趋势
   - 策略建议
   - 经营分析
   - 复盘会议和协同决策

5. 运维处置
   - 环境监测
   - 控制策略
   - 报警处置
   - 维护校准
   - 点位健康
   - 数据质量

6. 数据交付
   - 日报/周报
   - 阶段报告
   - 批次追溯
   - 阈值变更记录
   - 审计记录
   - 验收材料
   - 演示模式

7. 系统支持
   - 角色入口
   - 搜索
   - 设置
   - 权限/安全
   - 系统说明

接入建议：

- `UserSystemPanels.vue`：放到“日常作业”和“系统支持”。
- `CultivationAdvancedPanels.vue`：放到“种植生命周期”和“生产决策”。
- `EngineeringDeliveryPanels.vue`：放到“数据交付”。
- `AdminSupportPanels.vue`：放到“系统支持”和“演示/配置”。

每次只接一个模块，接完就运行 build。

### Phase 4：减少重复

检查并合并重复内容。

常见重复处理方式：

- “环境评分、达标率、稳定性”只保留一个权威卡片，其他位置只引用摘要。
- “报警、维护、巡检、校准”合并成一条处置闭环，不要多处出现相同清单。
- “报告、追溯、审计、验收”合并到数据交付中心。
- “批次、阶段、采收、复盘”合并成生命周期时间线。
- “建议、策略、决策、专家分析”合并成生产决策工作台。

每个页面顶部都应该回答三个问题：

- 现在是什么状态？
- 最大风险是什么？
- 用户下一步该做什么？

### Phase 5：视觉与交互整理

要求：

- 不做营销页。
- 不做过大的 hero。
- 不堆嵌套卡片。
- 卡片只用于具体对象，如任务、报警、批次、报告。
- 工作台布局优先：左侧导航，中间主任务，右侧辅助信息。
- 表格、任务、报警、报告要能扫描。
- 按钮文案必须是明确动作，不要写成说明句。
- 页面不要出现大段介绍性文字。

### Phase 6：验收

最后必须运行：

```bash
npm run build --workspace frontend
```

交付给 Codex 审查时，请提供：

1. 修改文件清单
2. 关键改动说明
3. 当前导航和用户路径说明
4. 是否新增依赖
5. build 结果
6. 仍需人工确认的点

## 五、Codex 审查标准

Codex 会按以下标准审查你的结果：

- 构建是否通过。
- 是否新增了硬件或超出现有点位。
- 是否出现乱码、残缺标签、TypeScript 类型绕过。
- 是否把功能按用户路径集成，而不是继续堆页面。
- 是否减少重复内容和重复操作。
- 是否保留三维模型/GLTF 的预留能力。
- 是否让真实用户更容易完成：看状态、判风险、做处置、追溯复盘、交付报告。

如果你不确定某个功能是否需要新增硬件，默认不要做；改成规则判断、人工录入、报表或流程功能。

