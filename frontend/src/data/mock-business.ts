import type { ViewKey } from '../types';

export const growthStages = [
  { name: '菌丝期', temp: '22-25℃', humidity: '85-90%', co2: '800-1200ppm', light: '弱光/关闭', strategy: '稳温保湿' },
  { name: '现蕾期', temp: '20-23℃', humidity: '88-92%', co2: '1200-1600ppm', light: '弱散射光', strategy: '防止波动' },
  { name: '子实体生长期', temp: '18-22℃', humidity: '85-90%', co2: '1500-2000ppm', light: '500-1000lx', strategy: '通风补光' },
  { name: '成熟期', temp: '18-21℃', humidity: '80-88%', co2: '适度降低', light: '稳定光照', strategy: '防过湿' }
];

export const controlRules = [
  { name: '湿度联动', when: '舱内湿度低于 85%', action: '启动加湿系统，维持高湿环境', target: '加湿系统' },
  { name: 'CO2 联动', when: 'CO2 高于 2000ppm', action: '启动新风系统并记录通风持续时间', target: '新风系统' },
  { name: '温度联动', when: '温度高于阶段上限', action: '空调进入自动降温，避免冷风直吹', target: '空调系统' },
  { name: '补光联动', when: '子实体期光照低于 500lx', action: 'LED 按定时策略补光', target: '照明系统' },
  { name: '安全联动', when: '水浸/烟雾/漏电报警', action: '切换应急模式并提示现场确认', target: '安全系统' }
];

export const maintenancePlans = [
  { type: '温度传感器', cycle: '6个月', standard: 'JJF1366-2012', scope: '主温湿度、料温、配电箱温度' },
  { type: '湿度传感器', cycle: '6个月', standard: 'JJF1076-2001', scope: '主温湿度、层架温湿度、土壤温湿度' },
  { type: '光照传感器', cycle: '6个月', standard: 'JJF1330-2011', scope: '舱顶、层架前后光照' },
  { type: 'CO2 传感器', cycle: '6个月', standard: 'ISO12039-2001', scope: '顶部、中层、通风口、角落点位' },
  { type: '安全与电气', cycle: '季度巡检', standard: '现场巡检记录', scope: '烟雾、水浸、门禁、电流、漏电' }
];

export const plantingLogs = [
  { time: '2026-06-14 08:20', type: '巡检', content: '完成早班巡检，空调、加湿、新风、照明均处于自动模式。', operator: '种植员' },
  { time: '2026-06-14 10:05', type: '阶段', content: '确认当前批次维持子实体生长期参数模板。', operator: '管理员' },
  { time: '2026-06-14 11:40', type: '异常处理', content: '复核下层湿度点，建议观察加湿扩散。', operator: '值班员' },
  { time: '2026-06-14 15:10', type: '维护', content: '检查水浸检测区域和配电箱温度点位，无新增异常。', operator: '运维员' }
];

export const inspectionChecklist = [
  { item: '查看温湿度、CO2、光照关键点位（4类各取 1 点）', frequency: '每日', done: true, owner: '种植员', reviewer: '班组长' },
  { item: '检查加湿水位 HUM-01、雾化流量和运行状态', frequency: '每日', done: false, owner: '种植员', reviewer: '班组长' },
  { item: '检查新风风机运行状态和通风口响应', frequency: '每日', done: true, owner: '种植员', reviewer: '班组长' },
  { item: '检查水浸检测绳、门磁和配电箱温度', frequency: '每日', done: false, owner: '运维员', reviewer: '运维负责人' },
  { item: '清洁温湿度探头并检查 CO2 过滤膜', frequency: '每周', done: false, owner: '运维员', reviewer: '运维负责人' },
  { item: '检查传感器连接线、管道和防水密封', frequency: '每周', done: false, owner: '运维员', reviewer: '运维负责人' }
];

export const inspectionSchedule = [
  { cycle: '每日巡检', items: '温湿度、CO2、加湿水位、新风、门磁、水浸、配电箱温度' },
  { cycle: '每周巡检', items: '清洁探头、检查 CO2 过滤膜、检查连接线、雾化流量' },
  { cycle: '每月巡检', items: '全面比对标准仪表、清洁光照表面、检查防水密封' },
  { cycle: '季度校验', items: '精度验证、安装支架、通信质量、故障复盘' }
];

export const sopGuides = [
  { title: 'CO2 偏高处置', trigger: 'CO2 超过阶段上限或回落偏慢', steps: ['确认新风系统处于自动/联动模式', '检查新风风机状态和通风口响应', '观察顶部、中层、角落 CO2 差异', '记录处理结果并复核 10 分钟趋势'] },
  { title: '湿度偏低处置', trigger: '空气湿度低于阶段下限', steps: ['确认加湿器运行状态', '检查水位和雾化流量', '减少不必要新风扰动', '观察层架湿度恢复速度'] },
  { title: '水浸报警处置', trigger: '漏水检测绳触发', steps: ['定位空调、加湿器、管道易漏水区域', '必要时切换应急模式', '现场确认漏水源', '恢复后记录验证结果'] },
  { title: '传感器离线处置', trigger: '点位长时间无更新', steps: ['查看采集器通信状态', '检查 RS485/网关链路', '核对传感器供电', '恢复后标记数据可信度'] }
];

export const approvalRecords = [
  { title: '湿度下限从 85% 调整至 86%', applicant: '种植员', status: '待处理', reason: '子实体期湿度波动偏大' },
  { title: 'CO2 预警阈值复核', applicant: '管理员', status: '已闭环', reason: '匹配当前阶段模板' },
  { title: '补光时段延长 20 分钟', applicant: '种植员', status: '待复核', reason: '前部层架光照略低' }
];

export const thresholdChangeRecords = [
  { operator: '管理员', time: '2026-06-14 09:20', before: '湿度下限 85%', after: '湿度下限 86%', reason: '子实体期下层湿度波动偏大' },
  { operator: '种植主管', time: '2026-06-13 16:10', before: 'CO2预警 2000ppm', after: 'CO2预警 1900ppm', reason: '提前触发新风联动观察' },
  { operator: '运维员', time: '2026-06-12 11:35', before: '补光 6小时', after: '补光 6.5小时', reason: '前部层架光照略低' }
];

export const stageChecklist = [
  { item: '温度稳定在目标范围 18-22℃', passed: true },
  { item: '湿度达标且无持续下探（下层 ≥85%RH）', passed: false },
  { item: 'CO2 处于阶段目标窗口 1500-2000ppm', passed: true },
  { item: '光照系统正常且强度达标 500-1000lx', passed: true },
  { item: '加湿、新风、空调无故障报警', passed: true },
  { item: '不存在待处理安全报警（水浸/烟雾/漏电）', passed: false }
];



export const roleMatrix = [
  { role: '管理员', scope: '参数配置、审批、用户权限、报表导出' },
  { role: '种植员', scope: '查看数据、填写日志、执行巡检、提交申请' },
  { role: '运维员', scope: '设备报警处理、维护校准、传感器台账' },
  { role: '访客/领导', scope: '驾驶舱、大屏、批次报告只读查看' }
];

export const exportItems = ['环境数据导出', '报警记录导出', '巡检记录导出', '维护记录导出', '批次复盘报告'];

export const anomalyChains = [
  { start: '新风响应偏慢', chain: ['CO2回落变慢', '子实体期环境偏离', '环境评分下降', '批次风险升高'] },
  { start: '湿度短时下探', chain: ['加湿扩散不足', '层间均匀性下降', '菌包水分风险上升', '巡检任务触发'] },
  { start: '传感器临近校准', chain: ['数据可信度下降', '报警判断需复核', '维护计划提前', '追溯记录更新'] }
];

export const responseCurves = [
  { device: '加湿启动后', metric: '湿度提升', points: ['0min 85.2%', '5min 86.1%', '10min 87.4%', '15min 88.0%'], result: '良好' },
  { device: '新风启动后', metric: 'CO2下降', points: ['0min 1880ppm', '5min 1810ppm', '10min 1760ppm', '15min 1705ppm'], result: '偏慢' },
  { device: '空调启动后', metric: '温度回落', points: ['0min 22.5℃', '5min 22.0℃', '10min 21.5℃', '15min 21.1℃'], result: '正常' },
  { device: '补光启动后', metric: '光照稳定', points: ['0min 420lx', '5min 610lx', '10min 735lx', '15min 748lx'], result: '正常' }
];

