/**
 * 集成工作台模拟数据
 * 从 App.vue 抽离，包含批次画像、环境评分派生、控制规则、批量指标等
 * 不新增任何硬件字段，仅基于现有温湿度、CO2、光照和设备状态派生
 */
import { Fan, Lightbulb, Thermometer } from 'lucide-vue-next';
import type { SensorPoint } from '../types';

/* ── 批次基本信息 ── */
export const batchProfile = {
  id: 'JE-202606-001',
  crop: '金耳',
  cabin: '38m² 智能种植方舱',
  startDate: '2026-06-01',
  currentStage: '子实体生长期',
  expectedHarvest: '2026-06-22'
};

/* ── 从传感器派生的环境评分 ── */
export function deriveEnvironmentScore(
  targetRate: number,
  onlineRate: number,
  alarmCount: number
) {
  const score = Math.max(0, Math.min(100, Math.round(targetRate * 0.50 + onlineRate * 0.30 + (100 - alarmCount * 5) * 0.20)));
  const level = score >= 90 ? '优秀' : score >= 80 ? '稳定' : '需关注';
  return {
    score,
    level,
    parts: [
      { label: '温度', value: Math.round(targetRate * 0.30) },
      { label: '湿度', value: Math.round(targetRate * 0.25) },
      { label: 'CO2', value: Math.round(targetRate * 0.25) },
      { label: '光照', value: Math.round(targetRate * 0.20) }
    ],
    deductions: targetRate < 95 ? ['湿度偏低', 'CO2 回落偏慢'] : []
  };
}

/* ── 联动控制规则（中文） ── */
export const controlRules = [
  { name: '湿度联动', when: '舱内湿度低于 85%', action: '启动加湿系统，维持高湿环境', target: '加湿系统' },
  { name: 'CO2 联动', when: 'CO2 高于 2000ppm', action: '启动新风系统并记录通风持续时间', target: '新风系统' },
  { name: '补光联动', when: '光照低于 500lx', action: 'LED 按阶段模板补光', target: '照明系统' }
];

/* ── 环境卡片（基于已有传感器） ── */
export function buildEnvironmentCards(sensors: SensorPoint[]) {
  const important = sensors.slice(0, 8);
  return [
    { title: '温度与湿度', icon: Thermometer, sensors: important, primary: '稳定', secondary: '主层 + 层架同步', insight: '温度处于目标范围内' },
    { title: 'CO2 响应', icon: Fan, sensors: important, primary: '良好', secondary: '在目标时间内回落', insight: '新风响应可接受' },
    { title: '光照状态', icon: Lightbulb, sensors: important, primary: '受控', secondary: '基于阶段模板运行', insight: '光照稳定' }
  ];
}

/* ── 均匀性分析 ── */
export const uniformity = [
  { label: '温度偏差', value: '1.2℃', status: '正常' },
  { label: '湿度偏差', value: '4.6%RH', status: '关注' },
  { label: 'CO2 偏差', value: '210ppm', status: '正常' },
  { label: '光照均匀度', value: '86%', status: '良好' }
];

/* ── 稳定性风险 ── */
export function deriveStabilityRisks(alarmCount: number, offlineCount: number) {
  return [
    { label: '湿度波动', value: alarmCount > 0 ? '中等' : '低', level: alarmCount > 0 ? '关注' : '正常', note: alarmCount > 0 ? '下层扩散偏慢' : '稳定' },
    { label: 'CO2 回落', value: alarmCount > 1 ? '偏慢' : '正常', level: alarmCount > 1 ? '预警' : '正常', note: alarmCount > 1 ? '新风响应保守' : '回落可接受' },
    { label: '离线点位', value: `${offlineCount}`, level: offlineCount ? '需修复' : '正常', note: '在线状态正常' }
  ];
}

