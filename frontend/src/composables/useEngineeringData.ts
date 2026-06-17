/**
 * 工程交付模块数据 composable
 * 包含 SLA、部署清单、自检、演示脚本等静态数据
 */
import {
  acceptanceMetrics,
  dataLineage,
  integrationStatus,
  releaseNotes,
  helpManual,
  permissionAuditLogs,
  drillScenarios,
  demoFlowScenarios,
  processSwimlanes,
  presentationScript,
  sourceCredibility,
  acceptanceChecklist,
  dataAccessStatus,
  pointBusinessMapping,
  pagePermissionMatrix,
  dataModeBadges,
  legendItems,
  deploymentChecklist,
  deliveryStatus,
  thresholdTemplates,
  apiContracts,
  backupStrategy,
  eventTimeline,
  ruleExplanations,
  demoScripts,
  exportItems,
  roleMatrix,
  anomalyCaseLibrary,
  productionTraceChain,
  apiDocs as apiDocsList
} from '../data/mock-business';

export function useEngineeringData() {
  const slaStatuses = [
    { name: '传感器在线率', value: '100%', note: '目标 ≥ 98%' },
    { name: '数据刷新周期', value: '2.5秒', note: '目标 ≤ 60秒' },
    { name: '报警响应时间', value: '1.2秒', note: '目标 ≤ 5秒' }
  ];

  const selfCheckItems = [
    { item: '前端原型完整性', status: '通过', detail: '68点位 + 7导航分组' },
    { item: '三维模型加载', status: '通过', detail: 'GLTF加载器已预留' },
    { item: 'WebSocket推送', status: '通过', detail: '模拟数据实时推送' },
    { item: '报警闭环链路', status: '预留', detail: '真实数据库接入后启用' }
  ];

  const globalSearchResults = [
    { type: '页面', title: '总控大脑', detail: '进入首页驾驶舱' },
    { type: '点位', title: 'TH-MAIN-001', detail: '主温湿度传感器' },
    { type: '报警', title: 'CO2预警', detail: '当前1720ppm' }
  ];

  const engineeringNavKeys = ['engineering','integration','search','point','explain','acceptance','presentation'];

  const adminNavKeys = ['governance','display','config','history','reports','audit','trace'];

  return {
    slaStatuses,
    selfCheckItems,
    globalSearchResults,
    engineeringNavKeys,
    adminNavKeys,
    acceptanceMetrics,
    dataLineage,
    integrationStatus,
    releaseNotes,
    helpManual,
    permissionAuditLogs,
    drillScenarios,
    demoFlowScenarios,
    processSwimlanes,
    presentationScript,
    sourceCredibility,
    acceptanceChecklist,
    dataAccessStatus,
    pointBusinessMapping,
    pagePermissionMatrix,
    dataModeBadges,
    legendItems,
    deploymentChecklist,
    deliveryStatus,
    thresholdTemplates,
    apiContracts,
    backupStrategy,
    eventTimeline,
    ruleExplanations,
    demoScripts,
    exportItems,
    roleMatrix,
    anomalyCaseLibrary,
    productionTraceChain,
    apiDocsList
  };
}