export const thresholdSensitivity = [
  { change: '湿度下限 85% -> 86%', warning: '+3次/周', score: '+2分', cost: '加湿时长 +12%' },
  { change: 'CO2预警 2000ppm -> 1900ppm', warning: '+2次/周', score: '+1分', cost: '新风时长 +8%' },
  { change: '光照下限 500lx -> 550lx', warning: '+1次/周', score: '+1分', cost: '补光时长 +6%' }
];

export const anomalyCaseLibrary = [
  { caseName: '湿度短时下探', reason: '新风扰动 + 加湿扩散慢', solution: '降低新风频率，检查雾化流量', result: '12分钟恢复' },
  { caseName: 'CO2高位持续', reason: '新风通风效率偏低', solution: '复核风机状态和通风口', result: '18分钟回落' },
  { caseName: '点位疑似漂移', reason: '邻近点差异扩大', solution: '安排校准并标记数据可信度', result: '校准后恢复' }
];

export const productionTraceChain = [
  '批次 JE-202606-001',
  '子实体生长期',
  '环境数据归档',
  '报警与工单',
  '巡检记录',
  '维护校准',
  '产量录入',
  '批次复盘'
];


export const acceptanceMetrics = [
  { item: '传感器在线率', target: '≥ 98%', current: '100%', status: '通过' },
  { item: '数据刷新周期', target: '≤ 60秒', current: '2.5秒', status: '通过' },
  { item: '报警响应时间', target: '≤ 5秒', current: '1.2秒', status: '通过' },
  { item: '页面加载时间', target: '≤ 3秒', current: '1.6秒', status: '通过' },
  { item: '三维点位准确率', target: '按配置校验', current: '68点位已映射', status: '待现场复核' },
  { item: '权限隔离可用性', target: '角色菜单隔离', current: '原型预留', status: '待接认证' }
];


export const dataLineage = ['传感器', '采集模块', '边缘网关', '后端API', 'WebSocket', '前端可视化', '报表/工单/批次'];

export const apiDocs = [
  { path: '/api/sensors', method: 'GET', desc: '实时点位与传感器台账' },
  { path: '/api/telemetry/history', method: 'GET', desc: '历史数据查询预留' },
  { path: '/api/alarms', method: 'GET/POST', desc: '报警事件与确认' },
  { path: '/api/control-rules', method: 'GET/PUT', desc: '联动控制策略' },
  { path: '/api/batches', method: 'GET/POST', desc: '批次管理' },
  { path: '/api/work-orders', method: 'GET/POST', desc: '报警工单闭环' },
  { path: '/api/maintenance', method: 'GET/POST', desc: '维护校准记录' },
  { path: '/api/users/roles', method: 'GET/PUT', desc: '权限角色' }
];

export const integrationStatus = [
  { item: '当前协议', value: '待硬件同事确认', result: '不影响前端原型' },
  { item: '数据格式', value: 'JSON 样例已预留', result: '字段可校验' },
  { item: '点位映射', value: '68个现有点位', result: '已配置' },
  { item: '设备编号', value: '按文档硬件预留', result: '不新增设备' },
  { item: '最近数据包', value: '{ sensorId, value, unit, status, updatedAt }', result: '模拟通过' },
  { item: '异常字段提示', value: '缺字段/超量程/延迟', result: '待接入后启用' }
];

export const releaseNotes = [
  { version: 'v0.7', date: '2026-06-14', owner: 'Codex', content: '新增工程交付、联调文档、运维演练层。' },
  { version: 'v0.6', date: '2026-06-14', owner: 'Codex', content: '新增风险决策、复盘追溯、审计看板。' },
  { version: 'v0.5', date: '2026-06-14', owner: 'Codex', content: '补齐15项专业分析功能。' }
];

export const helpManual = [
  { title: '首页怎么看', content: '查看环境评分、核心指标、今日待办和报警状态。' },
  { title: '三维点位怎么看', content: '按类型和层级筛选，点击点位查看实时值和趋势。' },
  { title: '报警怎么处理', content: '进入SOP工单，按根因、SOP和工单流程闭环。' },
  { title: '巡检怎么执行', content: '在日常工作中查看每日/每周/月度/季度巡检任务。' },
  { title: '批次怎么管理', content: '在批次管理中查看阶段合规、产量关联和复盘。' },
  { title: '报表怎么导出', content: '在报表中心选择日报、周报、批次、报警、巡检或维护报告。' }
];

export const permissionAuditLogs = [
  { time: '2026-06-14 09:20', user: '管理员', action: '修改湿度阈值', target: '子实体期模板' },
  { time: '2026-06-14 10:05', user: '种植员', action: '确认报警', target: '土壤温湿度1' },
  { time: '2026-06-14 11:30', user: '运维员', action: '关闭工单', target: '新风响应偏慢' },
  { time: '2026-06-14 15:00', user: '访客/领导', action: '查看报表', target: '运行日报' }
];

export const backupStrategy = [
  { item: '本地缓存', value: '断网时缓存实时数据和待提交记录' },
  { item: '云端备份', value: '历史数据、报表、工单、批次归档' },
  { item: '历史保留', value: '时序数据按周期归档，报表长期保存' },
  { item: '断网恢复', value: '网络恢复后补传缓存数据并标记时间差' },
  { item: '恢复流程', value: '备份校验 -> 服务恢复 -> 数据补齐 -> 审计记录' }
];

export const drillScenarios = [
  { title: '水浸演练', steps: ['演练开始', '水浸报警触发', 'SOP执行', '工单生成', '人员确认', '恢复验证', '演练报告'] },
  { title: 'CO2超限演练', steps: ['模拟CO2偏高', '新风联动', '趋势观察', '报警确认', '根因归类', '复盘入库'] },
  { title: '传感器离线演练', steps: ['模拟离线', '数据质量下降', '检查采集链路', '恢复通信', '可信度恢复'] },
  { title: '火灾烟雾演练', steps: ['烟雾报警', '安全SOP', '应急提示', '现场确认', '工单关闭'] },
  { title: '设备故障演练', steps: ['设备异常', '效能下降', '运维工单', '维护处理', '恢复验证'] }
];

export const eventTimeline = [
  { time: '08:20', title: '环境偏离', detail: '湿度短时下探，触发稳定性观察。' },
  { time: '08:21', title: '报警生成', detail: '系统记录预警并关联层架温湿度点。' },
  { time: '08:22', title: 'SOP推荐', detail: '建议检查加湿运行状态和新风扰动。' },
  { time: '08:25', title: '工单创建', detail: '生成巡检工单，等待值班员确认。' },
  { time: '08:36', title: '数据恢复', detail: '湿度回到目标区间，进入复盘归档。' }
];

export const ruleExplanations = [
  { decision: '新风响应偏慢', evidence: ['CO2 10分钟下降不足120ppm', '新风风机运行但CO2回落偏慢', '风机状态为运行'], conclusion: '疑似通风效率不足，建议检查通风口和风机。' },
  { decision: '湿度扩散需观察', evidence: ['下层湿度低于中层', '加湿系统处于运行', '新风扰动影响扩散'], conclusion: '建议降低不必要新风频率并复核雾化流量。' },
  { decision: '点位可信度需复核', evidence: ['邻近点差异扩大', '临近校准周期', '数据无通信中断'], conclusion: '疑似传感器漂移，建议安排校准。' }
];

export const demoScripts = [
  { name: '正常运行脚本', steps: ['打开首页', '查看环境评分', '进入三维方舱', '查看批次摘要'] },
  { name: '湿度偏低脚本', steps: ['触发湿度偏低', '查看规则解释', '生成工单', '复盘归档'] },
  { name: 'CO2偏高脚本', steps: ['触发CO2预警', '查看新风响应曲线', '执行SOP', '恢复验证'] },
  { name: '水浸报警脚本', steps: ['触发安全报警', '定位三维点位', '执行演练流程', '生成演练报告'] },
  { name: '批次复盘脚本', steps: ['查看合规报告', '录入产量', '生成批次报告', '沉淀优化建议'] }
];

export const dataModeBadges = ['实时数据', '模拟数据', '历史数据预留', '真实设备待接入'];

export const legendItems = [
  { label: '正常', value: '绿色', note: '读数在阶段目标内' },
  { label: '预警', value: '黄色', note: '接近阈值或需要观察' },
  { label: '报警', value: '红色', note: '超过安全或生产阈值' },
  { label: '离线', value: '灰色', note: '通信或数据中断' },
  { label: '单位', value: '℃ / %RH / ppm / lx / state', note: '按传感器类型展示' }
];

