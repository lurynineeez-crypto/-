/**
 * 种植高级模块数据 composable
 * 包含批次画像、生长压力、舒适区间、成熟度、阶段放行等派生与静态数据
 */
import { computed } from 'vue';
import type { Ref } from 'vue';
import type { DashboardSummary, SensorPoint, ViewKey } from '../types';
import {
  deriveEnvironmentScore,
  deriveStabilityRisks,
  deriveBatchMetrics,
  deriveMaturityIndex,
  deriveReproducibilityScore,
  deriveEvidenceChainScore,
  deriveControlBrainSummary,
  derivePointConfigRows,
  batchProfile,
  controlRules,
  buildEnvironmentCards,
  uniformity,
  stageCompliance,
  operationSuggestions,
  equipmentEfficiency,
  alarmRootCauses,
  calibrationComparisons,
  yieldCorrelation,
  approvalFlowSimulation,
  growthStages,
  stageAutoDecision,
  growthPressure,
  comfortZones,
  harvestPrediction,
  batchComparison,
  twinBusNodes,
  managementQa,
  notificationItems,
  dataTrustRows,
  dataQualityMetrics,
  managementBoard,
  operationReports,
  reportCards,
  reviewReport,
  batchProfileTags,
  processConsistency
} from '../data/integrated-workbench';
import {
  goldenEarRecipes,
  cultivationCalendar,
  deviationDurations,
  yieldImpact,
  cultureBagArchives,
  contaminationRiskRecords,
  morphologyRecords,
  rackMicroclimateRanking,
  bagLossMetrics,
  harvestGrades,
  rackYieldRecords,
  energyYieldEfficiency,
  processOptimizationAdvice,
  multiBatchExperience,
  anomalyDisposalLevels,
  isolationFlow,
  dynamicHarvestWindow,
  yieldLossEstimations,
  bagLifecycleNodes,
  operationImpactAssessments,
  parameterDeviationAudit,
  reviewMeetingCards,
  reviewMeetingActions,
  ccpControls,
  cqaAttributes,
  capaRecords,
  batchLockRules,
  qualityRuleLibrary,
  batchCostAccounting,
  environmentYieldContribution,
  sopDeviationAnalysis,
  responsibilityMatrix,
  nextBatchRecommendation,
  knowledgeCards,
  handoverTemplates,
  eventRulesCenter,
  parameterSandbox,
  optimizationModes,
  exceptionManagement,
  benchmarkLibrary,
  rackReviewReports,
  harvestPrecheck,
  cultivationOperationTemplates,
  cleanoutFlow,
  biosecurityRecords,
  cultivationKnowledge,
  recipeVersions
} from '../data/mock-business';
import { navGroups, navItems } from '../data/navigation';