/* ── 阶段合规 ── */
export const stageCompliance = [
  { metric: '温度', value: '通过', issue: '范围稳定' },
  { metric: '湿度', value: '复核', issue: '下层略低' },
  { metric: 'CO2', value: '通过', issue: '回落略慢' }
];

/* ── 操作建议 ── */
export const operationSuggestions = [
  { title: '17:30 前复核下层 TH-L2-002 湿度', reason: '下层湿度偏低 84.9%RH', action: '记录复核结果，不达标则提交整改工单' },
  { title: '新风联动后 10 分钟复查 CO2 回落曲线', reason: '新风响应偏慢', action: '确认风机转速和通风口响应，完成后关闭工单' },
  { title: '按子实体期模板维持 500-1000lx 补光至 22:00', reason: '当前光照均匀度 86%', action: '2 小时后复查上层前部 L-TOP-002 是否达标' }
];

/* ── 设备效能 ── */
export const equipmentEfficiency = [
  { name: '加湿系统', hardware: 'HUM-01', score: 92, value: '响应正常', note: '湿度 10 分钟内上升' },
  { name: '新风风机', hardware: 'AIR-02', score: 84, value: '偏慢', note: '回落曲线平缓' },
  { name: '空调系统', hardware: 'AC-03', score: 90, value: '正常', note: '温度稳定' }
];

/* ── 报警根因归类 ── */
export const alarmRootCauses = [
  { source: '环境', cause: '下层湿度偏低', status: '处理中', suggestion: '调整加湿和新风策略' },
  { source: '设备', cause: '新风回落偏慢', status: '关注', suggestion: '检查风机转速和风道' }
];

/* ── 校准前后对比 ── */
export const calibrationComparisons = [
  { sensor: 'TH-MAIN-001', before: '+0.6', after: '+0.1', result: '合格' },
  { sensor: 'CO2-L2-003', before: '-18ppm', after: '-4ppm', result: '合格' }
];

/* ── 批次运行指标 ── */
export function deriveBatchMetrics(targetRate: number) {
  return [
    { label: '环境达标率', value: `${targetRate}%`, detail: '温度、湿度、CO2、光照' },
    { label: '成品率', value: '96.3%', detail: '当前批次估算' },
    { label: 'A级率', value: '72%', detail: '采收分级结果' },
    { label: '单位成本', value: '¥8.23/kg', detail: '模拟核算' }
  ];
}

/* ── 产量与环境关联 ── */
export const yieldCorrelation = [
  { label: '湿度稳定性', value: '高', note: '正向影响产量' },
  { label: 'CO2 超限次数', value: '低', note: '减少损耗' },
  { label: '层间均匀度', value: '86%', note: '影响一致性' }
];

/* ── 审批流模拟 ── */
export const approvalFlowSimulation = [
  { item: '湿度阈值调整', status: '待处理', owner: '班组长', next: '审批后生效' },
  { item: '采收放行', status: '关注', owner: '种植负责人', next: '复核后决定' }
];

/* ── 生长阶段定义 ── */
export const growthStages = [
  { name: '菌丝恢复期', temp: '22-25℃', humidity: '85-90%', co2: '800-1200ppm', light: '弱光/关闭', strategy: '稳温保湿' },
  { name: '子实体生长期', temp: '18-22℃', humidity: '85-90%', co2: '1500-2000ppm', light: '500-1000lx', strategy: '通风补光' }
];

/* ── 阶段自动判定 ── */
export const stageAutoDecision = {
  decision: '持续观察 2 小时',
  basis: ['下层湿度偏低', 'CO2 回落偏慢']
};

/* ── 生长压力指标 ── */
export const growthPressure = [
  { label: '湿度压力', value: '中等' }
];

/* ── 舒适区间 ── */
export const comfortZones = [
  { label: '温度舒适区间', value: '18-22℃' }
];

/* ── 采收窗口预测 ── */
export const harvestPrediction = {
  window: '2026-06-22 ~ 2026-06-24',
  confidence: '78%',
  factors: ['成熟度', '稳定性', '窗口']
};