export const deploymentChecklist = [
  { item: '服务器要求', value: 'Node.js运行环境，后端3001端口' },
  { item: '前端部署', value: 'Vite构建产物，默认5173开发端口' },
  { item: 'GLTF模型', value: '放置于 frontend/public/models/cabin.gltf' },
  { item: '网络要求', value: '前后端可访问，WebSocket不被拦截' },
  { item: '数据库预留', value: 'MySQL + InfluxDB，正式接入后启用' },
  { item: '设备协议', value: '待硬件同事确认，点位映射已准备' }
];

export const deliveryStatus = [
  { group: '已完成', items: ['前端原型', '三维模型预留', '后端模拟数据', 'WebSocket实时推送', '专业分析', '工作流闭环', '工程交付页面'] },
  { group: '待接入', items: ['真实设备协议', 'MySQL', 'InfluxDB', '账号认证', '真实GLTF模型', '现场坐标复核'] },
  { group: '风险项', items: ['硬件点位坐标需现场确认', '阈值需种植专家最终确认', '协议字段需硬件同事定稿'] },
  { group: '下一版本', items: ['拆分路由', '接入数据库', '报表导出PDF/Excel', '真实权限认证'] }
];

export const demoFlowScenarios = [
  { name: '正常运行', effect: '总控大脑显示可观察运行，三维点位正常，质量与成本指标稳定。', view: 'overview' },
  { name: '湿度偏低', effect: '环境评分扣分，触发下层稳湿任务、CAPA与主任工作台风险提示。', view: 'brain' },
  { name: 'CO2回落偏慢', effect: '规则中心触发新风复测，设备效能与阶段放行进入观察。', view: 'strategy' },
  { name: '污染疑似', effect: '异常处置进入隔离流程，证据链显示复核结果待复核。', view: 'closure' },
  { name: '阶段暂缓放行', effect: '主任工作台显示暂缓放行，审批流进入待处理状态。', view: 'director' },
  { name: '采收前检查', effect: '采收质量、分级规则和采收前检查清单联动展示。', view: 'harvest' },
  { name: '下批次推荐', effect: '标准协同输出推荐单，策略沙盘展示参数调整影响。', view: 'collaboration' }
];

export const sourceCredibility = [
  { conclusion: '环境评分', source: '传感器实时数据 + 阶段阈值', type: '模拟实时', confidence: '高', note: '真实接入后来自 InfluxDB' },
  { conclusion: '污染疑似', source: '人工巡检记录 + 层架档案', type: '人工记录', confidence: '中', note: '待现场复核闭环' },
  { conclusion: '成本核算', source: '设备运行时长 + 人工记录 + 估算单价', type: '模拟推算', confidence: '中', note: '待接真实电价/耗材' },
  { conclusion: '采收窗口', source: '成熟度、形态记录、环境达标率', type: '规则推算', confidence: '中高', note: '待接真实产量数据' },
  { conclusion: '设备响应', source: '设备状态点 + 环境变化速度', type: '模拟实时', confidence: '中高', note: '待协议字段定稿' }
];

export const processSwimlanes = [
  { role: '种植员', steps: ['入舱登记', '日常巡检', '异常记录', '采收分级', '交接班'] },
  { role: '运维员', steps: ['点位复核', '设备工单', '校准维护', '新风复测', '清舱支持'] },
  { role: '管理者', steps: ['阶段审批', '风险决策', '批次锁定', '复盘会议', '推荐单审批'] },
  { role: '系统', steps: ['阶段监控', '规则触发', '报警闭环', '证据归档', '下批次推荐'] }
];

export const pointBusinessMapping = [
  { hardware: '温湿度点位', business: '环境评分、层架均匀性、成熟度判断、稳湿任务', evidence: '温湿度曲线与阶段阈值' },
  { hardware: 'CO2点位', business: '通风效率、阶段合规、CO2回落风险、放行判断', evidence: 'CO2曲线与新风状态' },
  { hardware: '光照点位', business: '颜色/形态风险、补光策略、采收质量判断', evidence: '光照均匀度和补光时段' },
  { hardware: '料温/基质湿度', business: '菌包状态、下层偏干、批次风险画像', evidence: '菌包档案与基质趋势' },
  { hardware: '门磁/水浸/烟雾/电气', business: '安全追溯、清舱证据、异常处置、权限审计', evidence: '安全事件和巡检记录' },
  { hardware: '设备状态点', business: '空调/新风/加湿/LED响应效率、能耗估算', evidence: '设备状态与环境变化率' }
];

export const acceptanceChecklist = [
  { item: '68个点位台账', status: '已完成', owner: '系统原型', note: '按文档硬件清单模拟' },
  { item: '三维模型预留 GLTF', status: '已完成', owner: '前端', note: '支持 cabin.gltf 替换' },
  { item: 'WebSocket 实时数据', status: '已完成', owner: '后端', note: '当前为模拟推送' },
  { item: '报警闭环', status: '已完成', owner: '前端/后端', note: '事件、工单、复核链路预留' },
  { item: '批次管理', status: '已完成', owner: '前端', note: '批次、菌包、采收、复盘' },
  { item: '阶段报告', status: '已完成', owner: '前端', note: '合规、质量、成熟度、放行' },
  { item: '权限角色', status: '原型完成', owner: '前端', note: '真实认证待接' },
  { item: '数据库接口预留', status: '待接入', owner: '后端', note: 'MySQL + InfluxDB' },
  { item: 'MQTT/设备协议预留', status: '待处理', owner: '硬件同事', note: '协议字段待定稿' }
];

export const dataAccessStatus = [
  { system: 'MySQL', status: '待接', purpose: '批次、用户、工单、审批、配置', blocker: '表结构待定稿' },
  { system: 'InfluxDB', status: '待接', purpose: '传感器历史曲线、趋势、报表', blocker: '点位编码需现场复核' },
  { system: 'Redis', status: '待处理', purpose: '缓存、会话、实时状态', blocker: '部署环境待处理' },
  { system: 'MQTT', status: '待接', purpose: '设备消息、状态订阅、边缘网关', blocker: '设备协议待同事确认' },
  { system: 'GLTF模型', status: '待导入', purpose: '真实方舱模型替换', blocker: '模型文件未提供' },
  { system: '点位坐标', status: '待复核', purpose: '三维点位定位', blocker: '现场安装坐标需确认' }
];

export const pagePermissionMatrix = [
  { role: '管理者', pages: '总控、质量、成本、审批、报表、复盘', authority: '审批、查看、导出、配置策略' },
  { role: '种植员', pages: '巡检、异常、采收、交接班、批次', authority: '填写、提交、处理、查看建议' },
  { role: '运维员', pages: '点位、设备、校准、联调、工单', authority: '维护、复测、校准、提交结果' },
  { role: '访客/领导', pages: '大屏、三维、汇报演示、总控只读', authority: '只读查看' }
];

export const presentationScript = [
  { step: '1', title: '当前舱体运行状态', view: '首页驾驶舱', highlight: '环境评分、实时点位、报警数量' },
  { step: '2', title: '三维点位布置', view: '三维方舱', highlight: '68个既有硬件点位和GLTF预留' },
  { step: '3', title: '种植批次状态', view: '批次管理/菌包生产', highlight: '批次、阶段、菌包、层架微环境' },
  { step: '4', title: '风险与处置', view: '异常处置/策略沙盘', highlight: '湿度、CO2、污染、规则触发' },
  { step: '5', title: '质量放行', view: '质量管控/主任工作台', highlight: 'CCP/CQA/CAPA、阶段放行' },
  { step: '6', title: '成本与KPI', view: '经营分析', highlight: '单位成本、A级率、成品率、闭环率' },
  { step: '7', title: '下批次优化', view: '标准协同/总控大脑', highlight: '推荐单、知识沉淀、总控下一步' }
];