export function useCultivationData(
  summary: Ref<DashboardSummary | null>,
  sensors: Ref<SensorPoint[]>,
  statusCounts: Ref<{ normal: number; warning: number; alarm: number; offline: number }>
) {
  /* 派生计算 */
  const environmentScore = computed(() =>
    deriveEnvironmentScore(summary.value?.targetRate ?? 92, summary.value?.onlineRate ?? 98, statusCounts.value.alarm)
  );
  const environmentCards = computed(() => buildEnvironmentCards(sensors.value));
  const stabilityRisks = computed(() =>
    deriveStabilityRisks(statusCounts.value.alarm, statusCounts.value.offline)
  );
  const batchMetrics = computed(() => deriveBatchMetrics(summary.value?.targetRate ?? 92));
  const maturityIndex = computed(() => deriveMaturityIndex(environmentScore.value.score));
  const reproducibilityScore = computed(() => deriveReproducibilityScore());
  const evidenceChainScore = computed(() => deriveEvidenceChainScore());
  const controlBrainSummary = computed(() => deriveControlBrainSummary(environmentScore.value.score));
  const pointConfigRows = computed(() => derivePointConfigRows(sensors.value));
  const productionKpis = computed(() => [
    { name: '环境达标率', value: `${summary.value?.targetRate ?? 92}%`, target: '>= 90%', status: '通过' }
  ]);

  /* 导航 */
  const cultivationNavItems = computed(() =>
    navGroups.find(g => g.name === '种植生命周期')?.items
      .map(k => navItems.find(n => n.key === k))
      .filter(Boolean) as Array<{ key: ViewKey; label: string }> ?? []
  );

  /* 风险雷达 */
  const batchRiskRadar = computed(() => [
    { risk: '湿度波动', level: '中等', score: 65, reason: '下层消杀扩散偏慢' },
    { risk: 'CO2回落', level: '预警', score: 72, reason: '新风响应保守' },
    { risk: '污染疑似', level: '关注', score: 45, reason: '下层局部污染标记' },
    { risk: '设备响应', level: '正常', score: 28, reason: '加湿/空调正常' }
  ]);

  /* 阶段放行检查 */
  const stageReleaseChecks = computed(() => [
    { item: '温度稳定', passed: true, standard: '18-22℃连续2小时', result: '满足' },
    { item: '湿度达标', passed: false, standard: '≥85%RH连续1小时', result: '下层84.9%' },
    { item: 'CO2窗口', passed: true, standard: '1500-2000ppm', result: '满足' },
    { item: '设备无故障', passed: true, standard: '空调/加湿/新风/LED', result: '无故障报警' },
    { item: '安全无报警', passed: false, standard: '无待处理安全报警', result: '1项待复核' }
  ]);

  /* 静态舒适区和压力数据 */
  const comfortZonesData = [
    { name: '温度', zone: '18-22℃', value: '当前20.8℃，处于舒适区' },
    { name: '湿度', zone: '85-90%RH', value: '均值87.4%，下层略低' },
    { name: 'CO2', zone: '1500-2000ppm', value: '当前1720ppm' },
    { name: '光照', zone: '500-1000lx', value: '均匀度86%' }
  ];

  const growthPressureData = [
    { label: '湿度压力', value: '中等', level: '关注' },
    { label: 'CO2回落', value: '偏慢', level: '预警' },
    { label: '形态发育', value: '正常', level: '低' }
  ];

  /* 主任仪表盘 */
  const directorDashboard = computed(() => managementBoard[0]
    ? { release: '观察后再放行', decision: managementBoard[0].value, mainRisk: '下层湿度偏低', owner: '种植负责人', estimatedLoss: '0.8%-2.0%', nextBatchChange: '稳湿窗口前移' }
    : { release: '观察后再放行', decision: '待判断', mainRisk: '下层湿度偏低', owner: '种植负责人', estimatedLoss: '0.8%-2.0%', nextBatchChange: '稳湿窗口前移' }
  );

  return {
    environmentScore,
    environmentCards,
    stabilityRisks,
    batchMetrics,
    maturityIndex,
    reproducibilityScore,
    evidenceChainScore,
    controlBrainSummary,
    pointConfigRows,
    productionKpis,
    cultivationNavItems,
    batchRiskRadar,
    stageReleaseChecks,
    comfortZonesData,
    growthPressureData,
    directorDashboard,
    batchProfile,
    controlRules,
    uniformity,
    stageCompliance,
    operationSuggestions,
    equipmentEfficiency,
    alarmRootCauses,
    calibrationComparisons,
    yieldCorrelation,
    approvalFlowSimulation,
    growthStages,
    stageAutoDecision,
    growthPressure,
    comfortZones,
    harvestPrediction,
    batchComparison,
    twinBusNodes,
    managementQa,
    notificationItems,
    dataTrustRows,
    dataQualityMetrics,
    managementBoard,
    operationReports,
    reportCards,
    reviewReport,
    batchProfileTags,
    processConsistency,
    goldenEarRecipes,
    cultivationCalendar,
    deviationDurations,
    yieldImpact,
    cultureBagArchives,
    contaminationRiskRecords,
    morphologyRecords,
    rackMicroclimateRanking,
    bagLossMetrics,
    harvestGrades,
    rackYieldRecords,
    energyYieldEfficiency,
    processOptimizationAdvice,
    multiBatchExperience,
    anomalyDisposalLevels,
    isolationFlow,
    dynamicHarvestWindow,
    yieldLossEstimations,
    bagLifecycleNodes,
    operationImpactAssessments,
    parameterDeviationAudit,
    reviewMeetingCards,
    reviewMeetingActions,
    ccpControls,
    cqaAttributes,
    capaRecords,
    batchLockRules,
    qualityRuleLibrary,
    batchCostAccounting,
    environmentYieldContribution,
    sopDeviationAnalysis,
    responsibilityMatrix,
    nextBatchRecommendation,
    knowledgeCards,
    handoverTemplates,
    eventRulesCenter,
    parameterSandbox,
    optimizationModes,
    exceptionManagement,
    benchmarkLibrary,
    rackReviewReports,
    harvestPrecheck,
    cultivationOperationTemplates,
    cleanoutFlow,
    biosecurityRecords,
    cultivationKnowledge,
    recipeVersions
  };
}