/* ── 批次对比 ── */
export const batchComparison = [
  { label: '当前批次', value: '更稳定', note: '波动较上批次减少' }
];

/* ── 成熟度指数（计算型） ── */
export function deriveMaturityIndex(envScore: number) {
  return {
    value: 88,
    parts: [
      { label: '运行天数', value: '76%' },
      { label: '环境评分', value: `${envScore}%` },
      { label: '形态记录', value: '82%' },
      { label: '阶段合规', value: '88%' }
    ]
  };
}

/* ── 工艺一致性 ── */
export const processConsistency = [
  { item: '湿度策略', target: '85-90%RH', actual: '87.4%RH', deviation: '6%', verdict: '通过' },
  { item: 'CO2 回落', target: '15 分钟', actual: '18 分钟', deviation: '慢 3 分钟', verdict: '关注' }
];

/* ── 可复制性评估 ── */
export function deriveReproducibilityScore() {
  return {
    score: 88,
    verdict: '部分可复制',
    reasons: ['中层稳定', '下层湿度需复核']
  };
}

/* ── 证据链完整性 ── */
export function deriveEvidenceChainScore() {
  return {
    score: 88,
    missing: ['污染结果', '分级记录', '清舱记录'],
    items: [
      { item: '传感器曲线', status: '完整', detail: '实时/历史入口已预留' }
    ]
  };
}

/* ── 总控大脑摘要 ── */
export function deriveControlBrainSummary(envScore: number) {
  return {
    batch: batchProfile.id,
    stage: batchProfile.currentStage,
    release: '观察后再放行',
    risk: '下层湿度偏低 84.9%RH',
    yield: '预计 136.8 kg',
    cost: '¥8.23/kg',
    quality: 'A级率 72%',
    todo: '17:30 前复核 TH-L2-002 / 新风后 10 分钟复查 CO2 / 采收前形态确认',
    next: '2 小时连续稳定后方可建议进入下一阶段'
  };
}

/* ── 孪生总线节点 ── */
export const twinBusNodes = [
  { node: '当前批次', type: '批次', relation: '绑定阶段与报告', health: '稳定' }
];

/* ── 管理层问答 ── */
export const managementQa = [
  { question: '今天可以采收吗？', answer: '观察后再放行', evidence: '湿度仍需稳定' }
];

/* ── 通知项 ── */
export const notificationItems = [
  { title: '待处理报警', content: '1 项待处理' }
];

/* ── 数据可信度行 ── */
export const dataTrustRows = [
  { name: 'TH-MAIN-001', updated: '实时', delay: '0.5s', drift: '低', calibration: '有效' }
];

/* ── 数据质量指标 ── */
export const dataQualityMetrics = [
  { label: '缺失率', value: '0.2%', status: '正常' }
];

/* ── 管理看板 ── */
export const managementBoard = [
  { label: '放行状态', value: '观察后再放行', note: '管理者视角' }
];

/* ── 运营报告 ── */
export const operationReports = [
  { title: '运行日报', value: '环境达标 92%', note: '已预留' }
];

/* ── 报表中心 ── */
export const reportCards = [
  { title: '报表中心', content: '环境、报警、工单' }
];

/* ── 复盘结论 ── */
export const reviewReport = [
  { label: '复盘结论', value: '持续改进下层湿度' }
];

/* ── 批次画像标签 ── */
export const batchProfileTags = ['稳定', '层间均衡', '低报警'];

/* ── 点位配置行（计算型） ── */
export function derivePointConfigRows(sensors: SensorPoint[]) {
  return sensors.slice(0, 12).map((sensor, index) => ({
    id: sensor.id,
    name: sensor.name,
    type: sensor.category,
    area: sensor.layer,
    threshold: '按规则',
    coordinate: `${sensor.position.x}, ${sensor.position.y}, ${sensor.position.z}`,
    enabled: index % 9 !== 0
  }));
}