export const goldenEarRecipes = [
  { stage: '菌丝期', days: '1-5天', temp: '22-25℃', humidity: '85-90%', co2: '800-1200ppm', light: '弱光/关闭', ventilation: '低频稳态', humidify: '间歇保湿', risk: '温度波动、污染', action: '保持稳定，减少开门扰动' },
  { stage: '转色/现蕾期', days: '6-8天', temp: '20-23℃', humidity: '88-92%', co2: '1200-1600ppm', light: '弱散射光', ventilation: '短时换气', humidify: '高湿防干', risk: '湿度下探', action: '观察层架湿度差异' },
  { stage: '子实体形成期', days: '9-18天', temp: '18-22℃', humidity: '85-90%', co2: '1500-2000ppm', light: '500-1000lx', ventilation: 'CO2联动', humidify: '稳湿优先', risk: 'CO2高位、光照不均', action: '复核新风和补光' },
  { stage: '成熟采收期', days: '19-22天', temp: '18-21℃', humidity: '80-88%', co2: '适度降低', light: '稳定散射光', ventilation: '适度增强', humidify: '防过湿', risk: '过湿、形态异常', action: '准备采收窗口' },
  { stage: '清舱消毒期', days: '采收后', temp: '常温', humidity: '干燥通风', co2: '正常空气', light: '检修照明', ventilation: '持续通风', humidify: '关闭', risk: '残留污染', action: '清理、消毒、空舱通风' }
];

export const cultivationCalendar = [
  { day: '06-08', event: '入舱', status: '已完成' },
  { day: '06-09 至 06-12', event: '菌丝期', status: '已完成' },
  { day: '06-13 至 06-15', event: '转色/现蕾期', status: '处理中' },
  { day: '06-16 至 06-25', event: '子实体形成期', status: '待处理' },
  { day: '06-26 至 06-28', event: '预计采收窗口', status: '关注' },
  { day: '采收后', event: '清舱、消毒、空舱通风', status: '待处理' }
];

export const deviationDurations = [
  { metric: '温度偏离累计', value: '22分钟', impact: '低' },
  { metric: '湿度偏离累计', value: '38分钟', impact: '中' },
  { metric: 'CO2偏离累计', value: '18分钟', impact: '低-中' },
  { metric: '光照不足累计', value: '42分钟', impact: '形态发育需观察' }
];

export const yieldImpact = [
  { abnormal: '湿度累计偏离超过30分钟', level: '中', note: '可能影响子实体饱满度' },
  { abnormal: 'CO2高位持续超过20分钟', level: '低-中', note: '可能影响形态发育' },
  { abnormal: '光照不足累计超过60分钟', level: '中', note: '可能影响着色和形态' },
  { abnormal: '温度波动频繁', level: '低', note: '当前仍处可控范围' }
];

export const cultivationOperationTemplates = ['开袋', '摆袋', '喷雾', '通风调整', '补光调整', '采收', '清理残菇', '清舱消毒'];

export const cleanoutFlow = ['采收完成', '菌包移除', '场地清理', '消毒记录', '空舱通风', '传感器检查', '下一批准备'];

export const biosecurityRecords = [
  { item: '入舱人员', value: '种植员/运维员登记' },
  { item: '消毒状态', value: '清舱后记录' },
  { item: '门禁记录', value: '门磁状态关联' },
  { item: 'VOC/异味记录', value: '安全传感器与人工备注' },
  { item: '清洁记录', value: '巡检任务归档' },
  { item: '污染风险备注', value: '批次复盘保存' }
];

export const cultivationKnowledge = [
  { title: '湿度短时下探', reason: '新风扰动或加湿扩散慢', action: '减少扰动，检查加湿雾化流量' },
  { title: 'CO2持续偏高', reason: '通风效率不足', action: '检查新风风机运行状态和通风口响应' },
  { title: '光照不均', reason: '层架遮挡或LED衰减', action: '对比舱顶、前部、后部光照点' },
  { title: '过湿风险', reason: '成熟期湿度过高', action: '增强通风，避免凝露和污染' }
];

export const recipeVersions = [
  { version: '金耳标准配方 v1.0', feature: '均衡稳态', bound: 'JE-202605-001' },
  { version: '高湿稳态配方 v1.1', feature: '提高现蕾期湿度下限', bound: 'JE-202606-001' },
  { version: '节能通风配方 v1.2', feature: '优化新风时段和补光时长', bound: '下批次预留' }
];

export const cultureBagArchives = [
  { id: 'BAG-202606-A01', source: 'A号菌包批', rack: '上层 1-2架', count: 320, inoculation: '2026-06-08', status: '现蕾观察', lossRate: '1.6%', note: '入舱湿度稳定，顶部温差需关注' },
  { id: 'BAG-202606-A02', source: 'A号菌包批', rack: '中层 3-4架', count: 360, inoculation: '2026-06-08', status: '形态良好', lossRate: '0.8%', note: '当前作为本批次标准对照层' },
  { id: 'BAG-202606-A03', source: 'A号菌包批', rack: '下层 5-6架', count: 340, inoculation: '2026-06-08', status: '偏干复核', lossRate: '2.1%', note: '湿度回升偏慢，巡检加密' }
];

export const rackYieldRecords = [
  { rack: '上层', yield: '42.5kg', gradeA: '71%', humidity: '87.2%', co2: '1680ppm', alarms: 3, advice: '维持补光，复核顶部热积聚' },
  { rack: '中层', yield: '48.8kg', gradeA: '78%', humidity: '88.6%', co2: '1580ppm', alarms: 1, advice: '作为高产层参数参考' },
  { rack: '下层', yield: '39.6kg', gradeA: '66%', humidity: '84.9%', co2: '1760ppm', alarms: 5, advice: '检查加湿扩散和风道回流' }
];

export const contaminationRiskRecords = [
  { area: '下层 5架', risk: '局部污染疑似', source: '湿度偏低后人工巡检记录', level: '中', action: '隔离标记，采样复核，避免交叉操作' },
  { area: '门口缓冲区', risk: '人员进出频次偏高', source: '门磁记录 + 巡检日志', level: '低', action: '合并操作批次，减少非必要开门' },
  { area: '清舱后空舱', risk: '残留污染复发', source: '历史批次复盘', level: '低', action: '清舱消毒记录与空舱通风时间绑定' }
];

export const morphologyRecords = [
  { symptom: '耳片展开慢', layer: '下层', severity: '中', linked: '湿度稳定性不足、CO2回落偏慢', action: '延长稳湿窗口，降低新风扰动' },
  { symptom: '颜色偏浅', layer: '上层', severity: '低', linked: '光照均匀度需复核', action: '对比舱顶、前部、后部光照点位' },
  { symptom: '菌包边缘偏干', layer: '下层', severity: '中', linked: '加湿扩散覆盖不足', action: '记录点位，安排巡检确认水雾覆盖方向' }
];

export const rackMicroclimateRanking = [
  { rank: 1, rack: '中层', score: 94, temperature: '20.8℃', humidity: '88.6%', co2: '1580ppm', conclusion: '最接近当前阶段目标区间' },
  { rank: 2, rack: '上层', score: 88, temperature: '21.4℃', humidity: '87.2%', co2: '1680ppm', conclusion: '温度略高，光照稳定' },
  { rank: 3, rack: '下层', score: 81, temperature: '20.2℃', humidity: '84.9%', co2: '1760ppm', conclusion: '湿度偏低，建议优先复核扩散' }
];

export const bagLossMetrics = [
  { label: '入舱菌包', value: '1020包', detail: '来自当前批次档案' },
  { label: '污染/剔除', value: '17包', detail: '损耗率 1.67%' },
  { label: '可采收预估', value: '982包', detail: '综合巡检与环境评分' },
  { label: '成品率预估', value: '96.3%', detail: '按当前异常持续时长估算' }
];

export const harvestGrades = [
  { grade: 'A级', standard: '形态完整、颜色均匀', weight: '98.4kg', rate: '72%' },
  { grade: 'B级', standard: '轻微形态差异', weight: '31.6kg', rate: '23%' },
  { grade: '加工级', standard: '破损或规格偏差', weight: '6.8kg', rate: '5%' }
];

export const energyYieldEfficiency = [
  { item: '加湿系统', runtime: '7.8h', efficiency: '0.18kWh/kg', judgement: '良好，湿度回升效率稳定' },
  { item: '新风系统', runtime: '5.4h', efficiency: '0.12kWh/kg', judgement: '偏慢，CO2回落效率需观察' },
  { item: '空调系统', runtime: '9.1h', efficiency: '0.31kWh/kg', judgement: '正常，顶部温差可继续优化' },
  { item: 'LED补光', runtime: '6.0h', efficiency: '0.09kWh/kg', judgement: '正常，光照均匀度 86%' }
];

export const processOptimizationAdvice = [
  { title: '下层稳湿窗口前移', evidence: '下层湿度均值 84.9%，菌包边缘偏干记录 2 次', suggestion: '在现蕾期前 12 小时提高稳湿优先级，不新增硬件，仅调整控制策略' },
  { title: 'CO2高位恢复阈值细化', evidence: '新风开启后 CO2 下降速度低于中层对照', suggestion: '将持续高位时长纳入报警等级，优先生成巡检任务' },
  { title: '中层参数作为高产参考', evidence: '中层评分 94，A级率 78%，报警次数最低', suggestion: '下批次复制中层湿度和通风节奏作为基线' },
  { title: '清舱记录与异常批次绑定', evidence: '历史污染点多出现在下层与门口缓冲区', suggestion: '清舱、门磁、巡检日志形成批次追溯链' }
];

export const multiBatchExperience = [
  { pattern: '高产批次共同特征', result: '湿度达标率 > 92%，CO2超限少于 3 次/天', apply: '作为下一批次阶段合规目标' },
  { pattern: '低损耗批次共同特征', result: '开门次数低、清舱记录完整、下层湿度波动小', apply: '纳入每日电子巡检评分' },
  { pattern: '节能批次共同特征', result: '新风分段运行，LED按阶段补光，空调避免频繁启停', apply: '形成节能配方 v1.2 的证据' },
  { pattern: '异常复发模式', result: '下层偏干常伴随菌包边缘形态异常', apply: '触发下层优先巡检和工艺复盘' }
];

export const anomalyDisposalLevels = [
  { level: '观察级', trigger: '单点短时偏离，未影响阶段评分', example: '上层温度短时高 0.6℃', response: '记录趋势，下一次巡检复核' },
  { level: '处理级', trigger: '持续偏离或影响形态记录', example: '下层湿度低于目标 38 分钟', response: '生成种植任务，调整稳湿策略' },
  { level: '隔离级', trigger: '疑似污染、异常形态集中出现', example: '下层 5架局部污染疑似', response: '标记批次，隔离操作，采样复核' },
  { level: '停舱复核级', trigger: '安全或污染风险可能扩散', example: '水浸/烟雾/大面积污染联动', response: '暂停非必要操作，完成复核后恢复' }
];

export const dynamicHarvestWindow = [
  { factor: '湿度稳定性', effect: '延后 0.5 天观察', evidence: '下层湿度均值 84.9%，低于当前目标下限', decision: '采收前增加一次形态巡检' },
  { factor: 'CO2恢复速度', effect: '窗口保持但提高复核频率', evidence: '新风开启后回落偏慢', decision: '采收窗口前 24 小时复核通风效率' },
  { factor: '形态发育', effect: '中层按计划，上下层分批采收', evidence: '中层A级率预估 78%，下层耳片展开慢', decision: '按层架建立采收顺序' }
];

export const rackReviewReports = [
  { rack: '上层', targetRate: '91%', alarms: 3, yield: '42.5kg', gradeA: '71%', decision: '可复制补光节奏，需控制顶部温差' },
  { rack: '中层', targetRate: '96%', alarms: 1, yield: '48.8kg', gradeA: '78%', decision: '作为下批次参数基线' },
  { rack: '下层', targetRate: '84%', alarms: 5, yield: '39.6kg', gradeA: '66%', decision: '调整稳湿和巡检优先级' }
];

export const bagLifecycleNodes = [
  { node: '入舱', time: '2026-06-08', owner: '种植员', evidence: '菌包批次档案 + 入舱登记', status: '已完成' },
  { node: '现蕾', time: '2026-06-13', owner: '种植员', evidence: '形态记录 + 阶段达标率', status: '处理中' },
  { node: '子实体形成', time: '2026-06-16', owner: '种植员', evidence: '温湿度/CO2/光照达标报告', status: '待处理' },
  { node: '采收', time: '2026-06-26 至 2026-06-28', owner: '种植员', evidence: '采收分级 + 层架产量', status: '关注' },
  { node: '清舱', time: '采收后', owner: '运维员', evidence: '清舱消毒 + 门磁/安全记录', status: '待处理' }
];

export const operationImpactAssessments = [
  { operation: '开门巡检', time: '09:30', impact: '湿度下降 2.8%RH', recovery: '11分钟恢复', conclusion: '可接受，建议合并低优先级巡检' },
  { operation: '加湿策略调整', time: '11:10', impact: '下层湿度提升 1.9%RH', recovery: '8分钟见效', conclusion: '有效，保留当前策略' },
  { operation: '新风联动', time: '14:20', impact: 'CO2下降 260ppm', recovery: '18分钟回到目标区间', conclusion: '偏慢，进入运维观察' },
  { operation: '补光时段调整', time: '16:00', impact: '光照达标率提升 6%', recovery: '立即生效', conclusion: '对上中层有效，下层继续观察' }
];

export const isolationFlow = [
  '发现异常',
  '层架标记',
  '隔离操作路径',
  '采样复核',
  '剔除或保留',
  '局部消毒',
  '批次复盘'
];

export const yieldLossEstimations = [
  { abnormal: '下层湿度偏低 38 分钟', loss: '0.8% - 1.5%', basis: '下层A级率较中层低 12 个百分点', action: '采收前增加形态复核' },
  { abnormal: 'CO2回落偏慢 18 分钟', loss: '0.3% - 0.8%', basis: '影响形态发育速度但未持续超限', action: '复核新风响应效率' },
  { abnormal: '下层污染疑似', loss: '1.0% - 2.0%', basis: '隔离级事件按局部剔除估算', action: '隔离、采样、消毒记录闭环' }
];

export const parameterDeviationAudit = [
  { item: '湿度目标下限', standard: '85%RH', current: '临时提高到 86%RH', reason: '下层偏干', approver: '种植负责人', result: '待复盘' },
  { item: 'CO2报警持续时长', standard: '20分钟', current: '调整为 15分钟预警', reason: '回落偏慢', approver: '运维负责人', result: '已生效' },
  { item: '补光时长', standard: '6小时', current: '上层保持，中下层延长 0.5小时', reason: '光照均匀度差异', approver: '种植负责人', result: '观察中' },
  { item: '巡检频率', standard: '每日2次', current: '下层每日3次', reason: '污染疑似与湿度偏低叠加', approver: '班组长', result: '已派发' }
];

export const reviewMeetingCards = [
  { title: '做对了什么', content: '中层环境稳定，报警次数最低，可作为下一批次参数基线。' },
  { title: '主要损失点', content: '下层湿度偏低与局部污染疑似叠加，预计影响成品率 0.8% - 2.0%。' },
  { title: '下批次调整项', content: '稳湿窗口前移、CO2预警时长细化、下层巡检加密。' },
  { title: '需要运维配合', content: '复核新风回落效率、加湿扩散方向、顶部温差和下层风道回流。' }
];

export const reviewMeetingActions = [
  { action: '复制中层参数为下一批次基线', owner: '种植负责人', due: '下批次入舱前', status: '待处理' },
  { action: '完成下层污染疑似点复核并归档', owner: '种植员', due: '今日', status: '处理中' },
  { action: '新风响应效率复测，完成后关闭工单', owner: '运维员', due: '本周', status: '待处理' },
  { action: '更新阶段合规报告模板', owner: '管理员', due: '本周', status: '待处理' }
];

export const ccpControls = [
  { code: 'CCP-01', name: '湿度下限', limit: '不得低于 85%RH 持续10分钟', monitor: '温湿度点位 + 阶段阈值', action: '处理级异常，调整稳湿策略' },
  { code: 'CCP-02', name: 'CO2上限', limit: '不得高于 2000ppm 持续15分钟', monitor: 'CO2点位 + 新风状态', action: '触发通风复核和运维观察' },
  { code: 'CCP-03', name: '清舱消毒', limit: '采收后必须完成记录', monitor: '清舱流程 + 人工确认', action: '未完成不得放行下一批次' },
  { code: 'CCP-04', name: '开门频次', limit: '非必要开门合并操作', monitor: '门磁状态 + 巡检日志', action: '异常开门进入复盘' },
  { code: 'CCP-05', name: '污染隔离', limit: '疑似污染当天闭环', monitor: '人工记录 + 批次档案', action: '隔离、采样、剔除/保留判定' }
];

export const cqaAttributes = [
  { name: '形态完整度', target: 'A级率 ≥ 70%', current: '72%', method: '采收分级记录', risk: '下层耳片展开慢' },
  { name: '颜色均匀度', target: '无明显偏浅', current: '上层轻微偏浅', method: '形态记录 + 光照点位', risk: '光照均匀度需复核' },
  { name: '含水状态', target: '无边缘偏干', current: '下层边缘偏干', method: '人工记录 + 湿度曲线', risk: '影响成品率' },
  { name: '污染率', target: '< 2%', current: '1.67%', method: '剔除记录', risk: '仍需隔离复核' },
  { name: 'A级率', target: '≥ 70%', current: '72%', method: '采收分级', risk: '下层拉低整体表现' }
];

export const capaRecords = [
  { deviation: '下层湿度偏低', correction: '稳湿窗口前移，下层巡检加密', prevention: '下批次按中层参数校准湿度策略', owner: '种植负责人', verify: '24小时后复核达标率' },
  { deviation: 'CO2回落偏慢', correction: '新风响应效率复测', prevention: '预警时长由20分钟调为15分钟', owner: '运维员', verify: '复测下降速率' },
  { deviation: '局部污染疑似', correction: '隔离标记，采样复核', prevention: '清舱记录与异常批次绑定', owner: '班组长', verify: '复核结果归档' }
];

export const harvestPrecheck = [
  { item: '成熟度确认', requirement: '成熟度 ≥ 80% 或负责人确认分批采收', status: '满足分批采收条件', owner: '种植负责人', reviewer: '管理者', evidence: '成熟度指数 88' },
  { item: '湿度状态', requirement: '采收前避免过湿/偏干', status: '下层需复核', owner: '种植员', reviewer: '种植负责人', evidence: '下层 TH-L2-002 为 84.9%RH' },
  { item: '污染风险', requirement: '隔离点明确，不交叉操作', status: '下层5架已标记', owner: '班组长', reviewer: '管理者', evidence: '隔离流程记录' },
  { item: '分级人员', requirement: 'A级/B级/加工级规则确认', status: '待复核', owner: '质检员', reviewer: '管理者', evidence: '质量规则库已配置' },
  { item: '包装转运', requirement: '采收后记录与转运批次绑定', status: '待处理', owner: '仓储人员', reviewer: '管理者', evidence: '采收后录入' }
];

export const batchLockRules = [
  { trigger: '进入采收窗口', lock: '锁定阶段阈值和联动规则', exception: '负责人审批后可临时调整', evidence: '阈值变更记录' },
  { trigger: '出现隔离级异常', lock: '锁定菌包批次和相关操作记录', exception: '仅允许追加处置记录', evidence: '异常闭环链' },
  { trigger: '生成阶段报告', lock: '锁定阶段统计口径', exception: '管理员备注修订', evidence: '审计日志' }
];

export const qualityRuleLibrary = [
  { grade: 'A级', rule: '形态完整、颜色均匀、无污染、规格稳定', action: '进入商品采收记录' },
  { grade: 'B级', rule: '轻微形态差异或规格偏差，但无污染', action: '单独记录产量与层架来源' },
  { grade: '加工级', rule: '破损、规格偏差明显，但可安全加工', action: '与A级/B级分开追溯' },
  { grade: '污染剔除', rule: '疑似污染、异味、形态异常集中', action: '隔离、剔除、消毒和复盘' }
];

export const batchCostAccounting = [
  { item: '电费估算', value: '¥386', basis: '空调/新风/加湿/LED运行时长折算', trend: '新风偏慢导致略高' },
  { item: '加湿耗材', value: '¥72', basis: '加湿运行 7.8h + 稳湿策略', trend: '下层稳湿增加消耗' },
  { item: '人工成本', value: '¥520', basis: '巡检、隔离复核、采收准备记录', trend: '异常处置增加 1.5 人时' },
  { item: '损耗成本', value: '¥148', basis: '污染/剔除 17 包 + 成品率预估', trend: '主要来自下层风险' },
  { item: '单位产量成本', value: '¥8.23/kg', basis: '预计产量与运行成本估算', trend: '中层效率最佳' }
];

export const environmentYieldContribution = [
  { factor: '湿度稳定性', contribution: '34%', evidence: '中层湿度 88.6%，A级率 78%', conclusion: '对A级率贡献最高' },
  { factor: 'CO2超限次数', contribution: '22%', evidence: 'CO2回落偏慢影响形态速度', conclusion: '影响成熟窗口和形态' },
  { factor: '光照均匀度', contribution: '16%', evidence: '光照均匀度 86%', conclusion: '影响颜色均匀度' },
  { factor: '报警次数', contribution: '18%', evidence: '下层报警 5 次，产量最低', conclusion: '与层架差异强相关' },
  { factor: '设备响应效率', contribution: '10%', evidence: '新风响应偏慢', conclusion: '影响恢复耗时和能耗' }
];

export const sopDeviationAnalysis = [
  { sop: '每日巡检', required: '每日2次，异常层架加密', actual: '下层已加密到3次', deviation: '无偏离', action: '保持' },
  { sop: '清舱消毒', required: '采收后完成记录', actual: '待处理', deviation: '未到节点', action: '采收后锁定任务' },
  { sop: '采收分级', required: 'A级/B级/加工级分别记录', actual: '规则已配置', deviation: '待班前确认', action: '采收前检查' },
  { sop: '污染隔离', required: '当天标记、复核、闭环', actual: '隔离复核中', deviation: '存在未闭环', action: '今日完成复核' },
  { sop: '参数调整', required: '审批后生效并留痕', actual: '湿度/CO2阈值已记录', deviation: '无偏离', action: '纳入审计' }
];

export const responsibilityMatrix = [
  { matter: '下层污染疑似复核', owner: '班组长', support: '种植员', deadline: '今日', evidence: '隔离记录 + 采样结果' },
  { matter: '新风响应效率复测', owner: '运维员', support: '管理员', deadline: '本周', evidence: '设备响应曲线' },
  { matter: '采收分级准备', owner: '质检员', support: '种植负责人', deadline: '采收前', evidence: '分级记录表' },
  { matter: '下批次推荐单审批', owner: '种植负责人', support: '管理者', deadline: '下批入舱前', evidence: '参数版本记录' }
];

export const nextBatchRecommendation = [
  { section: '沿用参数', content: '复制中层湿度 88.6% 与分段通风节奏，作为下批次基线。' },
  { section: '调整阈值', content: 'CO2高位预警由20分钟提前到15分钟，湿度下限维持 86%RH 观察。' },
  { section: '重点层架', content: '下层 5-6架作为重点观察层，入舱前复核风道与加湿扩散。' },
  { section: '运维配合', content: '完成新风响应效率复测，形成下一批次放行前条件。' },
  { section: '验收口径', content: '以A级率、成品率、单位成本、异常闭环率作为复盘指标。' }
];

export const knowledgeCards = [
  { title: '下层湿度偏低会拖慢耳片展开', condition: '下层湿度 < 85%RH 且持续超过30分钟', lesson: '稳湿窗口前移，降低新风扰动。' },
  { title: '中层参数可作为高产基线', condition: '湿度稳定、CO2超限少、报警少', lesson: '下批次先复制中层策略，再逐层修正。' },
  { title: '污染疑似要和门磁/巡检联动', condition: '人员进出频次高或局部异常集中', lesson: '把开门记录纳入污染复盘。' },
  { title: '新风偏慢会增加成本与成熟波动', condition: 'CO2回落超过15分钟', lesson: '同步触发运维复测和阶段放行限制。' }
];

export const handoverTemplates = [
  { role: '种植员交班', risk: '下层偏干与污染疑似', todo: '完成隔离点复核、记录形态变化', forbidden: '未复核前不得跨层混合作业', tomorrow: '采收窗口前形态确认' },
  { role: '运维员交班', risk: '新风回落偏慢', todo: '复测新风响应效率，检查风道回流', forbidden: '不得未记录直接改阈值', tomorrow: '输出复测结果' },
  { role: '管理者交班', risk: '暂缓整体放行', todo: '审批下批次推荐单和CAPA验证', forbidden: '未闭环前不得锁定优秀批次模板', tomorrow: '复盘行动项跟进' }
];

export const userQuickActions = [
  { label: '新建巡检记录', target: 'workflow' as ViewKey, detail: '进入今日作业巡检清单' },
  { label: '处理报警', target: 'alarms' as ViewKey, detail: '处理待处理报警' },
  { label: '发起工单', target: 'sop' as ViewKey, detail: '按SOP生成工单' },
  { label: '切换批次', target: 'batch' as ViewKey, detail: '查看当前批次档案' },
  { label: '导出报告', target: 'reports' as ViewKey, detail: '日报/周报/批次报告' },
  { label: '进入演示模式', target: 'presentation' as ViewKey, detail: '汇报演示流程' }
];

export const favoritePages = [
  { title: '三维方舱', target: 'cabin' as ViewKey },
  { title: '总控大脑', target: 'brain' as ViewKey },
  { title: '异常处置', target: 'closure' as ViewKey },
  { title: '采收质量', target: 'harvest' as ViewKey },
  { title: '交付验收', target: 'acceptance' as ViewKey }
];

export const recentObjects = [
  { type: '批次', title: 'JE-202606-001', target: 'batch' as ViewKey },
  { type: '层架', title: '下层5架', target: 'production' as ViewKey },
  { type: '点位', title: 'TH-MAIN-001', target: 'point' as ViewKey },
  { type: '任务', title: '今日巡检任务', target: 'workflow' as ViewKey },
  { type: '报警', title: 'CO2预警事件', target: 'alarms' as ViewKey }
];

export const taskPriorityQueue = [
  { priority: 'P0', task: '安全报警确认', reason: '水浸/烟雾/电气类需优先', target: '报警事件' },
  { priority: 'P1', task: '污染疑似复核', reason: '影响批次放行和损耗', target: '异常处置' },
  { priority: 'P1', task: '阶段放行审批', reason: '决定是否进入下一阶段', target: '主任工作台' },
  { priority: 'P2', task: '新风响应复测', reason: '影响CO2恢复和成本', target: '维护校准' },
  { priority: 'P3', task: '普通巡检', reason: '保持证据链完整', target: '日常工作' }
];

export const confirmationCards = [
  { action: '阶段放行', risk: '放行后将进入下一阶段判定', confirm: '需负责人确认' },
  { action: '批次锁定', risk: '锁定后参数变更需审批', confirm: '需管理员确认' },
  { action: 'CAPA关闭', risk: '关闭后进入归档审计', confirm: '需验证结果' },
  { action: '参数变更', risk: '会影响报警和阶段评分', confirm: '需填写原因' },
  { action: '报警归档', risk: '归档后进入复盘链路', confirm: '需处理说明' }
];

export const onboardingSteps = [
  { step: '1', title: '先看总控', target: '总控大脑', note: '确认当前批次、风险和下一步' },
  { step: '2', title: '再看三维', target: '三维方舱', note: '定位点位和层架' },
  { step: '3', title: '处理报警', target: '报警事件', note: '按优先级闭环' },
  { step: '4', title: '查看批次', target: '批次管理', note: '理解阶段和菌包状态' },
  { step: '5', title: '交付验收', target: '交付验收', note: '汇报或培训时收口' }
];

export const enhancedSearchCategories = [
  { type: '页面', example: '总控大脑 / 采收质量 / 交付验收' },
  { type: '点位', example: 'TH-MAIN-001 / CO2-001 / 下层温湿度' },
  { type: '批次', example: 'JE-202606-001 / 菌包批号' },
  { type: '报警', example: 'CO2预警 / 湿度偏低 / 水浸报警' },
  { type: '工单', example: '新风复测 / 校准计划 / CAPA' },
  { type: '建议', example: '下层稳湿 / 分层采收 / 下批次推荐' },
  { type: '报告', example: '日报 / 批次报告 / 验收清单' }
];

export const userOperationHistory = [
  { time: '09:20', user: '管理员', action: '修改阈值', object: '湿度下限', result: '通过' },
  { time: '10:05', user: '种植员', action: '处理报警', object: '土壤温湿度1', result: '已闭环' },
  { time: '11:30', user: '运维员', action: '关闭工单', object: '新风响应偏慢', result: '待验证' },
  { time: '14:10', user: '种植负责人', action: '提交放行', object: '子实体形成期', result: '暂缓' },
  { time: '16:20', user: '班组长', action: '提交巡检', object: '下层5架', result: '复核中' }
];

export const conceptHelpCenter = [
  { term: '环境评分', explain: '按温度、湿度、CO2、光照、设备稳定性综合扣分。' },
  { term: 'CCP', explain: '关键控制点，用于定义必须严控的生产节点。' },
  { term: 'CAPA', explain: '纠正和预防措施，用于处理工艺偏差并验证结果。' },
  { term: '暂缓放行', explain: '阶段检查未全部通过时，不建议进入下一阶段。' },
  { term: '数据可信度', explain: '标记结论来自实时、人工、报警、模拟推算还是待接数据库。' }
];

export const pageStateSamples = [
  { state: '加载中', message: '正在获取实时点位与批次数据。' },
  { state: '暂无数据', message: '当前筛选条件下没有记录。' },
  { state: '接口异常', message: '后端服务或网络异常，请稍后重试。' },
  { state: '数据待接入', message: '真实数据库/设备协议尚未接入，当前为模拟数据。' },
  { state: '权限不足', message: '当前角色没有审批或配置权限。' }
];

export const userPreferenceItems = [
  { setting: '默认首页', value: '总控大脑' },
  { setting: '默认角色视图', value: '跟随当前角色' },
  { setting: '报警声音', value: '开启' },
  { setting: '任务过滤', value: '只看我的任务' },
  { setting: '大屏模式', value: '手动进入' },
  { setting: '数据刷新频率', value: '5秒' }
];

export const taskFilterOptions = ['全部', '我的', '超时', '高优先级', '已完成'] as const;

export const statusColorStandards = [
  { status: '正常', color: '绿色', use: '指标达标、设备在线、任务完成' },
  { status: '关注', color: '黄色', use: '接近阈值、需要观察' },
  { status: '预警', color: '橙色', use: '持续偏离、需要调整策略' },
  { status: '待处理', color: '红色', use: '超过阈值、需要立即处理' },
  { status: '处理中', color: '蓝色', use: '已派工、正在执行' },
  { status: '已闭环', color: '深绿', use: '处理完成并归档验证' },
  { status: '待复核', color: '紫色', use: '处理完成、等待上级确认' },
  { status: '未通过', color: '暗红', use: '验收未达标，需整改' },
  { status: '待接入', color: '灰色', use: '真实接口或设备暂未接入' }
];

export const bulkActionEntries = [
  { action: '批量确认普通巡检', scope: '全部正常项', result: '减少现场重复点击' },
  { action: '批量导出报表', scope: '日报/周报/批次报告', result: '用于汇报归档' },
  { action: '批量归档已恢复报警', scope: '恢复且已确认报警', result: '进入复盘链路' },
  { action: '批量生成巡检任务', scope: '风险层架/临期点位', result: '派发给对应角色' }
];

export const noteCards = [
  { area: '本页备注', content: '当前页面用于汇报用户体验功能，真实系统接入后支持保存。' },
  { area: '当前批次备注', content: '下层风险仍需交接，采收前优先复核污染疑似。' },
  { area: '当前异常备注', content: 'CO2回落偏慢与新风复测工单关联。' },
  { area: '交接班备注', content: '夜班重点关注湿度下限和门磁开门次数。' }
];

export const exportShortcuts = ['导出PDF', '导出Excel', '打印', '复制汇报摘要'];

export const keyboardHints = [
  { key: '/', action: '打开全局搜索' },
  { key: 'G', action: '进入总控大脑' },
  { key: 'A', action: '查看报警事件' },
  { key: 'T', action: '查看任务/巡检' },
  { key: 'D', action: '进入汇报演示' }
];

export const feedbackEntries = [
  { type: '看不懂', route: '进入帮助中心解释概念' },
  { type: '数据不对', route: '提交数据复核反馈' },
  { type: '建议优化', route: '记录产品建议' },
  { type: '需要运维支持', route: '生成运维协助任务' }
];

export const weakNetworkStatus = [
  { item: '当前网络', value: '在线，弱网策略预留' },
  { item: '数据缓存', value: '待提交记录本地缓存' },
  { item: '自动补传', value: '恢复后按时间顺序补传' },
  { item: '最近同步', value: '刚刚' }
];

export const terminologyModes = [
  { mode: '中文专业术语', example: '关键控制点、纠正预防措施、阶段放行' },
  { mode: '简化术语', example: '重点控制、整改措施、能否进入下一步' },
  { mode: '英文缩写解释', example: 'CCP / CQA / CAPA / KPI' }
];

export const eventRulesCenter = [
  { event: '下层湿度偏低', condition: '湿度 < 85%RH 持续超过30分钟', action: '生成下层稳湿任务', evidence: '温湿度曲线 + 形态记录', review: '24小时复核达标率' },
  { event: 'CO2回落偏慢', condition: '新风开启后 15分钟仍未回落', action: '生成新风效率复测工单', evidence: 'CO2曲线 + 新风状态', review: '运维提交复测结果' },
  { event: '污染疑似', condition: '形态异常集中 + 人工标记', action: '启动隔离流程', evidence: '巡检记录 + 层架档案', review: '采样结果归档' },
  { event: '阶段放行暂缓', condition: '污染或设备响应检查未通过', action: '进入主任工作台待处理', evidence: '放行检查项', review: '审批后归档' }
];

export const parameterSandbox = [
  { scenario: '湿度下限提高 1%RH', quality: '+3% 稳定性', cost: '+¥24/批次', risk: '下层偏干风险降低', decision: '建议试运行' },
  { scenario: 'CO2预警提前 5分钟', quality: '+2% 形态稳定', cost: '+¥18/批次', risk: '新风运行时长增加', decision: '适合当前批次' },
  { scenario: '补光延长 30分钟', quality: '+1% 颜色均匀', cost: '+¥12/批次', risk: '上层收益高，下层有限', decision: '分层执行' },
  { scenario: '巡检下层加密一次', quality: '+4% 证据完整', cost: '+0.5人时', risk: '减少污染扩散不确定性', decision: '立即执行' }
];

export const optimizationModes = [
  { mode: '产量优先', weights: '产量40 / 质量25 / 成本15 / 稳态20', advice: '复制中层参数，分层采收，允许适度增加加湿与巡检。' },
  { mode: '质量优先', weights: '质量45 / 稳态25 / 产量20 / 成本10', advice: '暂缓下层放行，先闭环污染疑似和形态复核。' },
  { mode: '节能优先', weights: '成本40 / 稳态25 / 质量20 / 产量15', advice: '优化新风分段运行，保持补光不延长。' },
  { mode: '稳态优先', weights: '稳态45 / 质量25 / 产量20 / 成本10', advice: '湿度下限提高 1%RH，CO2预警提前 5分钟。' }
];

export const batchProfileTags = [
  { tag: '高湿稳定型', reason: '中层湿度稳定，环境评分较高', action: '可沉淀为局部模板' },
  { tag: '下层风险型', reason: '下层湿度偏低与污染疑似叠加', action: '下批次重点整改' },
  { tag: '污染观察型', reason: '隔离复核未完成', action: '禁止直接复制全批次' },
  { tag: '可复制中层型', reason: '中层产量和A级率领先', action: '作为下一批次基线' },
  { tag: '成本可控型', reason: '单位成本仍低于目标', action: '允许小幅增加稳态投入' }
];

export const exceptionManagement = [
  { exception: '临时提高湿度下限', owner: '种植负责人', reason: '下层偏干', status: '通过', evidence: '参数偏差审计' },
  { exception: '污染复核延迟', owner: '班组长', reason: '等待采样结果', status: '待复核', evidence: '隔离流程记录' },
  { exception: '阶段放行暂缓', owner: '管理者', reason: '设备响应与污染风险未完全通过', status: '待处理', evidence: '主任工作台' },
  { exception: '人工覆盖采收顺序', owner: '种植负责人', reason: '中层成熟度领先', status: '待处理', evidence: '采收前检查清单' }
];

export const approvalFlowSimulation = [
  { item: '阶段放行', status: '待处理', owner: '种植负责人', next: '污染复核完成后提交' },
  { item: '批次锁定', status: '待处理', owner: '管理员', next: '进入采收窗口后锁定阈值' },
  { item: 'CAPA关闭', status: '处理中', owner: '班组长', next: '上传复核结果' },
  { item: '推荐单生效', status: '待处理', owner: '管理者', next: '确认下批次基线参数' },
  { item: '例外归档', status: '待复核', owner: '管理员', next: '形成追溯证据' }
];

export const benchmarkLibrary = [
  { benchmark: '历史优秀批次 JE-202605-001', gap: '当前下层A级率低 12 个百分点', learn: '复制中层稳态参数，不复制下层当前策略' },
  { benchmark: '低损耗批次模板', gap: '当前损耗率接近上限', learn: '污染疑似必须当天闭环' },
  { benchmark: '节能批次模板', gap: '当前新风回落偏慢导致耗时增加', learn: '新风分段运行需复测后启用' },
  { benchmark: '高质量批次模板', gap: '颜色均匀度仍受光照分布影响', learn: '采收前保持分层质量判定' }
];

export const thresholdTemplates = [
  { stage: '菌丝期', temperature: '22-25℃', humidity: '85-90%', co2: '800-1200ppm', light: '弱光/关闭', alarm: '超限10分钟预警' },
  { stage: '现蕾期', temperature: '20-23℃', humidity: '88-92%', co2: '1200-1600ppm', light: '弱散射光', alarm: '连续偏离触发' },
  { stage: '子实体生长期', temperature: '18-22℃', humidity: '85-90%', co2: '1500-2000ppm', light: '500-1000lx', alarm: '核心指标联动' },
  { stage: '成熟期', temperature: '18-21℃', humidity: '80-88%', co2: '适度降低', light: '稳定光照', alarm: '安全优先' }
];

export const apiContracts = [
  { path: '/api/sensors', use: '点位台账与当前值' },
  { path: '/api/sensor-points', use: '三维坐标与安装位置' },
  { path: '/api/telemetry/realtime', use: '实时数据流预留' },
  { path: '/api/telemetry/history', use: '历史曲线与报表' },
  { path: '/api/alarms', use: '报警事件与工单' },
  { path: '/api/control-rules', use: '联动控制策略' },
  { path: '/api/growth-stages', use: '阶段模板与阈值' },
  { path: '/api/batches', use: '种植批次与复盘' },
  { path: '/api/maintenance', use: '维护校准记录' },
  { path: '/api/work-orders', use: '报警处理闭环' }
];

export const reportCards = [
  { title: '运行日报', content: '环境评分、报警、设备状态、今日待办、巡检记录。' },
  { title: '运行周报', content: '达标率趋势、高频报警、设备运行时长、维护待办。' },
  { title: '批次报告', content: '阶段表现、环境画像、异常处理、产量录入预留。' },
  { title: '报警报告', content: '报警来源、处理工单、恢复验证、平均处理时长。' },
  { title: '巡检报告', content: '每日/每周巡检完成率、漏项、责任人记录。' },
  { title: '维护报告', content: '校准计划、到期提醒、传感器健康度、故障记录。' }
];

export const loginRoles = [
  { user: '管理员', role: '系统配置 / 审批 / 用户管理', mode: '全部权限' },
  { user: '种植员', role: '日志 / 巡检 / 报警确认', mode: '生产权限' },
  { user: '运维员', role: '维护校准 / 设备工单', mode: '运维权限' },
  { user: '访客', role: '驾驶舱 / 报表只读', mode: '只读模式' }
];

export const settingGroups = [
  { title: '方舱基础信息', items: ['面积38m²', '作物金耳', '当前批次JE-202606-001'] },
  { title: '生长阶段模板', items: ['菌丝期', '现蕾期', '子实体期', '成熟期'] },
  { title: '报警规则', items: ['环境超限', '设备故障', '安全事件', '数据异常'] },
  { title: '通知规则', items: ['报警通知', '校准到期', '巡检超时', '工单待处理'] },
  { title: '数据保留', items: ['实时缓存', '历史曲线', '报表归档'] }
];

export const demoScenarios = [
  { name: '正常运行', effect: '展示首页、三维点位、总控大脑的正常运行态' },
  { name: '模拟 CO2 偏高', effect: '触发 CO2 预警、新风联动建议、工单预留' },
  { name: '模拟湿度偏低', effect: '触发加湿建议、环境评分扣分、巡检提醒' },
  { name: '模拟污染疑似', effect: '触发隔离流程、证据链缺口、主任工作台风险' },
  { name: '模拟阶段暂缓放行', effect: '触发放行检查、审批流和CAPA处理中' },
  { name: '模拟采收前检查', effect: '展示采收分级、采收前检查和质量规则' },
  { name: '模拟下批次推荐', effect: '展示策略沙盘、推荐单和知识沉淀' },
  { name: '模拟水浸报警', effect: '触发安全 SOP、报警工单、应急提示' },
  { name: '模拟传感器离线', effect: '触发数据可信度下降和维护提醒' },
  { name: '模拟设备故障', effect: '触发设备效能下降和运维工单' },
  { name: '恢复正常', effect: '清除演示态，回到模拟实时运行' }
];
